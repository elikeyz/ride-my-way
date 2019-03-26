import dotenv from 'dotenv';
import dbconnect from '../utils/dbconnect';

dotenv.config();

export function getRequests(req, res) {
  let text = 'SELECT * FROM users WHERE id = $1';
  let values = [req.userId];

  dbconnect.query(text, values, (err, result) => {
    const user = result.rows[0];

    text = 'SELECT * FROM rides WHERE id = $1';
    values = [req.params.id];

    dbconnect.query(text, values, (err, result) => {
      if (result.rows[0].driver !== user.username) {
        res.status(403).send({
          message: 'You are not authorized to view the requests made to this ride',
          success: false,
        });
      } else {
        text = 'SELECT * FROM requests WHERE rideId = $1';
        dbconnect.query(text, values, (err, result) => {
          res.status(200).send({
            message: 'Requests gotten successfully',
            success: true,
            body: result.rows,
          });
        });
      }
    });
  });
}

export function getAllRides(req, res) {
  const text = 'SELECT * FROM rides';

  dbconnect.query(text, (err, result) => {
    res.status(200).send({
      message: 'Rides gotten successfully',
      success: true,
      body: result.rows,
    });
  });
}

export function getARide(req, res) {
  const text = 'SELECT * FROM rides WHERE id = $1';
  const values = [req.params.id];

  dbconnect.query(text, values, (err, result) => {
    if (result.rowCount < 1) {
      res.status(404).send({
        message: 'Ride does not exist',
        success: false,
      });
    } else {
      res.status(200).send({
        message: 'Ride gotten successfully',
        success: true,
        body: result.rows[0],
      });
    }
  });
}

export function addRide(req, res) {
  let text = 'SELECT * FROM users WHERE id = $1';
  let values = [req.userId];

  dbconnect.query(text, values, (err, result) => {
    const user = result.rows[0];

    text = 'SELECT * FROM rides WHERE date = $1 AND driver = $2 AND location = $3 AND destination = $4 AND departureTime = $5';
    values = [
      req.body.date,
      user.username,
      req.body.location.trim(),
      req.body.destination.trim(),
      req.body.departureTime.trim(),
    ];

    dbconnect.query(text, values, (err, result) => {
      if (result.rowCount >= 1) {
        res.status(409).send({
          message: 'Ride already exists',
          success: false,
        });
      } else {
        text = 'INSERT INTO rides(date, driver, location, destination, departureTime) VALUES($1, $2, $3, $4, $5) RETURNING *';

        dbconnect.query(text, values, (err, result) => {
          res.status(201).send({
            message: 'Ride added successfully',
            success: true,
            body: result.rows,
          });
        });
      }
    });
  });
}

export function addRequest(req, res) {
  let text = 'SELECT * FROM users WHERE id = $1';
  let values = [req.userId];

  dbconnect.query(text, values, (err, result) => {
    const user = result.rows[0];

    text = 'SELECT * FROM rides WHERE id = $1';
    values = [req.params.id];

    dbconnect.query(text, values, (err, result) => {
      if (result.rowCount < 1) {
        res.status(404).send({
          message: 'Ride does not exist',
          success: false,
        });
      } else if (user.username === result.rows[0].driver) {
        res.status(403).send({
          message: 'You cannot request for your own ride',
          success: false,
        });
      } else {
        text = 'SELECT * FROM requests WHERE passenger = $1 AND rideId = $2';
        values = [
          user.username,
          req.params.id,
        ];

        dbconnect.query(text, values, (err, result) => {
          if (result.rowCount >= 1) {
            res.status(409).send({
              message: 'Request already sent',
              success: false,
            });
          } else {
            text = 'INSERT INTO requests(passenger, rideId) VALUES($1, $2) RETURNING *';

            dbconnect.query(text, values, (err, result) => {
              res.status(201).send({
                message: 'Ride requested successfully',
                success: true,
                body: result.rows,
              });
            });
          }
        });
      }
    });
  });
}

export function respondToRequest(req, res) {
  let text = 'SELECT * FROM users WHERE id = $1';
  let values = [req.userId];

  dbconnect.query(text, values, (err, result) => {
    const user = result.rows[0];

    text = 'SELECT * FROM rides WHERE id = $1';
    values = [req.params.rideid];

    dbconnect.query(text, values, (err, result) => {
      if (result.rowCount < 1) {
        res.status(404).send({
          message: 'Ride does not exist',
          success: false,
        });
      } else if (result.rows[0].driver !== user.username) {
        res.status(403).send({
          message: 'You are not authorized to respond to requests made to this ride',
          success: false,
        });
      } else {
        text = 'SELECT * FROM requests WHERE id = $1';
        values = [req.params.requestid];

        dbconnect.query(text, values, (err, result) => {
          if (result.rowCount < 1) {
            res.status(404).send({
              message: 'Request does not exist',
              success: false,
            });
          } else {
            text = 'UPDATE requests SET isAccepted = $1 WHERE rideid = $2 AND id = $3';
            values = [req.body.accept, req.params.rideid, req.params.requestid];

            dbconnect.query(text, values, (err, result) => {
              if (req.body.accept === 'true') {
                res.status(200).json({
                  message: 'Request accepted',
                  success: true,
                });
              } else {
                res.status(200).json({
                  message: 'Request rejected',
                  success: true,
                });
              }
            });
          }
        });
      }
    });
  });
}

export function getUserRequests(req, res) {
  let text = 'SELECT * FROM users WHERE id = $1';
  let values = [req.userId];

  dbconnect.query(text, values, (err, result) => {
    const user = result.rows[0];

    text = 'SELECT * FROM requests WHERE passenger = $1';
    values = [user.username];

    dbconnect.query(text, values, (err, result) => {
      res.status(200).send({
        message: 'User\'s Requests gotten successfully',
        success: true,
        body: result.rows,
      });
    });
  });
}
