# -*- mode: ruby -*-
# vi: set ft=ruby :

require 'yaml'

qi_vars = YAML.load_file('.qi.yml')

app_directory = "/home/vagrant/sync"

app_name = qi_vars["app_name"]

app_start_script = qi_vars["app_start_script"]

app_env_runtime = qi_vars["env_runtime"]

app_tcp_port = qi_vars["app_tcp_port"]

app_start_service = qi_vars["app_start_service"]

app_commands = qi_vars["commands"]

# Check for the existence of 'VM_HOST_TCP_PORT' or 'VM_GUEST_TCP_PORT'
# environment variables. Otherwise if 'nodejs_app_tcp_port' is defined
# in vars.yml then use that port. Failing that use defaults provided
# in this file.
host_tcp_port = ENV["VM_HOST_TCP_PORT"] || app_tcp_port
guest_tcp_port = ENV["VM_GUEST_TCP_PORT"] || app_tcp_port

# By default this VM will use 1 processor core and 1GB of RAM. The 'VM_CPUS' and
# "VM_RAM" environment variables can be used to change that behaviour.
cpus = ENV["VM_CPUS"] || 1
if app_env_runtime == "linux-desktop"
  ram = ENV["VM_RAM"] || 2048
elsif app_env_runtime == "linux"
  ram = ENV["VM_RAM"] || 1048
else
  fail "Unable to find suitable Vagrant box. Please specify valid env_runtime."
end
  
Vagrant.configure(2) do |config|

  if app_env_runtime == "linux-desktop"
    config.vm.box = "inclusivedesign/fedora22"
  else
    config.vm.box = "inclusivedesign/centos7"
  end

  # Your working directory will be synced to /home/vagrant/sync in the VM.
  config.vm.synced_folder ".", "#{app_directory}"

  # List additional directories to sync to the VM in your "Vagrantfile.local" file
  # using the following format:
  # config.vm.synced_folder "../path/on/your/host/os/your-project", "/home/vagrant/sync/your-project"

  if app_tcp_port.to_s.strip.length != 0
    # Port forwarding takes place here. The 'guest' port is used inside the VM
    # whereas the 'host' port is used by your host operating system.
    config.vm.network "forwarded_port", guest: guest_tcp_port, host: host_tcp_port, protocol: "tcp", auto_correct: true
  end

  config.vm.hostname = app_name

  config.vm.provider :virtualbox do |vm|
    vm.customize ["modifyvm", :id, "--memory", ram]
    vm.customize ["modifyvm", :id, "--cpus", cpus]
  end

  config.vm.provision "shell", inline: <<-SHELL
cat <<-'EOF' >/home/vagrant/requirements.yml
- src: https://github.com/idi-ops/ansible-facts
  name: facts

- src: https://github.com/idi-ops/ansible-nodejs
  name: nodejs
EOF
cat <<-'EOF' >/home/vagrant/playbook.yml
---
- hosts: localhost
  user: root

  vars_files:
    - sync/.qi.yml

  vars:
    nodejs_app_name: "{{ app_name }}"
    nodejs_version: "{{ software_stack_version }}"
    nodejs_app_commands: "{{ setup }}"
    nodejs_app_start_script: "{{ app_start_script }}"
    nodejs_app_tcp_port: "{{ app_tcp_port }}"
    nodejs_app_git_clone: false

  roles:
    - facts
    - nodejs
EOF
SHELL

  config.vm.provision "shell", inline: <<-SHELL
    sudo ansible-galaxy install -fr /home/vagrant/requirements.yml
  SHELL

  if app_start_service == true && app_tcp_port.to_s.strip.length != 0
    config.vm.provision "shell", inline: <<-SHELL
      sudo PYTHONUNBUFFERED=1 ansible-playbook /home/vagrant/playbook.yml --tags="install,configure,deploy"
    SHELL
  else
    config.vm.provision "shell", inline: <<-SHELL
      sudo PYTHONUNBUFFERED=1 ansible-playbook /home/vagrant/playbook.yml --tags="install,configure"
    SHELL
  end

  # 'Vagrantfile.local' should be excluded from version control.
  if File.exist? "Vagrantfile.local"
    instance_eval File.read("Vagrantfile.local"), "Vagrantfile.local"
  end

  if app_env_runtime == "linux" && app_start_service == true && app_tcp_port.to_s.strip.length != 0
    # Port 19531 is needed so logs can be viewed using systemd-journal-gateway
    config.vm.network "forwarded_port", guest: 19531, host: 19531, protocol: "tcp",
      auto_correct: true

    if app_start_script.to_s.strip.length != 0
      config.vm.provision "shell", inline: "sudo systemctl restart #{app_name}.service",
        run: "always"
    end

    config.vm.provision "shell", inline: "sudo systemctl restart systemd-journal-gatewayd.service",
      run: "always"
  end

end
