### Smart Check-In

### setup
```bash
# one time setup
git clone https://github.com/OpenInformix/SmartCheckIn.git
cd SmartCheckIn

npm install
```


### database connection info
- [Database Setup](./server/README.setup.md)
```bash
cd SmartCheckIn/server
cp SampleConfig.json MyConfig.json

# update MyConfig.json with connectivity information to your database.
udate MyConfig.json
```

### Start the application web server
```bash
cd SmartCheckIn
node server/server.js
```


### DockerBuild
- [Docker Build](./README.Docker.md)

```bash
# cd SmartCheckIn
# FYI: make sure csdk install tar is coped
ls -l ./assets/clientsdk.4.50.FC2.LINUX.tar

# docker build
# docker build -t chkin-app1 .

# docker run -it -d --name chkin-cntn1 -p 3000:3000 -d chkin-app1
# docker run -it -d --name chkin-cntn1 -p 3000:3000 -d xuser1/chkin-app1
# https://<Host IP>:3000/
```
