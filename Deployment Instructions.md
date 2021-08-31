# Deployment Instructions

***Note:*** The following instructions are for the local deployment of the network within *Docker Containers*. The entire network will be hosted on one computer.

***Note:*** The following instructions are for the local deployment of the network on a *Linux* system (Ubuntu 20.04).

***Note:*** In order to access the software repository you must have git available, as you're reading this file, that is presumably true, however just in case if you still need to check out the repository you can do so by running the following commands from the folder you want the repository to be stored in:
```
sudo apt install git
git clone https://github.com/B4CMProject/B4CMProjectSoftwareReleases
```

***Note:*** Due to a flaw in the current version of Ubuntu, we also need to tweak the /etc/hosts file. As sudo, open /etc/hosts/ in an apropriate editor and check the first line in the ipv6 section reads as:
```
::1     localhost ip6-localhost ip6-loopback
```

## Requirements

The following prerequisites are required for the deployment of the network:
- Git
- cURL: Latest Package
- Golang: Version *1.13.x*
- Node: Version *8.9* or *10.15.3* or higher
    - ***Note:*** Version *9* is not supported
- npm: Version *5.x or higher*
- Python: Version *2.7.x*
- Docker Engine: Version *17.06.2-ce* or higher
- Docker Compose: Version *1.14* or higher
- Fabric Hyperledger 2.3 Binaries, Samples and Docker Images
- Angular CLI
- MongoDB

In addition to these, there are a numerous of path configuration that are required. These are outlined within the "***`prereq.sh`***" script.

To check which of the prerequisites are installed, and their version, you can run the following script: "***`prereq_version_check.sh`***". With the top level of the repository set as the working directory, the script can be executed with the following terminal command: 

```
bash prereq_version_check.sh
```

***Note:*** You may be prompted to enter the password for the current user.

To install all of the prerequisuites (apart from MongoDB) and to set up the required paths, run the following script: "***`preqreq.sh`***". With the top level of the repository set as the working directory, the script can be executed with the following terminal command: 
```
bash prereq.sh
```
***Note:*** The "***`prereq.sh`***" script can still be executed if some/all of the prerequisites are already installed.

***Note:*** You may be prompted to enter the password for the current user.

***Note:*** You may be prompted to continue the installation of each package. Enter "Y" then press enter to accpet.

***Note:*** The commands within the "***`prereq.sh`***" script can be executed manually within a terminal.

Upon completion of the script, close and reopen the terminal. Then type the following command into the terminal: "***`peer`***". The following output indicates that the prerequistes and paths have been configured correctly:

```
Usage:
  peer [command]

Available Commands:
  chaincode   Operate a chaincode: install|instantiate|invoke|package|query|signpackage|upgrade|list.
  channel     Operate a channel: create|fetch|join|joinbysnapshot|joinbysnapshotstatus|list|update|signconfigtx|getinfo.
  help        Help about any command
  lifecycle   Perform _lifecycle operations
  node        Operate a peer node: start|reset|rollback|pause|resume|rebuild-dbs|upgrade-dbs.
  snapshot    Manage snapshot requests: submitrequest|cancelrequest|listpending
  version     Print fabric peer version.

Flags:
  -h, --help   help for peer

Use "peer [command] --help" for more information about a command.
```

### Installation of MongoDB
For the installation of MongoDB, please see the following instructions: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/#install-mongodb-community-edition

