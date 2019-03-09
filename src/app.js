import "@babel/polyfill";
import express from 'express';
import routes from './routes/index';

const app = express();

app.use(express.json());
app.use('/', routes);

app.listen(process.env.PORT || 3001);
console.log('app running on port ', 3001);