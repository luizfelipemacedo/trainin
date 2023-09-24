import express from 'express';
import routes from './routes/routes';
import { authenticateUser } from '../middleware';

const app = express();

app.use(express.json());

app.use(authenticateUser);
app.use(routes);

app.listen(3000, () => {
    console.log('App listening on port 3000!');
});
