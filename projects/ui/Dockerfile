# Base image
FROM node:18.10-alpine as node

# Create app directory
WORKDIR /app/ui

# Copy file with dependencies
COPY package.json /app/ui/
COPY ./packages/ /app/ui/packages/

# Install app dependencies
RUN yarn install --network-timeout 100000

# Copy app files
COPY . /app/ui/

# Set default port
ENV PORT=4201

# Set real-live reloading
ENV CHOKIDAR_USEPOLLING=true

# Expose configured port
EXPOSE 4201

ENV KEYCLOAK_URL=http://keycloak:8080
ENV KEYCLOAK_REALM=dddapp
ENV KEYCLOAK_CLIENT_ID=frontend
ENV BACKEND_BASE_PATH=http://backend:3001

# Run development mode
CMD ["yarn", "run", "start"]



