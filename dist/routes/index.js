"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _ExpenseController = _interopRequireDefault(require("../controllers/ExpenseController"));

var _CategoryController = _interopRequireDefault(require("../controllers/CategoryController"));

var _Report = _interopRequireDefault(require("../controllers/Report"));

var _AccountController = _interopRequireDefault(require("../controllers/AccountController"));

var _authMiddleware = _interopRequireDefault(require("../services/authMiddleware"));

var _rateLimitMiddleware = require("../services/rateLimitMiddleware");

var _VerificationTokenController = _interopRequireDefault(require("../controllers/VerificationTokenController"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router();

router.get('/api/v1/ping', _rateLimitMiddleware.apiLoginLimiter, (req, res) => {
  return res.status(200).send({
    'message': 'pong!'
  });
});
router.post('/api/v1/register', _rateLimitMiddleware.apiRegisterLimiter, _AccountController.default.create);
router.post('/api/v1/login', _rateLimitMiddleware.apiLoginLimiter, _AccountController.default.login);
router.get('/api/v1/verification', _AccountController.default.validateAccount);
router.get('/api/v1/account', _authMiddleware.default.validateToken, _AccountController.default.getOne);
router.delete('/api/v1/accounts/:id', _authMiddleware.default.validateToken, _AccountController.default.delete);
router.put('/api/v1/accounts/:id', _authMiddleware.default.validateToken, _AccountController.default.update);
router.get('/api/v1/registration/email', _rateLimitMiddleware.apiRegisterLimiter, _VerificationTokenController.default.resendEmailVerification);
router.post('/api/v1/expenses', _authMiddleware.default.validateToken, _ExpenseController.default.create);
router.get('/api/v1/expenses', _authMiddleware.default.validateToken, _ExpenseController.default.getAll);
router.get('/api/v1/expenses/:id', _authMiddleware.default.validateToken, _ExpenseController.default.getOne);
router.put('/api/v1/expenses/:id', _authMiddleware.default.validateToken, _ExpenseController.default.update);
router.delete('/api/v1/expenses/:id', _authMiddleware.default.validateToken, _ExpenseController.default.delete);
router.get('/api/v1/categories', _authMiddleware.default.validateToken, _CategoryController.default.getAll);
router.post('/api/v1/categories', _authMiddleware.default.validateToken, _CategoryController.default.create);
router.get('/api/v1/categories/:id', _authMiddleware.default.validateToken, _CategoryController.default.getOne);
router.put('/api/v1/categories/:id', _authMiddleware.default.validateToken, _CategoryController.default.update);
router.delete('/api/v1/categories/:id', _authMiddleware.default.validateToken, _CategoryController.default.delete);
router.get('/api/v1/reports/recent', _authMiddleware.default.validateToken, _ExpenseController.default.getRecentExpenses);
router.post('/api/v1/reports/monthly', _authMiddleware.default.validateToken, _Report.default.getMonthly);
var _default = router;
exports.default = _default;