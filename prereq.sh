#!/bin/sh

#Installation of prerequisites
sudo apt-get install git
sudo apt-get install curl
sudo apt-get install golang
sudo apt-get install python
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash - 
sudo apt-get install -y nodejs
sudo npm install -g npm@latest
sudo npm install -g @angular/cli

#Installation of docker enginer and docker compose
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository"deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release-cs) stable"
sudo apt-get update
apt-cache policy docker-ce
sudo apt-get install -y docker-ce
sudo apt-get install docker-compose
sudo apt-get upgrade

#Enabling docker daemon
sudo chmod 666 /var/run/docker.sock

#Creation of folder and changing working directory for fabric binary,samples and docker images
mkdir fabric_requirements
cd fabric_requirements
curl -sSL https://bit.ly/2ysbOFE | bash -s

#Appending required paths to bashrc
#The following paths will need to be changed for deployment
echo 'export PATH=$PATH:/usr/local/go/bin:/home/'${USER}'/.go/bin' >> ~/.bashrc
echo 'export GOPATH=/home/'${USER}'/go' >> ~/.bashrc
echo 'export PATH=$PATH:$GOPATH/bin' >> ~/.bashrc
echo 'export PATH=$PATH:'$PWD'/fabric-samples/bin' >> ~/.bashrc   #Current working directory is the newly created folder within the cloned repository (Data-Management-Rail-Industry)
