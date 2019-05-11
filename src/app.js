import "@babel/polyfill";
import express from 'express';
import routes from './routes/index';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.enable("trust proxy");
app.use('/', routes);

export default app;