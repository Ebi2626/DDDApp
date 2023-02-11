# Base image
FROM node:18.10-alpine as node

# Create app directory
WORKDIR /app/ui

# Copy file with dependencies
COPY package.json /app/ui/

# Install app dependencies
RUN yarn install

# Copy app files
COPY . /app/ui/

# Expose configured port
EXPOSE 4201

# Run development mode
CMD ["yarn", "run", "start"]



