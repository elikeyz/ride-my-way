import validate from './validate';
import loginValidate from './loginValidate';
import tokenValidate from './tokenValidate';
import rideValidate from './rideValidate';
import responseValidate from './responseValidate';
import idValidate from './idValidate';
import responseIdValidate from './responseIdValidate';
import { getRequests, getAllRides, getARide, addRide, addRequest, respondToRequest } from '../controllers/rides';
import userController from '../controllers/users';

const routes = (app) => {
  app.get('/', (req, res) => {
    res.status(200).send('Welcome to the Ride My Way API, version 1! \nNavigate to api/v1/rides to get all rides. \nNavigate to api/v1/rides/{id} with ids 1, 2, and 3 to get each corresponding ride. \nRun POST requests on api/v1/rides to add a sample ride and on api/v1/rides/{id}/requests to create a sample request on any of the rides.');
  });
  app.get('/api/v1/rides', tokenValidate, getAllRides);
  app.get('/api/v1/rides/:id', tokenValidate, idValidate, getARide);
  app.get('/api/v1/users/rides/:id/requests', tokenValidate, idValidate, getRequests);
  app.post('/api/v1/users/rides', tokenValidate, rideValidate, addRide);
  app.post('/api/v1/rides/:id/requests', tokenValidate, idValidate, addRequest);
  app.post('/api/v1/auth/signup', validate, userController.signUp);
  app.post('/api/v1/auth/login', loginValidate, userController.login);
  app.put('/api/v1/users/rides/:rideid/requests/:requestid', tokenValidate, responseIdValidate, responseValidate, respondToRequest);
};

export default routes;
