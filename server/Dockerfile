# Stage 1: Use a Node.js base image
FROM node:20-alpine AS base

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./


# Set the official npm registry to work around potential CDN/network issues
RUN npm config set registry https://registry.npmjs.org/

# Install all dependencies, including devDependencies for nodemon.
RUN npm install

# Copy the rest of the application code
COPY . .

# The command to start the server
CMD [ "npm", "start" ]