***Note:*** In step 2, please ensure you select the version of Ubuntu (20.04 if you're following us) you are currently running. Similarly, in step 1 of the run process follow the instructions for systemd in step 1. Do set MongoDB to start automatically in step 2.

Once you've verified MongoDB starts by reaching the MongoDB console, you can exit and continue with these instructions.

## Deployment of the Network

The folllowing section will outline how to deploy the network locally within *Docker Containers*. The deployment process has been split into the required tasks.

### Creation of Certificates
The first stage requires the creation of certificates from the certificate authority. To do this, run the following commands within the terminal. ***Note:*** *The following commands assume that the intial working directory is set to the top level of the repository*.

**1.** Altering the current working directory (Data-Management-Rail-Industury/network/channel/create-certificate-with-ca):
```
cd network/channel/create-certificate-with-ca
```
**2.** Intialising the *Docker Containers* required for certificate creation:
```
docker-compose up -d
```
***Note:*** When running the 2nd and 7th command, you may get the following output:
```
ERROR: Couldn't connect to Docker daemon at http+docker://localhost - is it running?
```
If this is the case, run the following command:
```
sudo chmod 666 /var/run/docker.sock
```
**3.** Executing the shell script to create the certificates:
```
./create-certificate-with-ca.sh
```
***Note:*** When running the 3rd, 5th, 8th, 9th, 10th and 16th command, you may get the following output:
```
bash: ./'filename'.sh: Permission denied
```
If this if the case, run the following command: 
```
sudo chmod u+rwx 'filename'.sh
```

***Note:*** When running the 3rd command, you may see errors linked to the certificates. If this if the case, you will need to:
Clear the old certificates out of the fabric wd for each container, e.g.
```
sudo rm -rf fabric-ca/org1/ca-cert.pem
sudo rm -rf fabric-ca/org2/ca-cert.pem
sudo rm -rf fabric-ca/ordererOrg/ca-cert.pem
```

Start the docker container:
```
docker-compose up -d
```

Copy the new certificates back to the directories in crypto-config, e.g.:
```
sudo cp fabric-ca/org1/msp/keystore/5fa161918a49a2e9e66674a02418dac115a0d14df7917c340e3a0e8be02af7d3_sk ../crypto-config/peerOrganizations/org1.example.com/ca/
sudo cp fabric-ca/org2/msp/keystore/af8f7a4316a989c2d10a07683ddada376d0f74c93695c1d351d84bc80b0a3bf9_sk ../crypto-config/peerOrganizations/org2.example.com/ca/
sudo cp fabric-ca/ordererOrg/msp/keystore/9f9d5c2e04dfb6c9e3d6a6175f1b6660995b4d66b91d405fced70ac6f9714b5d_sk ../crypto-config/ordererOrganizations/example.com/msp/
```

Update the FABRIC_CA_SERVER_CA_KEYFILE= lines for org1 and org2 to match the new files, e.g.:
```
- FABRIC_CA_SERVER_CA_KEYFILE=/etc/hyperledger/fabric-ca-server-config/5fa161918a49a2e9e66674a02418dac115a0d14df7917c340e3a0e8be02af7d3_sk
```

### Creation of Artifacts
The next stage requires the creation of the network artifacts (genesis.block). To do this, run the following commands within the terminal. ***Note:*** *The following commands assume that the intial working directory is set to the directory outlined in command one.*

**4.** Altering the current working directory (Data-Management-Rail-Industury/network/channel):
```
cd ..
```
**5.** Executing the shell script to create the artifacts:
```
./create-artifacts.sh
```

### Creation of Network
With the artifacts created, the network can be intialised within *Docker Containers*. To do this, run the following commands within the terminal. ***Note:*** *The following commands assume that the intial working directory is set to the directory outlined in command four.*

**6.** Altering the current working directory (Data-Management-Rail-Industury/network):
```
cd ..
```
**7.** Creating the network within *Docker Containers*:
```
docker-compose up -d
```

### Creation of Channel
With the network intialised, the peers need to be connected via a channel. To do this, run the following commands within the terminal. ***Note:*** *The following commands assume that the intial working directory is set to the directory outlined in command six.*

**8.** Executing the shell script to create the channel:
```
./createChannel.sh
```

### Deployment of Chaincode
The final stage in the network setup is the deployment of the chaincode onto the channel. To do this, run the following commands within the terminal. ***Note:*** *The following commands assume that the intial working directory is set to the directory outlined in command six.*

**9.** Executing the shell script to deploy the chaincode:
```
./deployChaincode.sh
```
**10.** Executing the script to upgrade the chaincode:
```
./upgradeChaincode.sh
```

### Accessing CouchDB
With the network now set up, admins can use CouchDB to monitor the network. To access CouchDB, type the following into a browser:

```
localhost:5984/_utils
```
This will take you to the log in screen. For first time access, the log in credentials are:
```
Username: admin
Password: adminpw
```
The password should be changed via the 'Change Password' option on the toolbar.

## Deployment of API Server

The following section will outline how to deploy the API server required to acess the front-end of the network. To do this, run the following commands within the terminal, ***Note:*** *The following commands assume that the intial working directory is set to the top level of the repository.*

**11.** Starting MongoDB:
```
sudo systemctl start mongod
```
**12.** Altering the current working directory (Data-Management-Rail-Industry/api-server):
```
cd api-server
```
**13.** Installing the Build-Essential package:
```
sudo apt-get install build-essentials
```
**14.** Running npm install:
```
npm i
```
**15.** Altering the current working directory (Data-Management-Rail-Industry/api-server)/src/config:
```
cd src/config
```
**16.** Executing the shell script to generater ccp:
```
./generate-ccp.sh
```
**17.** Altering the current working directory (Data-Management-Rail-Industry/api-server/src)):
```
cd ..
```
**18.** Building the API server:
```
npm run build
```
**19.** Starting the API server:
```
npm run start
```
Once these commands have been executed, the API server should be running. ***Note:*** *Leave this terminal open and running. To end the server, use "ctrl + c."*

## Deployment of the Front End
The following section will outline how to deploy the Front End of the network.  To do this, run the following commands within the a **new terminal**. ***Note:*** *The following commands assume that the intial working directory is set to the top level of the repository.*

**20.** Altering the current working directory (Data-Management-Rail-Industry/Front-end/data-management):
```
cd Front-end/data-management
```
**21.** Running npm install:
```
npm i
```
**22.** Altering the current working directory (Data-Management-Rail-Industry/Front-end/data-management/src/app):
```
cd src/app
```
**23.** Building and serving of angular app:
``` 
ng s
```
Once these commands have been executed, the front-end should be running. ***Note:*** *Leave this terminal open and running. To end the server, use "ctrl + c."*

To access the front end, go to a browser and type the following:
```
localhost:4200
```
This will take you to log in/sign up page of the front end.
