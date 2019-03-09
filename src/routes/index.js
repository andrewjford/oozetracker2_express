import express from 'express';
import Expense from '../controllers/Expense';
import Category from '../controllers/Category';
import Report from '../controllers/Report';
import User from '../controllers/User';
import authMiddleware from '../services/authMiddleware';

const router = express.Router();

router.get('/', (req, res) => {
  return res.status(200).send({'message': 'YAY!'});
});

router.post('/api/v1/register', User.create);
router.post('/api/v1/login', User.login);

router.post('/api/v1/expenses', authMiddleware.validateToken, Expense.create);
router.get('/api/v1/expenses', authMiddleware.validateToken, Expense.getAll);
router.get('/api/v1/expenses/:id', authMiddleware.validateToken, Expense.getOne);
router.put('/api/v1/expenses/:id', authMiddleware.validateToken, Expense.update);
router.delete('/api/v1/expenses/:id', authMiddleware.validateToken, Expense.delete);

router.get('/api/v1/categories', authMiddleware.validateToken, Category.getAll);
router.post('/api/v1/categories', authMiddleware.validateToken, Category.create);
router.put('/api/v1/categories/:id', authMiddleware.validateToken, Category.update);
router.delete('/api/v1/categories/:id', authMiddleware.validateToken, Category.delete);

router.get('/api/v1/reports/recent', authMiddleware.validateToken, Expense.getRecentExpenses);
router.post('/api/v1/reports/monthly', authMiddleware.validateToken, Report.getMonthly);

export default router;