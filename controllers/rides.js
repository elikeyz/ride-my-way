import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import dbconnect from '../utils/dbconnect';

dotenv.config();


export function getAllRides(req, res) {
  const text = 'SELECT * FROM rides';

  try {
    dbconnect.query(text, (err, result) => {
      console.log(err, result);
      res.status(201).send({
        message: 'Rides gotten successfully',
        body: result.rows,
      });
    });
  } catch (err) {
    throw err;
  }
}

export function getARide(req, res) {
  fs.readFile('./models/rides.json', 'utf8', (err, data) => {
    const rides = JSON.parse(data);
    const ride = rides[`ride${req.params.id}`];
    res.status(200).send({
      message: 'Ride gotten successfully',
      success: true,
      body: JSON.stringify(ride),
    });
  });
}

export function addRide(req, res) {
  const text = 'INSERT INTO rides(date, driver, location, destination, departure_time) VALUES($1, $2, $3, $4, $5) RETURNING *';
  const values = [
    req.body.date,
    req.body.driver,
    req.body.location,
    req.body.destination,
    req.body.departure_time];

  try {
    dbconnect.query(text, values, (err, result) => {
      console.log(err, result);
      res.status(201).send({
        message: 'Ride added successfully',
        body: result.rows,
      });
    });
  } catch (err) {
    throw err;
  }
}

export function addRequest(req, res) {
  const text = 'INSERT INTO requests(passenger, rideId) VALUES($1, $2) RETURNING *';
  const values = [
    req.body.passenger,
    req.params.id,
  ];

  try {
    dbconnect.query(text, values, (err, result) => {
      console.log(err, result);
      res.status(201).send({
        message: 'Ride requested successfully',
        body: result.rows,
      });
    });
  } catch (err) {
    throw err;
  }
}
