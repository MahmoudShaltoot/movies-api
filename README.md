<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Nest app to sync TMDB movies.

## Run the project using docker
```bash
# copy .env.example to .env (TMDB_API_KEY env must be set)
cp .env.example .env

docker-compose up # App started listening on PORT 8080
```

## Run the project on local machine

## Prerequisites
Before running the project locally, you need to have the following services installed and running:

**MacOS installation:**
### 1. **PostgreSQL** (version 16+)
  - Install **PostgreSQL**

      ```bash
      brew install postgresql

      brew services start postgresql
      ```

### 2. **Redis (latest stable version)**
  - Install **Redis**

      ```bash
      brew install redis

      brew services start redis
      ```

### 2. **RabbitMQ**
  - Install **RabbitMQ**

      ```bash
      brew install rabbitmq

      brew services start rabbitmq
      ```

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# copy .env.example to .env (TMDB_API_KEY env must be set)
cp .env.example .env

# Initialize movies database
ts-node src/scripts/init-database.ts

# Run migration scripts
npm run typeorm migration:run
```

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## API swagger Documentation 

```bash
# swagger url
$ http://localhost:8080/api
```

## System design

![Alt Text](https://pouch.jumpshare.com/preview/9ZS3ohN5JWboHcMJuHuQE9Kz1hftLlcij9FB0Hx7Hk4R-KSBmEF0y7nWtmd0F1Cml4oKn3ZhYNDjwl2f6r2LCE0gO4yG0Ad8YoJDFyYlESg)

## Stay in touch

- Author - [Linkedin](https://www.linkedin.com/in/mahmoud-shaltoot-84611b149/)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
