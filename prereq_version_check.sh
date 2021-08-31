#!/bin/sh

sudo chmod 666 /var/run/docker.sock

echo 'Git'
git version
echo
echo
echo 'Golang'
go version
echo
echo
echo 'cURL'
curl -V
echo
echo
echo 'Node'
node -v
echo  
echo
echo 'Npm'
npm version
echo
echo
echo 'Python'
python -V
echo
echo
echo 'Docker Engine'
docker version
echo
echo
echo 'Docker Compose'
docker-compose version