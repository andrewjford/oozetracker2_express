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

  update(expense, accountId) {
    const updateableColumns = {
      amount: expense.amount,
      date: expense.date,
      description: expense.description,
      category_id: expense.category
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

    return models.Expense.update(columnsToUpdate, {
      where: {
        id: expense.id,
        account_id: accountId
      }
    });
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
