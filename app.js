import express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import routes from './utils/routes';
import createdb from './models/createRidesdb';
import swaggerDocument from './swagger.json';

const app = express();

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
