import dotenv from 'dotenv';
import dbconnect from '../utils/dbconnect';

dotenv.config();

export function getRequests(req, res) {
  const text = 'SELECT * FROM requests WHERE rideId = $1';
  const values = [req.params.id];

  try {
    dbconnect.query(text, values, (err, result) => {
      console.log(err, result);
      res.status(200).send({
        message: 'Requests gotten successfully',
        success: true,
        body: result.rows,
      });
    });
  } catch (err) {
    throw err;
  }
}

export function getAllRides(res) {
  const text = 'SELECT * FROM rides';

  try {
    dbconnect.query(text, (err, result) => {
      console.log(err, result);
      res.status(200).send({
        message: 'Rides gotten successfully',
        success: true,
        body: result.rows,
      });
    });
  } catch (err) {
    throw err;
  }
}

export function getARide(req, res) {
  const text = 'SELECT * FROM rides WHERE id = $1';
  const values = [req.params.id];

  try {
    dbconnect.query(text, values, (err, result) => {
      console.log(err, result);
      res.status(200).send({
        message: 'Ride gotten successfully',
        success: true,
        body: result.rows[0],
      });
    });
  } catch (err) {
    throw err;
  }
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
        success: true,
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
        success: true,
        body: result.rows,
      });
    });
  } catch (err) {
    throw err;
  }
}

export function respondToRequest(req, res) {
  let text = 'SELECT * FROM requests WHERE id = $1';
  let values = [req.params.requestid];

  dbconnect.query(text, values, (err, result) => {
    if (!result) {
      res.status(404).send('Request does not exist');
    } else {
      text = 'UPDATE requests SET isAccepted = $1 WHERE rideid = $2 AND id = $3';
      values = [req.body.accept, req.params.rideid, req.params.requestid];

      dbconnect.query(text, values, (err, result) => {
        if (req.body.accept === 'true') {
          res.status(200).json({
            message: 'Ride accepted',
            success: true,
          });
        } else {
          res.status(200).json({ 
            message: 'Ride rejected',
            success: true,
          });
        }
      });
    }
  });
}

