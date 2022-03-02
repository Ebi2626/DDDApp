# Data Driven Development App (API)

It is a REST API which will be used for communication with arangoDB by Angular Data Driven Development App. 

## Install and run

TODO: we will contenerize whole app so you will have to download whole repo and use docker to install your instance of an app

## Main assumptions

1. Api will be written with REST principles in mind.
2. It will two base modules:
  - public - to communicate with frontend
  - private - to communicate with backend
3. It will allow for all CRUD operations
4. It's logging logic will be implemented in keycloack
5. It will use *JSON* format to communication
6. Edpoint should have test and description in Swagger