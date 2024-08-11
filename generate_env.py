import os
import yaml
import re
import subprocess
import argparse

CONFIG_FILE = "config/env.config.yaml"
ENV_TEMPLATES_DIR = "templates"
GENERATED_DIR = "generated_configs"

def load_yaml_config(file_path):
    with open(file_path, 'r') as file:
        return yaml.safe_load(file)

def load_template(template_path):
    with open(template_path, 'r') as file:
        return file.read()

def replace_variables(content, config):
    def replace_match(match):
        var_name = match.group(1)
        return str(config.get(var_name, match.group(0)))
    
    return re.sub(r'\{\{\s*(\w+)\s*\}\}', replace_match, content)

def get_git_branch():
    try:
        return subprocess.check_output(['git', 'rev-parse', '--abbrev-ref', 'HEAD']).decode('utf-8').strip()
    except subprocess.CalledProcessError:
        print("Warning: Unable to determine Git branch. Defaulting to 'dev'.")
        return 'dev'

def determine_environment(branch):
    if branch.startswith('dev'):
        return 'dev'
    elif branch.startswith('qa'):
        return 'qa'
    elif branch in ['master', 'main']:
        return 'prod'
    else:
        print(f"Warning: Unrecognized branch '{branch}'. Defaulting to 'dev' environment.")
        return 'dev'

def generate_env_files(config, is_local):
    base_env = load_template(os.path.join(ENV_TEMPLATES_DIR, "env/.env.base"))
    client_env = load_template(os.path.join(ENV_TEMPLATES_DIR, "env/.env.client"))
    server_env = load_template(os.path.join(ENV_TEMPLATES_DIR, "env/.env.server"))

    # Adjust REACT_APP_BACKEND_URL for local environment
    if is_local:
        client_env = re.sub(
            r'REACT_APP_BACKEND_URL=.*',
            f'REACT_APP_BACKEND_URL=http://localhost:{config["backend_port"]}',
            client_env
        )

    base_env = replace_variables(base_env, config)
    client_env = replace_variables(client_env, config)

    # Handle MongoDB URI
    if is_local:
        server_env = re.sub(
            r'MONGODB_URI=mongodb\+srv://.*',
            f'MONGODB_URI=mongodb://localhost:27017/{config["db_name"]}',
            server_env
        )
    server_env = replace_variables(server_env, config)

    with open( ".env", 'w') as file:
        file.write(base_env)

    with open(".env.client", 'w') as file:
        file.write(f"{base_env}\n{client_env}")

    with open( ".env.server", 'w') as file:
        file.write(f"{base_env}\n{server_env}")

def generate_docker_compose_file(config, is_local):
    template = load_template("templates/docker-compose.template.yml")
    docker_compose_content = replace_variables(template, config)

    with open("docker-compose.yml", 'w') as file:
        file.write(docker_compose_content)

def generate_nginx_config(config, is_local):
    if is_local:
        print("Skipping Nginx config generation for local environment.")
        return

    template = load_template("nginx.template.conf")
    nginx_content = replace_variables(template, config)

    # nginx_config_path = os.path.join(GENERATED_DIR, environment, "nginx.conf")
    # os.makedirs(os.path.dirname(nginx_config_path), exist_ok=True)

    with open("nginx.conf", 'w') as file:
        file.write(nginx_content)

def main():
    parser = argparse.ArgumentParser(description='Generate environment configurations.')
    parser.add_argument('--local', action='store_true', help='Generate configuration for local development')
    args = parser.parse_args()

    config = load_yaml_config(CONFIG_FILE)
    branch = get_git_branch()
    environment = determine_environment(branch)
    
    print(f"Generating configuration for environment: {environment} ({'local' if args.local else 'remote'})")
    
    env_config = config['environments'].get(environment)
    if not env_config:
        print(f"Error: Configuration for environment '{environment}' not found.")
        return

    env_config['environment'] = environment  # Add environment name to config
    generate_env_files(env_config, args.local)
    generate_docker_compose_file(env_config, args.local)
    generate_nginx_config(env_config, args.local)

if __name__ == "__main__":
    main()