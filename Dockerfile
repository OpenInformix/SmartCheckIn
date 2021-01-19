FROM node:14

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
COPY ./README.md /usr/src/app/
COPY ./README.Docker.md /usr/src/app/

EXPOSE 3000
CMD [ "node", "server/server.js" ]

