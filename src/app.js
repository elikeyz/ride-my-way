import express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './utils/routes';
import createdb from './models/createRidesdb';
import swaggerDocument from '../swagger.json';

dotenv.config();
const app = express();

app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, UPDATE, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, token');
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

createdb();
routes(app);

const server = app.listen((process.env.PORT || 8081), () => {
  const { port } = server.address();
  console.log(`Ride-My-Way app listening at port ${port}`);
});

export default app;
