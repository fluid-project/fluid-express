# -*- mode: ruby -*-
# vi: set ft=ruby :

# This file loads a generic Vagrantfile that will build the environment
# specified in the .qi.yml file.
#
# DO NOT MODIFY THIS FILE
#
# if you want to change the VMs specifications go to README.md

VAGRANT_VMENV_PATH = `node -e "require('vagrant-vmenv')"`.delete!("\n")
puts "\nCan not find the vagrant-vmenv module, please install it:\n" +
  "npm install -g https://github.com/amatas/vagrant-vmenv.git" if $?.to_i != 0

require_relative( VAGRANT_VMENV_PATH + '/Vagrantfile.rb')

