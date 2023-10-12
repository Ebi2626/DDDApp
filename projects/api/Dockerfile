# Base image
FROM node:18.10-alpine as node

# Create app directory
WORKDIR /app/api

# Copy file with dependencies
COPY package.json /app/api/
COPY ./packages/ /app/api/packages/

# Install app dependencies
RUN yarn install --network-timeout 100000

# Copy app files
COPY . /app/api/

# Set default port
ENV PORT=3001

# Expose configured port
EXPOSE 3001

# Run development mode
CMD ["yarn", "run", "start:dev"]

