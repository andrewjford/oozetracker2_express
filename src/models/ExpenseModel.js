import moment from "moment";
import uuidv4 from "uuid/v4";
import db from "../services/dbService";
import models from "../models/models";
import { groupBy, mostCommonKey } from "../services/helperMethods";
import Sequelize from "sequelize";

const ExpenseModel = {
  async create(requestBody) {
    const recordDate = new Date();
    const splitDate = requestBody.date.split("-").map(each => parseInt(each));
    recordDate.setFullYear(splitDate[0]);
    recordDate.setMonth(splitDate[1] - 1);
    recordDate.setDate(splitDate[2]);

    const newExpense = await models.Expense.create({
      id: uuidv4(),
      amount: requestBody.amount,
      date: moment(recordDate),
      description: requestBody.description,
      category_id: requestBody.category,
      account_id: requestBody.accountId
    });

    return newExpense;
  },

  getAll(query) {
    const whereObject = {
      account_id: query.accountId
    };

    if (query.categoryId) {
      whereObject.category_id = query.categoryId;
    }

    if (query.startDate) {
      whereObject.date = {
        [Sequelize.Op.between]: [query.startDate, query.endDate]
      };
    }

    let limit;
    if (query.pageSize === "ALL") {
      limit = null;
    } else if (query.pageSize) {
      limit = query.pageSize;
    } else {
      limit = 20;
    }

    const columns = [
      "amount",
      "description",
      "date",
      "id",
      "account_id",
      "category_id"
    ];

    return models.Expense.findAll({
      attributes: columns,
      include: [{ model: models.Category, attributes: ["name"] }],
      where: whereObject,
      order: [["date", "DESC"]],
      limit,
      ...(query.offset ? { offset: query.offset } : {})
    });
  },

  getOne(req) {
    const query = `SELECT e.*, c.name 
      FROM expenses e 
      LEFT JOIN categories c ON e.category_id = c.id
      WHERE e.id = $1 AND e.account_id = $2`;
    return db.query(query, [req.params.id, req.accountId]);
  },

  update(req, existingRecord) {
    const updateOneQuery = `
      WITH updated AS (UPDATE
        expenses SET amount=$1, date=$2, description=$3, category_id=$4
        WHERE id=$5
        RETURNING *)
      SELECT updated.*, c.name
      FROM updated
      INNER JOIN categories c ON updated.category_id = c.id`;

    const values = [
      req.body.amount || existingRecord.amount,
      req.body.date ? moment(new Date(req.body.date)) : existingRecord.date,
      req.body.description ? req.body.description : existingRecord.description,
      req.body.category ? req.body.category : existingRecord.category,
      req.params.id
    ];

    return db.query(updateOneQuery, values);
  },

  delete(req) {
    const deleteQuery =
      "DELETE FROM expenses WHERE id = $1 AND account_id = $2 RETURNING *";
    return db.query(deleteQuery, [req.params.id, req.accountId]);
  },

  getRecentExpenses(req) {
    const getQuery = `
      SELECT e.*, c.name FROM expenses e 
      LEFT JOIN categories c ON e.category_id = c.id 
      WHERE e.account_id = $1
      ORDER BY e.date DESC, e.created_at DESC LIMIT 10`;
    return db.query(getQuery, [req.accountId]);
  },

  async getExpenseSuggestions(accountId) {
    const whereObject = {
      account_id: accountId
    };

    const columns = ["description", "category_id"];

    try {
      const expenses = await models.Expense.findAll({
        attributes: columns,
        include: [{ model: models.Category, attributes: ["name"] }],
        where: whereObject,
        order: [["date", "DESC"]],
        limit: 100
      });

      const topDescriptions = mapDescriptionsToTopCategory(expenses);

      const categoryToDescription = mapCategoryIdToDescriptions(expenses);

      return {
        topDescriptions,
        categoryToDescription
      };
    } catch (err) {
      throw err;
    }
  }
};

function mapDescriptionsToTopCategory(expenses) {
  const descriptionToExpenses = groupBy(expenses, "description");

  return Object.values(descriptionToExpenses).reduce((accum, expenses) => {
    const categoryIdToExpenses = groupBy(expenses, "category_id");

    const expensesOfTopCategory =
      categoryIdToExpenses[mostCommonKey(categoryIdToExpenses)];

    const expense = {
      description: expensesOfTopCategory[0].description,
      category_id: expensesOfTopCategory[0].category_id,
      category: expensesOfTopCategory[0].category,
      recurrence: expenses.length
    };

    return {
      ...accum,
      [expense.description]: expense
    };
  }, {});
}

function mapCategoryIdToDescriptions(expenses) {
  const categoryToDescriptions = groupBy(expenses, "category_id");

  Object.keys(categoryToDescriptions).forEach(categoryId => {
    categoryToDescriptions[categoryId] = Array.from(
      new Set(
        categoryToDescriptions[categoryId].map(expenseObject => {
          return expenseObject.description;
        })
      )
    );
  });

  return categoryToDescriptions;
}

export default ExpenseModel;
