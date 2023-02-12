# Base image
FROM node:18.10-alpine as node

# Create app directory
WORKDIR /app/ui

# Copy file with dependencies
COPY package.json /app/ui/

# Install app dependencies
RUN yarn install --network-timeout 100000

# Copy app files
COPY . /app/ui/

# Set default port
ENV PORT=4201

# Expose configured port
EXPOSE 4201

# Run development mode
CMD ["yarn", "run", "start"]



