import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import routes from './routes/routes';
import { authenticateUser, errorHandler } from '../middleware';

const app = express();

app.use(express.json());
app.use(cors());

app.use(authenticateUser);
app.use(routes);
app.use(errorHandler);

app.listen(3000, () => {
    console.log('App listening on port 3000!');
});
