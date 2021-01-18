

### Setup
```bash
# one time setup
git clone https://github.com/OpenInformix/SmartCheckIn.git
cd SmartCheckIn

npm install
```


### Sample Docker Build & Test
```bash
# to cleanup then only
docker system prune
docker system prune -a


docker build -t smart-cin-app1 .
# delete an image
# docker rmi smart-cin-app1 <image id>

docker images
# maped local-port:container-port
# run the docker by assigning a container name = fend-cnt1
docker run -it -d --name fend-cnt1 -p 3000:3000 -d smart-cin-app1
```

### Basic test
```bash
http://localhost:3000/
```


### stop/start container
```bash
docker stop  fend-cnt1
docker start fend-cnt1
```


### Getting in to the running container
```bash
docker ps -a
# runs a new command in a running container.
docker exec -it fend-cnt1 /bin/bash
```

### DELETE: container/docker image
```bash
docker container rm fend-cnt1
# fcai-cnt1

docker ps -a
# CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES

# To remove docker image
docker images
docker image rm <image id>
```



### Create a new docker image from the container and push to docker hub
```bash
docker login
docker logout

docker ps | grep smart-cin-app1
# d0d7b996862d

# docker commit [OPTIONS] CONTAINER [REPOSITORY[:TAG]]
docker commit d0d7b996862d  xuser1/smart-cin-app1

# to push the image to docker hub
# docker push [OPTIONS] NAME[:TAG]
docker push xuser1/smart-cin-app1
```

### Pull the docker image from the docker hub and run
```bash
docker pull xuser1/smart-cin-app1
docker run -it -p 3000:3000 -d xuser1/smart-cin-app1
# https://cloud.docker.com/repository/docker/xuser1/smart-cin-app1
```


### Cleanup
```bash
# incase if you have to clean the existing images
docker system prune
docker system prune -a

# logout from container registry
docker logout
```



### Firewall
```bash
# by any chance if you have to shutdown the firewall then.
sudo systemctl stop firewalld.service

# Then to bring it up
sudo systemctl start firewalld.service
```

