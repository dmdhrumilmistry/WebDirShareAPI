FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Copy and Install app dependencies
COPY package*.json .
COPY ./DockerFiles .
RUN npm install

#  Build for production
RUN npm ci --only=production

# Bundle app source
COPY ./src .

# expose PORTS
# default port
EXPOSE 3000
# port from .env file of DockerFiles
EXPOSE 80

# start application
CMD [ "node", "server.js" ]