# Adidas coding challenge

## Description

This repo contains a series of microservices constructed using `lerna` as a monorepository approach. They can be found in the `packages` folders.

## Useful commands

- `npm run bootstrap`: install and bootstrap all of the dependencies in the 3 microservices.
- `npm run start`: deletes (if running) and recreates all of the docker containers to run the microservices.
- `npm run test:all`: run the existing tests in the microservices.
- `npm run build:all`: build all of the production-ready microservices and creates a folder named `package` to deploy it.

## Interesting files

- `docker-compose.yml`: has the configuration to run all of the microservices in their own independent containers.

* `Jenkinsfile`: has an initial version of a pipeline to deploy the whole project and runs it using `pm2`.

## Side notes

- While this project can be executed with a simple login (after the corresponding register), the idea would be to not open the ports to the exterior in the microservices which are the ones in charge of actually handling data to the database.
- Database user and password is `root` as defined in the `docker-compose.yml`.
