import uuidv4 from "uuid/v4";
import moment from "moment";

import ExpenseModel from "../models/ExpenseModel";
import models from "../models/models";

const ExpenseController = {
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
      const recordDate = new Date();
      const splitDate = req.body.date.split("-").map(each => parseInt(each));
      recordDate.setFullYear(splitDate[0]);
      recordDate.setMonth(splitDate[1] - 1);
      recordDate.setDate(splitDate[2]);

      const newExpense = await models.Expense.create({
        id: uuidv4(),
        amount: req.body.amount,
        date: moment(recordDate),
        description: req.body.description,
        category_id: req.body.category,
        account_id: req.accountId
      });

      newExpense.setDataValue('name', category.name);
      return res.status(201).send(newExpense);
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  },

  async getAll(req, res) {
    try {
      const { rows, rowCount } = await ExpenseModel.getAll(req);
      return res.status(200).send({ rows, rowCount });
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  async getOne(req, res) {
    try {
      const expense = await models.Expense.findOne({
        where: {
          id: req.params.id,
          account_id: req.accountId
        },
        include: [{ model: models.Category, attributes: ['name'] }]
      });

      if (!expense) {
        return res.status(404).send({ message: "expense not found" });
      }

      expense.setDataValue('name', expense.category.name);
      return res.status(200).send(expense);
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  async update(req, res) {
    const updateableColumns = {
      amount: req.body.amount,
      date: req.body.date,
      description: req.body.description,
      category_id: req.body.category
    };

    const columnsToUpdate = Object.keys(updateableColumns).reduce(
      (accum, key) => {
        if (updateableColumns[key]) {
          accum[key] = updateableColumns[key];
          return accum;
        }
        return accum;
      },
      {}
    );

    try {
      const [numberOfAffectedRows] = await models.Expense.update(
        columnsToUpdate,
        {
          where: { id: req.params.id }
        }
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
      const { rows } = await ExpenseModel.delete(req);
      if (!rows[0]) {
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
  }
};

export default ExpenseController;
