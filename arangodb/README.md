# Data base

## Start server
1. Run contener with arangodb: `docker-compose up -d`
2. Open port 8529 and log in
3. Import collections from this folder manully

Information about contenerization: https://dev.to/sonyarianto/how-to-spin-arangodb-server-with-docker-and-docker-compose-3c00

## Development data
Port: 8529
login: root; pass: {setting in .env}

DB name: DDDApp
DB pass: {settin in .env}

Collections: 
- Targets - documents with targets data
- Users - documents with users data