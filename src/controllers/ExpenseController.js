import ExpenseModel from "../models/ExpenseModel";
import models from "../models/models";
import ExpenseValidator from "../validators/ExpenseValidator";

const ExpenseController = {
  isValidFormat(req, expectedBodyFormat) {
    Object.keys(expectedBodyFormat).forEach(key => {
      return typeof req[key] === expectedBodyFormat[key];
    });
  },

  async create(req, res) {
    const category = await models.Category.findOne({
      where: {
        id: req.body.category,
        account_id: req.accountId
      }
    });
    if (!category) {
      return res.status(400).send("Invalid category");
    }

    try {
      const newExpense = await ExpenseModel.create({
        ...req.body,
        accountId: req.accountId
      });

      return res.status(201).send(newExpense);
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  },

  async getAll(req, res) {
    try {
      const validationErrors = ExpenseValidator.onSearch(req);
      if (validationErrors.length > 0) {
        return res.status(400).send({ message: validationErrors });
      }

      const expenses = await ExpenseModel.getAll({
        ...req.query,
        accountId: req.accountId
      });

      return res.status(200).send({ expenses, rowCount: expenses.length });
    } catch (error) {
      return res.status(400).send({ message: [error.toString()] });
    }
  },

  async getOne(req, res) {
    try {
      const expense = await models.Expense.findOne({
        where: {
          id: req.params.id,
          account_id: req.accountId
        },
        include: [{ model: models.Category, attributes: ["name"] }]
      });

      if (!expense) {
        return res.status(404).send({ message: "expense not found" });
      }

      expense.setDataValue("name", expense.category.name);
      return res.status(200).send(expense);
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  async update(req, res) {
    try {
      const [numberOfAffectedRows] = await ExpenseModel.update(
        {
          ...req.body,
          id: req.params.id
        },
        req.accountId
      );

      if (numberOfAffectedRows === 0) {
        return res.status(404).send({ message: "expense not found" });
      }

      return ExpenseController.getOne(req, res);
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  },

  async delete(req, res) {
    try {
      const destroyedCount = await models.Expense.destroy({
        where: {
          id: req.params.id,
          account_id: req.accountId
        }
      });

      if (destroyedCount === 0) {
        return res.status(404).send({ message: "expense not found" });
      }

      return res.status(204).send({ message: "deleted" });
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  async getRecentExpenses(req, res) {
    try {
      const { rows, rowCount } = await ExpenseModel.getRecentExpenses(req);
      return res.status(200).send({ rows, rowCount });
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  async getExpenseSuggestions(req, res) {
    try {
      const suggestions = await ExpenseModel.getExpenseSuggestions(
        req.accountId
      );
      return res.status(200).send(suggestions);
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  }
};

export default ExpenseController;
