import moment from 'moment';
import uuidv4 from 'uuid/v4';
import db from '../services/dbService';

const ExpenseModel = {
  async create(req) {
    const text = `WITH inserted AS (INSERT INTO
      expenses(id, amount, date, description, category_id, account_id)
      VALUES($1, $2, $3, $4, $5, $6)
      RETURNING *)
    SELECT inserted.*, c.name AS name
    FROM inserted
    INNER JOIN categories c ON inserted.category_id = c.id`;

    const recordDate = new Date();
    const splitDate = req.body.date.split('-').map(each => parseInt(each));
    recordDate.setFullYear(splitDate[0]);
    recordDate.setMonth(splitDate[1] - 1);
    recordDate.setDate(splitDate[2]);

    const values = [
      uuidv4(),
      req.body.amount,
      moment(recordDate),
      req.body.description,
      req.body.category,
      req.accountId,
    ];

    const { rows } = await db.query(text, values);
    return rows;
  },

  getAll(req) {
    const findAllQuery = 'SELECT * FROM expenses WHERE account_id = $1';
    return db.query(findAllQuery, [req.accountId]);
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
    const deleteQuery = 'DELETE FROM expenses WHERE id = $1 AND account_id = $2 RETURNING *';
    return db.query(deleteQuery, [req.params.id, req.accountId]);
  },

  getRecentExpenses(req) {
    const getQuery = `
      SELECT e.*, c.name FROM expenses e 
      LEFT JOIN categories c ON e.category_id = c.id 
      WHERE e.account_id = $1
      ORDER BY e.date DESC, e.created_at DESC LIMIT 10`;
    return db.query(getQuery, [req.accountId]);
  }
}

export default ExpenseModel;