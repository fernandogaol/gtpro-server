# It Takes A Village

> A community based altruistic application

[![Build Status][travis-image]][travis-url]
[![NPM Version][npm-image]][npm-url]

## Live App link

<<<<<<< HEAD

- # https://itav-app.now.sh/login
- https://itav-app.now.sh/

  > > > > > > > master

- Client deployed on zeit
- Server deployed on Heroku

## App Images

<p align="center">
  <img width="223" height="395.5" src="assets/Login.png">
  <img width="223" height="395.5" src="assets/Registration.png">
  <img width="223" height="395.5" src="assets/Landing.png">
  <img width="223" height="395.5" src="assets/Dashboard.png">
  <img width="223" height="395.5" src="assets/CreateStory.png">
</p>

## Summary

It Takes a Village is a community based altruism application that lets users notify their community that they are in need of assistance, be it food, clothing, transportation, etc. A user can post a story explaining what kind of help they are in need of, and other users in their real world "community" (based off geo-location proximity) can indicate whether they are able to provide aid, or can share to others in their off-app communities that might be able to help.

## Technology Stack

### Front End

- HTML5
- CSS
- JavaScript
- React
- Enzyme
- Redux

### Back End

- Node.js
- Express
- Mocha
- Chai
- PostgreSQL
- Bcryptjs
- Passport
- JWT Authentication

### Development Environment

- Git
- GitHub
- Postman
- DBeaver
- Visual Studio Code
- GitHub Projects

## API Documentation

### API endpoints

- POST to '/api/auth/login' authenticate and login returning user
- POST to '/api/auth/refresh' refresh Auth token
- POST to '/api/users' posts new user info into database
- GET to '/api/users' get all users from database
- GET to '/api/user/:id' get all stories by id
- DELETE to '/api/user/:id' delete a user by id
- PATCH to '/api/user/:id' update a user by id
- GET to '/api/story' get all stories from database
- POST to '/api/story' posts a story to the database
- GET to '/api/story/:id' get all stories by id
- DELETE to '/api/story/:id' delete a story by id
- PATCH to '/api/story/:id' update a story by id
- GET to '/api/comment' get all comments from database
- POST to '/api/comment' posts a comment to the database
- GET to '/api/comment/:id' get all comments by id
- DELETE to '/api/comment/:id' delete a comment by id
- PATCH to '/api/comment/:id' update a comment by id

<!-- Markdown link & img dfn's -->

[npm-image]: https://img.shields.io/npm/v/datadog-metrics.svg?style=flat-square
[npm-url]: https://npmjs.org/package/datadog-metrics
[travis-image]: https://img.shields.io/travis/dbader/node-datadog-metrics/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/dbader/node-datadog-metrics

---
