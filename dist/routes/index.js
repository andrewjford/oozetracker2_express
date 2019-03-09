'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _Expense = require('../controllers/Expense');

var _Expense2 = _interopRequireDefault(_Expense);

var _Category = require('../controllers/Category');

var _Category2 = _interopRequireDefault(_Category);

var _Report = require('../controllers/Report');

var _Report2 = _interopRequireDefault(_Report);

var _User = require('../controllers/User');

var _User2 = _interopRequireDefault(_User);

var _authMiddleware = require('../services/authMiddleware');

var _authMiddleware2 = _interopRequireDefault(_authMiddleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/', function (req, res) {
  return res.status(200).send({ 'message': 'YAY!' });
});

router.post('/api/v1/register', _User2.default.create);
router.post('/api/v1/login', _User2.default.login);

router.post('/api/v1/expenses', _authMiddleware2.default.validateToken, _Expense2.default.create);
router.get('/api/v1/expenses', _authMiddleware2.default.validateToken, _Expense2.default.getAll);
router.get('/api/v1/expenses/:id', _authMiddleware2.default.validateToken, _Expense2.default.getOne);
router.put('/api/v1/expenses/:id', _authMiddleware2.default.validateToken, _Expense2.default.update);
router.delete('/api/v1/expenses/:id', _authMiddleware2.default.validateToken, _Expense2.default.delete);

router.get('/api/v1/categories', _authMiddleware2.default.validateToken, _Category2.default.getAll);
router.post('/api/v1/categories', _authMiddleware2.default.validateToken, _Category2.default.create);
router.put('/api/v1/categories/:id', _authMiddleware2.default.validateToken, _Category2.default.update);
router.delete('/api/v1/categories/:id', _authMiddleware2.default.validateToken, _Category2.default.delete);

router.get('/api/v1/reports/recent', _authMiddleware2.default.validateToken, _Expense2.default.getRecentExpenses);
router.post('/api/v1/reports/monthly', _authMiddleware2.default.validateToken, _Report2.default.getMonthly);

exports.default = router;