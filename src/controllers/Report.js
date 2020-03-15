import db from "../services/dbService";
import models from "../models/models";
import expense from "../models/Expense";

const Report = {
  async getMonthly(req, res) {
    const requestedMonth = new Date(req.body.year, req.body.month);
    const nextMonth = new Date(req.body.year, req.body.month);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const queryString = `
      SELECT SUM(e.amount), c.id, c.name
      FROM expenses e 
      LEFT JOIN categories c ON e.category_id = c.id
      WHERE e.date >= $1 AND
        e.date < $2 AND
        e.account_id = $3
      GROUP BY c.id
      ORDER BY c.name`;

    const values = [
      `${requestedMonth.getFullYear()}-${requestedMonth.getMonth() + 1}-01`,
      `${nextMonth.getFullYear()}-${nextMonth.getMonth() + 1}-01`,
      req.accountId
    ];

    try {
      const { rows, rowCount } = await db.query(queryString, values);
      return res.status(200).send({
        rows,
        rowCount,
        month: req.body.month,
        year: req.body.year
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  },

  async getExpenseSuggestions(req, res) {
    const whereObject = {
      account_id: req.accountId
    };

    const columns = ["description", "category_id"];

    const expenses = await models.Expense.findAll({
      attributes: columns,
      include: [{ model: models.Category, attributes: ["name"] }],
      where: whereObject,
      order: [["date", "DESC"]],
      limit: 100
    });

    const descriptionToExpense = groupBy(expenses, "description");
    const topDescriptionsWithTopCategory = Object.values(
      descriptionToExpense
    ).reduce((accum, expenses) => {
      const categoryIdToExpenses = groupBy(expenses, "category_id");

      accum.push(categoryIdToExpenses[mostCommonKey(categoryIdToExpenses)][0]);
      return accum;
    }, []);

    // const descriptionToExpense = expenses.reduce((accum, expense) => {
    //   const existingExpense = accum[expense.description];

    //   if (!existingExpense) {
    //     accum[expense.description] = {
    //       ...expense,
    //       descriptionCount: 1,
    //       categories: {
    //         [expense.category_id]: 1
    //       }
    //     };
    //   } else if (
    //     existingExpense.category_id !== expense.category_id
    //   ) {
    //     existingExpense.descriptionCount += 1;

    //     if (existingExpense.categories[expense.category_id]) {
    //       existingExpense.categories[expense.category_id] += 1;
    //     } else {
    //       existingExpense.categories[expense.category_id] = 1;
    //     }
    //   } else {
    //     existingExpense.descriptionCount += 1;
    //     existingExpense.categories[expense.category_id] += 1;
    //   }

    //   return accum;
    // }, {});

    // const topDescriptionsWithTopCategory = Object.values(descriptionToExpense).sort((a,b) => {
    //   b.descriptionCount - a.descriptionCount;
    // }).map(expense => {
    //   let topCategoryId;

    //   Object.keys(expense.categories).forEach(key => {
    //     if (topCategoryId === undefined) {
    //       topCategoryId = key;
    //     } else if (expense.categories[key] > expense.categories[topCategoryId]) {
    //       topCategoryId = key;
    //     }
    //   });

    //   expense.topCategory = topCategoryId;
    //   return expense;
    // })

    const topExpenseDescriptionsByCategory = groupBy(expenses, "category_id");

    Object.keys(topExpenseDescriptionsByCategory).forEach(categoryId => {
      topExpenseDescriptionsByCategory[categoryId] = dedupeArrayOfObjects(
        topExpenseDescriptionsByCategory[categoryId],
        "description"
      );
    });

    return res.status(200).send({
      topDescriptionsWithTopCategory,
      topExpenseDescriptionsByCategory
    });
  }
};

export default Report;

function dedupeArrayOfObjects(array, field) {
  return array.filter((expense, index, self) => {
    const firstIndex = self.findIndex(
      element => expense[field] === element[field]
    );
    return index === firstIndex;
  });
}

function groupBy(array, field) {
  return array.reduce((accum, each) => {
    if (!accum[each[field]]) {
      accum[each[field]] = [];
    }

    accum[each[field]].push(each);

    return accum;
  }, {});
}

function mostCommonKey(keyToCount) {
  let topKey;

  Object.keys(keyToCount).forEach(key => {
    if (topKey === undefined) {
      topKey = key;
    } else if (keyToCount[key].length > keyToCount[topKey].length) {
      topKey = key;
    }
  });

  return topKey;
}
