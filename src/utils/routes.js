import validate from './validators/validate';
import loginValidate from './validators/loginValidate';
import tokenValidate from './validators/tokenValidate';
import rideValidate from './validators/rideValidate';
import rideDateValidate from './validators/rideDateValidate';
import responseValidate from './validators/responseValidate';
import idValidate from './validators/idValidate';
import responseIdValidate from './validators/responseIdValidate';
import verifyNewUser from './verifiers/verifyNewUser';
import verifyUserAccount from './verifiers/verifyUserAccount';
import { getRequests, getAllRides, getARide, addRide, addRequest, respondToRequest, getUserRequests } from '../controllers/rides';
import userController from '../controllers/users';

const routes = (app) => {
  app.get('/', (req, res) => {
    res.status(200).send({ message: 'Welcome to the Ride My Way API, version 1! Navigate to /api-docs to view the documentation' });
  });
  app.get('/api/v1/rides', tokenValidate, getAllRides);
  app.get('/api/v1/rides/:id', tokenValidate, idValidate, getARide);
  app.get('/api/v1/users/rides/:id/requests', tokenValidate, idValidate, getRequests);
  app.get('/api/v1/users/requests', tokenValidate, getUserRequests);
  app.post('/api/v1/users/rides', tokenValidate, rideValidate, rideDateValidate, addRide);
  app.post('/api/v1/rides/:id/requests', tokenValidate, idValidate, addRequest);
  app.post('/api/v1/auth/signup', loginValidate, validate, verifyNewUser, userController.signUp);
  app.post('/api/v1/auth/login', loginValidate, verifyUserAccount, userController.login);
  app.put('/api/v1/users/rides/:rideid/requests/:requestid', tokenValidate, responseIdValidate, responseValidate, respondToRequest);
};

export default routes;
