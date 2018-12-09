import 'babel-polyfill';
import express from 'express';
import Expense from './src/controllers/Expense';

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

app.listen(3000)
console.log('app running on port ', 3000);