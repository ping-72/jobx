#!/bin/bash

# Function to check certificate validity
check_cert() {
    local env=$1
    local domain
    case $env in
        dev) domain="dev.ruthi.in" ;;
        qa) domain="qa.ruthi.in" ;;
        prod) domain="ruthi.in" ;;
        *) echo "Invalid environment"; exit 1 ;;
    esac
    
    if ! openssl x509 -checkend 2592000 -noout -in certs/$env/fullchain.pem; then
        echo "Certificate for $env will expire within 30 days. Renewing..."
        ./renew_certs.sh
    else
        echo "Certificate for $env is valid."
    fi
}

# Function to generate configurations
generate_config() {
    local env=$1
    python3 generate_env.py --env $env
}

# Function to start services
start_services() {
    local env=$1
    docker-compose -f generated_configs/$env/docker-compose.yml up -d
}

# Function to stop services
stop_services() {
    local env=$1
    docker-compose -f generated_configs/$env/docker-compose.yml down
}

# Function to restart services
restart_services() {
    local env=$1
    stop_services $env
    start_services $env
}

# Main script
case $1 in
    build)
        env=${2:-all}
        if [ "$env" = "all" ]; then
            for e in dev qa prod; do
                check_cert $e
                generate_config $e
                start_services $e
            done
        else
            check_cert $env
            generate_config $env
            start_services $env
        fi
        ;;
    stop)
        env=${2:-all}
        if [ "$env" = "all" ]; then
            for e in dev qa prod; do
                stop_services $e
            done
        else
            stop_services $env
        fi
        ;;
    restart)
        env=${2:-all}
        if [ "$env" = "all" ]; then
            for e in dev qa prod; do
                check_cert $e
                generate_config $e
                restart_services $e
            done
        else
            check_cert $env
            generate_config $env
            restart_services $env
        fi
        ;;
    renew-certs)
        ./renew_certs.sh
        ;;
    *)
        echo "Usage: $0 {build|stop|restart|renew-certs} [environment]"
        echo "Environment can be dev, qa, prod, or all (default)"
        exit 1
        ;;
esac