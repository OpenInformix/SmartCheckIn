

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


docker build -t chkin-app1 .
# delete an image
# docker rmi chkin-app1 <image id>

docker images
# maped local-port:container-port
# run the docker by assigning a container name = chkin-cntn1
docker run -it -d --name chkin-cntn1 -p 3000:3000 -d chkin-app1
```

### Basic test
```bash
https://localhost:3000/
https://<Host IP>:3000/
```


### stop/start container
```bash
docker stop  chkin-cntn1
docker start chkin-cntn1
```


### Getting in to the running container
```bash
docker ps -a
# runs a new command in a running container.
docker exec -it chkin-cntn1 /bin/bash

# If you have to DEBUG
# override the start command with `entrypoint`
docker run -it --entrypoint=/bin/bash $IMAGE -i

# eg:
docker images
# REPOSITORY          TAG       IMAGE ID       CREATED         SIZE
# chkin-app1      latest    21d4907d3cc9   7 minutes ago   1.86GB

# docker run -it --entrypoint=/bin/bash 21d4907d3cc9 -i
```

### DELETE: container/docker image
```bash
docker container rm chkin-cntn1
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

docker ps | grep chkin-app1
# d0d7b996862d

# docker commit [OPTIONS] CONTAINER [REPOSITORY[:TAG]]
docker commit d0d7b996862d  xuser1/chkin-app1

# to push the image to docker hub
# docker push [OPTIONS] NAME[:TAG]
docker push xuser1/chkin-app1
```

### Pull the docker image from the docker hub and run
```bash
docker pull xuser1/chkin-app1
docker run -it -p 3000:3000 -d xuser1/chkin-app1
# https://cloud.docker.com/repository/docker/xuser1/chkin-app1
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

