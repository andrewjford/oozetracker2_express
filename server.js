import 'babel-polyfill';
import express from 'express';
import Expense from './src/controllers/Expense';
import Category from './src/controllers/Category';
import Report from './src/controllers/Report';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  return res.status(200).send({'message': 'YAY! Congratulations! Your first endpoint is working'});
})
app.post('/api/v1/expenses', Expense.create);
app.get('/api/v1/expenses', Expense.getAll);
app.get('/api/v1/expenses/:id', Expense.getOne);
app.put('/api/v1/expenses/:id', Expense.update);
app.delete('/api/v1/expenses/:id', Expense.delete);

app.get('/api/v1/categories', Category.getAll);
app.post('/api/v1/categories', Category.create);
app.put('/api/v1/categories/:id', Category.update);

app.post('/api/v1/reports/monthly', Report.getMonthly);

app.listen(3001)
console.log('app running on port ', 3001);