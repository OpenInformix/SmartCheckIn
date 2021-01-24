FROM node:14

####### CSDK
ENV INFORMIXDIR /opt/csdk
ENV PATH $INFORMIXDIR/bin:$PATH
ENV LD_LIBRARY_PATH=$INFORMIXDIR/lib:$INFORMIXDIR/lib/esql:$INFORMIXDIR/lib/cli:$LD_LIBRARY_PATH

RUN mkdir /opt/csdk/ &&  mkdir /opt/csdk/t
COPY clientsdk.4.50.FC2.LINUX.tar /opt/csdk/t

# CSD install
RUN /bin/bash -c 'tar -xvf /opt/csdk/t/clientsdk.4.50.FC2.LINUX.tar  -C /opt/csdk/t'
RUN /bin/bash -c '/opt/csdk/t/installclientsdk -i silent -DLICENSE_ACCEPTED=TRUE -DUSER_INSTALL_DIR=/opt/csdk/'
RUN /bin/bash -c '/bin/rm -rf /opt/csdk/t'

####### App 
# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard to include package-lock.json as well
COPY package*.json /usr/src/app/

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY ./server /usr/src/app/server
COPY ./server/MyConfig.json /usr/src/app/server/
COPY ./README.md /usr/src/app/
COPY ./README.Docker.md /usr/src/app/

EXPOSE 3000
CMD [ "node", "server/server.js" ]

