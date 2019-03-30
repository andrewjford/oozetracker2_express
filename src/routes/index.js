import express from 'express';
import ExpenseController from '../controllers/ExpenseController';
import CategoryController from '../controllers/CategoryController';
import Report from '../controllers/Report';
import User from '../controllers/User';
import authMiddleware from '../services/authMiddleware';

const router = express.Router();

router.get('/', (req, res) => {
  return res.status(200).send({'message': 'YAY!'});
});

router.post('/api/v1/register', User.create);
router.post('/api/v1/login', User.login);
router.delete('/api/v1/users/:id', authMiddleware.validateToken, User.delete);

router.post('/api/v1/expenses', authMiddleware.validateToken, ExpenseController.create);
router.get('/api/v1/expenses', authMiddleware.validateToken, ExpenseController.getAll);
router.get('/api/v1/expenses/:id', authMiddleware.validateToken, ExpenseController.getOne);
router.put('/api/v1/expenses/:id', authMiddleware.validateToken, ExpenseController.update);
router.delete('/api/v1/expenses/:id', authMiddleware.validateToken, ExpenseController.delete);

router.get('/api/v1/categories', authMiddleware.validateToken, CategoryController.getAll);
router.post('/api/v1/categories', authMiddleware.validateToken, CategoryController.create);
router.get('/api/v1/categories/:id', authMiddleware.validateToken, CategoryController.getOne);
router.put('/api/v1/categories/:id', authMiddleware.validateToken, CategoryController.update);
router.delete('/api/v1/categories/:id', authMiddleware.validateToken, CategoryController.delete);

router.get('/api/v1/reports/recent', authMiddleware.validateToken, ExpenseController.getRecentExpenses);
router.post('/api/v1/reports/monthly', authMiddleware.validateToken, Report.getMonthly);

export default router;