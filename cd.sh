#!/bin/bash

set -e

# Configuration
REMOTE_USER="ruthi"
REMOTE_HOST="20.235.245.244"
REMOTE_PATH="/home/ruthi/ruthi/jobx"
ADMIN_EMAIL="admin@ruthi.in"

# Function to run commands with sudo
run_sudo() {
    echo "$SUDO_PASS" | sudo -S bash -c "$1"
}

# Function to run commands on the remote server
run_remote() {
    if [ "$IS_REMOTE" = true ]; then
        eval "$1"
    else
        ssh $REMOTE_USER@$REMOTE_HOST "$1"
    fi
}

# Function to copy files to the remote server
copy_to_remote() {
    if [ "$IS_REMOTE" = true ]; then
        cp -r "$1" "$2"
    else
        scp -r "$1" $REMOTE_USER@$REMOTE_HOST:"$2"
    fi
}

# Parse command line arguments
BRANCH=""
ENVIRONMENT=""
IS_REMOTE=false

while [[ "$#" -gt 0 ]]; do
    case $1 in
        --branch) BRANCH="$2"; shift ;;
        --env) ENVIRONMENT="$2"; shift ;;
        --remote) IS_REMOTE=true ;;
        *) echo "Unknown parameter: $1"; exit 1 ;;
    esac
    shift
done

if [ -z "$BRANCH" ] || [ -z "$ENVIRONMENT" ]; then
    echo "Error: Branch and environment must be specified."
    echo "Usage: $0 --branch <branch_name> --env [dev|qa|prod] [--remote]"
    exit 1
fi

# Ask for sudo password once
read -s -p "Enter sudo password: " SUDO_PASS
echo

# Server setup
echo "Setting up server..."

# Checkout the specified branch
run_remote "cd $REMOTE_PATH && git fetch --all && git checkout $BRANCH && git pull"

# Copy templates/env folder if it doesn't exist
run_remote "[ -d $REMOTE_PATH/templates/env ] || mkdir -p $REMOTE_PATH/templates/env"
if [ "$IS_REMOTE" = false ]; then
    copy_to_remote "./templates/env" "$REMOTE_PATH/templates/"
fi

# Generate environment files and configurations
echo "Generating environment files and configurations..."
run_remote "cd $REMOTE_PATH && python3 generate_env.py"

# Configure Nginx
echo "Configuring Nginx..."
NGINX_CONF="ruthi-$ENVIRONMENT"
run_remote "$(declare -f run_sudo); run_sudo 'cp $REMOTE_PATH/nginx.conf /etc/nginx/sites-available/$NGINX_CONF'"
run_remote "$(declare -f run_sudo); run_sudo 'ln -sf /etc/nginx/sites-available/$NGINX_CONF /etc/nginx/sites-enabled/'"

# SSL Certificate handling
handle_ssl_cert() {
    local domain=$1
    if [ ! -d "/etc/letsencrypt/live/$domain" ]; then
        echo "Obtaining new SSL certificate for $domain"
        run_remote "$(declare -f run_sudo); run_sudo 'certbot certonly --nginx -d $domain --non-interactive --agree-tos -m $ADMIN_EMAIL'"
    else
        echo "Using existing SSL certificate for $domain"
    fi
}

handle_ssl_cert $domain

# Restart Nginx to apply changes
run_remote "$(declare -f run_sudo); run_sudo 'nginx -t && systemctl reload nginx'"

# Start or restart Docker containers
run_remote "cd $REMOTE_PATH && docker-compose down && docker-compose up -d --build"

echo "Deployment complete for $ENVIRONMENT environment on branch $BRANCH."