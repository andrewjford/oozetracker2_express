import "@babel/polyfill";
import express from 'express';
import routes from './routes/index';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());
app.enable("trust proxy");
app.use('/', routes);

export default app;