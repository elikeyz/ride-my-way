import validate from './validate';
import loginValidate from './loginValidate';
import tokenValidate from './tokenValidate';
import { getRequests, getAllRides, getARide, addRide, addRequest } from '../controllers/rides';
import userController from '../controllers/users';

const routes = (app) => {
  app.get('/', (req, res) => {
    res.status(200).send('Welcome to the Ride My Way API, version 1! \nNavigate to api/v1/rides to get all rides. \nNavigate to api/v1/rides/{id} with ids 1, 2, and 3 to get each corresponding ride. \nRun POST requests on api/v1/rides to add a sample ride and on api/v1/rides/{id}/requests to create a sample request on any of the rides.');
  });
  app.get('/api/v1/rides', tokenValidate, getAllRides);
  app.get('/api/v1/rides/:id', tokenValidate, getARide);
  app.get('/api/v1/users/rides/:id/requests', tokenValidate, getRequests);
  app.post('/api/v1/users/rides', tokenValidate, addRide);
  app.post('/api/v1/rides/:id/requests', tokenValidate, addRequest);
  app.post('/api/v1/auth/signup', validate, userController.signUp);
  app.post('/api/v1/auth/login', loginValidate, userController.login);
};

export default routes;
