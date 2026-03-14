# Stage 1: Use a Node.js base image
FROM node:20-alpine AS base

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
# Use 'npm ci' for faster, more reliable builds in production and omit dev dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# The command to start the server
CMD [ "npm", "start" ]
