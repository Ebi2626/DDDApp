FROM jboss/keycloak:latest

ENV KEYCLOAK_CORS true
ENV KEYCLOAK_CORS_ALLOWED_METHODS "GET, POST, PUT, DELETE, OPTIONS"
ENV KEYCLOAK_CORS_ALLOWED_HEADERS "Authorization, Content-Type" 

COPY ./themes/ /opt/jboss/keycloak/themes/