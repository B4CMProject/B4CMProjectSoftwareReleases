docker-compose down
docker-compose -f ./channel/create-certificate-with-ca/docker-compose.yaml down
docker-compose -f ./explorer/docker-compose.yaml down
rm channel-network/ -rf 

rm channel/crypto-config/* -rf
rm ./channel/*.tx 
rm ./channel/genesis.block



rm ./channel/create-certificate-with-ca/fabric-ca/ -rf