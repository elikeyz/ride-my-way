import dotenv from 'dotenv';
import dbconnect from '../utils/dbconnect';

dotenv.config();

export function getRequests(req, res) {
  const text = 'SELECT * FROM requests WHERE rideId = $1';
  const values = [req.params.id];

  try {
    dbconnect.query(text, values, (err, result) => {
      if (err) {
        res.status(500).send({
          message: 'Server Error!',
          success: false,
        });
      } else {
        res.status(200).send({
          message: 'Requests gotten successfully',
          success: true,
          body: result.rows,
        });
      }
    });
  } catch (err) {
    throw err;
  }
}

export function getAllRides(req, res) {
  const text = 'SELECT * FROM rides';

  try {
    dbconnect.query(text, (err, result) => {
      if (err) {
        res.status(500).send({
          message: 'Server Error!',
          success: false,
        });
      } else {
        res.status(200).send({
          message: 'Rides gotten successfully',
          success: true,
          body: result.rows,
        });
      }      
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
      if (err) {
        res.status(500).send({
          message: 'Server Error!',
          success: false,
        });
      } else if (result.rowCount < 1) {
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
  } catch (err) {
    throw err;
  }
}

export function addRide(req, res) {
  let text = 'SELECT * FROM rides WHERE date = $1 AND driver = $2 AND location = $3 AND destination = $4 AND departureTime = $5';
  const values = [
    req.body.date,
    req.body.driver.trim(),
    req.body.location.trim(),
    req.body.destination.trim(),
    req.body.departureTime.trim(),
  ];

  dbconnect.query(text, values, (err, result) => {
    if (err) {
      res.status(500).send({
        message: 'Server Error!',
        success: false,
      });      
      console.log(err);
    } else if (result.rowCount >= 1) {
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
}

export function addRequest(req, res) {
  let text = 'SELECT * FROM rides WHERE id = $1';
  let values = [req.params.id];

  dbconnect.query(text, values, (err, result) => {
    if (err) {
      res.status(500).send({
        message: 'Server Error!',
        success: false,
      });
    } else if (result.rowCount < 1) {
      res.status(404).send({
        message: 'Ride does not exist',
        success: false,
      });
    } else {
      text = 'SELECT * FROM requests WHERE passenger = $1 AND rideId = $2';
      values = [
        req.body.passenger.trim(),
        req.params.id,
      ];

      dbconnect.query(text, values, (err, result) => {
        if (err) {
          res.status(500).send({
            message: 'Server Error!',
            success: false,
          });
        } else if (result.rowCount >= 1) {
          res.status(409).send({
            message: 'Request already sent',
            success: false,
          });
        } else {
          text = 'INSERT INTO requests(passenger, rideId) VALUES($1, $2) RETURNING *';

          try {
            dbconnect.query(text, values, (err, result) => {
              if (err) {
                res.status(500).send({
                  message: 'Server Error!',
                  success: false,
                });
              } else {
                res.status(201).send({
                  message: 'Ride requested successfully',
                  success: true,
                  body: result.rows,
                });
              }
            });
          } catch (err) {
            throw err;
          }
        }
      });
    }
  });
}

export function respondToRequest(req, res) {
  let text = 'SELECT * FROM rides WHERE id = $1';
  let values = [req.params.rideid];

  dbconnect.query(text, values, (err, result) => {
    if (err) {
      res.status(500).send({
        message: 'Server Error!',
        success: false,
      });
    } else if (result.rowCount < 1) {
      res.status(404).send({
        message: 'Ride does not exist',
        success: false,
      });
    } else {
      text = 'SELECT * FROM requests WHERE id = $1';
      values = [req.params.requestid];

      dbconnect.query(text, values, (err, result) => {
        if (err) {
          res.status(500).send({
            message: 'Server Error!',
            success: false,
          });
        } else if (!result) {
          res.status(404).send({
            message: 'Request does not exist',
            success: false,
          });
        } else {
          text = 'UPDATE requests SET isAccepted = $1 WHERE rideid = $2 AND id = $3';
          values = [req.body.accept, req.params.rideid, req.params.requestid];

          dbconnect.query(text, values, (err, result) => {
            if (err) {
              res.status(500).send({
                message: 'Server Error!',
                success: false,
              });
            } else if (req.body.accept === 'true') {
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
}

