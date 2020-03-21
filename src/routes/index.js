import express from "express";
import ExpenseController from "../controllers/ExpenseController";
import CategoryController from "../controllers/CategoryController";
import Report from "../controllers/Report";
import AccountController from "../controllers/AccountController";
import authMiddleware from "../services/authMiddleware";
import {
  apiRegisterLimiter,
  apiLoginLimiter,
  fiveAttemptsLimiter
} from "../services/rateLimitMiddleware";
import VerificationTokenController from "../controllers/VerificationTokenController";
import requestValidation from "../services/requestValidation";

const router = express.Router();

router.get("/api/v1/ping", apiLoginLimiter, (req, res) => {
  return res.status(200).send({ message: "pong!" });
});

router.post("/api/v1/register", apiRegisterLimiter, AccountController.create);
router.post("/api/v1/login", apiLoginLimiter, AccountController.login);
router.get(
  "/api/v1/verification",
  fiveAttemptsLimiter,
  AccountController.validateAccount
);

router.get(
  "/api/v1/account",
  authMiddleware.validateToken,
  AccountController.getOne
);
router.delete(
  "/api/v1/accounts/:id",
  authMiddleware.validateToken,
  AccountController.delete
);
router.put(
  "/api/v1/accounts/:id",
  authMiddleware.validateToken,
  AccountController.update
);
router.get(
  "/api/v1/registration/email",
  apiRegisterLimiter,
  VerificationTokenController.resendEmailVerification
);

router.post(
  "/api/v1/expenses",
  authMiddleware.validateToken,
  requestValidation.validateCreateExpense,
  ExpenseController.create
);
router.get(
  "/api/v1/expenses",
  authMiddleware.validateToken,
  ExpenseController.getAll
);
router.get(
  "/api/v1/expenses/:id",
  authMiddleware.validateToken,
  ExpenseController.getOne
);
router.put(
  "/api/v1/expenses/:id",
  authMiddleware.validateToken,
  ExpenseController.update
);
router.delete(
  "/api/v1/expenses/:id",
  authMiddleware.validateToken,
  ExpenseController.delete
);

router.get(
  "/api/v1/categories",
  authMiddleware.validateToken,
  CategoryController.getAll
);
router.post(
  "/api/v1/categories",
  authMiddleware.validateToken,
  CategoryController.create
);
router.get(
  "/api/v1/categories/:id",
  authMiddleware.validateToken,
  CategoryController.getOne
);
router.put(
  "/api/v1/categories/:id",
  authMiddleware.validateToken,
  CategoryController.update
);
router.delete(
  "/api/v1/categories/:id",
  authMiddleware.validateToken,
  CategoryController.delete
);

router.get(
  "/api/v1/reports/recent",
  authMiddleware.validateToken,
  ExpenseController.getRecentExpenses
);
router.post(
  "/api/v1/reports/monthly",
  authMiddleware.validateToken,
  Report.getMonthly
);
router.get(
  "/api/v1/reports/expenseSuggestions",
  authMiddleware.validateToken,
  ExpenseController.getExpenseSuggestions
);

export default router;
