import express from 'express';
import bodyParser from 'body-parser';
import routes from './utils/routes';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes(app);

const server = app.listen((process.env.PORT || 8081), () => {
  const { port } = server.address();
  console.log(`Ride-My-Way app listening at port ${port}`);
});

export default app;
