import os
import yaml
import re
import subprocess

CONFIG_FILE = "config/env.config.yaml"
ENV_TEMPLATES_DIR = "templates"
GENERATED_DIR = "generated_configs"

def load_yaml_config(file_path):
    with open(file_path, 'r') as file:
        return yaml.safe_load(file)

def load_template(file_name):
    template_path = os.path.join(ENV_TEMPLATES_DIR, file_name)
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

def generate_env_files(environment, config):
    base_env = load_template("env/.env.base")
    client_env = load_template("env/.env.client")
    server_env = load_template("env/.env.server")

    base_env = replace_variables(base_env, config)
    client_env = replace_variables(client_env, config)
    server_env = replace_variables(server_env, config)

    env_dir = os.path.join(GENERATED_DIR, environment)
    os.makedirs(env_dir, exist_ok=True)

    with open(os.path.join(env_dir, ".env"), 'w') as file:
        file.write(base_env)

    with open(os.path.join(env_dir, ".env.client"), 'w') as file:
        file.write(f"{base_env}\n{client_env}")

    with open(os.path.join(env_dir, ".env.server"), 'w') as file:
        file.write(f"{base_env}\n{server_env}")

def generate_docker_compose_file(environment, config):
    template = load_template("docker-compose.template.yml")
    docker_compose_content = replace_variables(template, config)

    docker_compose_path = os.path.join(GENERATED_DIR, environment, "docker-compose.yml")
    os.makedirs(os.path.dirname(docker_compose_path), exist_ok=True)

    with open(docker_compose_path, 'w') as file:
        file.write(docker_compose_content)

def generate_nginx_config(environment, config):
    template = load_template("nginx.template.conf")
    nginx_content = replace_variables(template, config)

    nginx_config_path = os.path.join(GENERATED_DIR, environment, "nginx.conf")
    os.makedirs(os.path.dirname(nginx_config_path), exist_ok=True)

    with open(nginx_config_path, 'w') as file:
        file.write(nginx_content)

def main():
    config = load_yaml_config(CONFIG_FILE)
    branch = get_git_branch()
    environment = determine_environment(branch)
    
    print(f"Generating configuration for environment: {environment}")
    
    env_config = config['environments'].get(environment)
    if not env_config:
        print(f"Error: Configuration for environment '{environment}' not found.")
        return

    env_config['environment'] = environment  # Add environment name to config
    generate_env_files(environment, env_config)
    generate_docker_compose_file(environment, env_config)
    generate_nginx_config(environment, env_config)

if __name__ == "__main__":
    main()