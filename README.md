# Ride-My-Way

[![Coverage Status](https://coveralls.io/repos/github/elikeyz/ride-my-way/badge.svg?branch=develop)](https://coveralls.io/github/elikeyz/ride-my-way?branch=develop)

[![Build Status](https://travis-ci.org/elikeyz/ride-my-way.svg?branch=develop)](https://travis-ci.org/elikeyz/ride-my-way)

[![Maintainability](https://api.codeclimate.com/v1/badges/a0848080169cc9ea4f22/maintainability)](https://codeclimate.com/github/elikeyz/ride-my-way/maintainability)

A carpooling application that provides drivers with the ability to create ride offers and passengers to join available ride offers.

### Front-end
The proposed views for Ride-My-Way are hosted on GitHub Pages. The pages/views currently being hosted are:

- Index
- Login
- Sign Up
- Available Rides
- Create Ride Offer
- Profile
- Ride Requests

### Backend
The backend implementation is currently hosted on Heroku. The following endpoints have been implemented:

Get all ride offers [GET: /api/v1/rides]
Get a ride offer[GET: /api/v1/rides/:rideId]
Get all requests for a ride offer[POST: /api/v1/users/rides/:rideId/requests]
Create a ride offer [POST: /api/v1/users/rides]
Request to Join a ride[POST: /api/v1/rides/:rideId/requests]
Sign up[POST: /api/v1/auth/signup]
Login[POST: /api/v1/auth/login]
Respond to a ride request [PUT: /api/v1/users/rides/:rideId/requests/:requestId]

### Technologies used
The following technologies are currently being used in the development of the application:

HTML
CSS
Javascript
NodeJS
Express
Babel
Body-parser
Mocha, Chai and Nyc (for testing)

### Base URL

https://shrouded-plains-80012.herokuapp.com/
