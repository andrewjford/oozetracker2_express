"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _v = _interopRequireDefault(require("uuid/v4"));

var _moment = _interopRequireDefault(require("moment"));

var _ExpenseModel = _interopRequireDefault(require("../models/ExpenseModel"));

var _models = _interopRequireDefault(require("../models/models"));

var _ExpenseValidator = _interopRequireDefault(require("../validators/ExpenseValidator"));

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ExpenseController = {
  async create(req, res) {
    const category = await _models.default.Category.findOne({
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
      const newExpense = await _models.default.Expense.create({
        id: (0, _v.default)(),
        amount: req.body.amount,
        date: (0, _moment.default)(recordDate),
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
      const validationErrors = _ExpenseValidator.default.onSearch(req);

      if (validationErrors.length > 0) {
        return res.status(400).send({
          message: validationErrors
        });
      }

      const whereObject = {
        account_id: req.accountId
      };

      if (req.query.categoryId) {
        whereObject.category_id = req.query.categoryId;
      }

      if (req.query.startDate) {
        whereObject.date = {
          [_sequelize.default.Op.between]: [req.query.startDate, req.query.endDate]
        };
      }

      let limit;

      if (req.query.pageSize === "ALL") {
        limit = null;
      } else if (req.query.pageSize) {
        limit = req.query.pageSize;
      } else {
        limit = 20;
      }

      const columns = ["amount", "description", "date", "id", "account_id", "category_id"];
      const expenses = await _models.default.Expense.findAll({
        attributes: columns,
        include: [{
          model: _models.default.Category,
          attributes: ['name']
        }],
        where: whereObject,
        order: [["date", "DESC"]],
        limit,
        ...(req.query.offset ? {
          offset: req.query.offset
        } : {})
      });
      return res.status(200).send({
        expenses,
        rowCount: expenses.length
      });
    } catch (error) {
      return res.status(400).send({
        message: [error.toString()]
      });
    }
  },

  async getOne(req, res) {
    try {
      const expense = await _models.default.Expense.findOne({
        where: {
          id: req.params.id,
          account_id: req.accountId
        },
        include: [{
          model: _models.default.Category,
          attributes: ['name']
        }]
      });

      if (!expense) {
        return res.status(404).send({
          message: "expense not found"
        });
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
    const columnsToUpdate = Object.keys(updateableColumns).reduce((accum, key) => {
      if (updateableColumns[key]) {
        accum[key] = updateableColumns[key];
        return accum;
      }

      return accum;
    }, {});

    try {
      const [numberOfAffectedRows] = await _models.default.Expense.update(columnsToUpdate, {
        where: {
          id: req.params.id
        }
      });

      if (numberOfAffectedRows === 0) {
        return res.status(404).send({
          message: "expense not found"
        });
      }

      return ExpenseController.getOne(req, res);
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  },

  async delete(req, res) {
    try {
      const {
        rows
      } = await _ExpenseModel.default.delete(req);

      if (!rows[0]) {
        return res.status(404).send({
          message: "expense not found"
        });
      }

      return res.status(204).send({
        message: "deleted"
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  async getRecentExpenses(req, res) {
    try {
      const {
        rows,
        rowCount
      } = await _ExpenseModel.default.getRecentExpenses(req);
      return res.status(200).send({
        rows,
        rowCount
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  }

};
var _default = ExpenseController;
exports.default = _default;