import "@babel/polyfill";
import express from 'express';
import Expense from './controllers/Expense';
import Category from './controllers/Category';
import Report from './controllers/Report';
import User from './controllers/User';
import authMiddleware from './services/authMiddleware';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  return res.status(200).send({'message': 'YAY! Congratulations! Your first endpoint is working'});
})

app.post('/api/v1/register', User.create);
app.post('/api/v1/login', User.login);

app.post('/api/v1/expenses', Expense.create);
app.get('/api/v1/expenses', Expense.getAll);
app.get('/api/v1/expenses/:id', Expense.getOne);
app.put('/api/v1/expenses/:id', Expense.update);
app.delete('/api/v1/expenses/:id', Expense.delete);

app.get('/api/v1/categories', authMiddleware.validateToken, Category.getAll);
app.post('/api/v1/categories', Category.create);
app.put('/api/v1/categories/:id', Category.update);
app.delete('/api/v1/categories/:id', Category.delete);

app.get('/api/v1/reports/recent', Expense.getRecentExpenses);
app.post('/api/v1/reports/monthly', Report.getMonthly);

app.listen(process.env.PORT || 3001);
console.log('app running on port ', 3001);