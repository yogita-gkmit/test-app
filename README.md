<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Test Backend Application

## Description

This is a test application designed as a learning playground for mastering AWS services and modern DevOps practices using a NestJS backend.

## Learning Objectives

The primary goal of this project is to implement and understand the following concepts step-by-step:

- **AWS Services**:
  - **EC2**: Deploying and managing virtual servers.
  - **PostgreSQL**: Setting up and connecting to managed relational databases (RDS) or self-hosted instances.
  - **Redis**: Implementing caching solutions using ElastiCache or self-hosted Redis.
  - **AWS CDK**: Infrastructure as Code (IaC) to provision resources, specifically creating EC2 servers programmatically instead of manually.

- **DevOps & Infrastructure**:
  - **CI/CD**: Automating build and test pipelines using GitHub Actions.
  - **Nginx**: Configuring a reverse proxy and web server.
  - **Port Exposure**: Managing security groups and port forwarding.
  - **Domain Management**: Handling domain configuration and DNS.

- **Backend Development**:
  - Building robust end-to-end API endpoints.

## Project setup

```bash
$ npm install
```

## Compile and run the project

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
