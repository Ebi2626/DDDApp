# Base image
FROM node:16-alpine as node

# Create app directory
WORKDIR /app/api

# Copy file with dependencies
COPY package.json /app/api/

# Install app dependencies
RUN yarn install

# Copy app files
COPY . /app/api/

# Expose nest.js default port
EXPOSE 3001

# Run development mode
CMD ["yarn", "run", "start:dev"]

