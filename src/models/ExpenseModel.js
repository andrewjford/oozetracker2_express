import moment from 'moment';
import uuidv4 from 'uuid/v4';
import db from '../services/dbService';

const ExpenseModel = {
  async create(req) {
    const text = `WITH inserted AS (INSERT INTO
      expenses(id, amount, created_date, modified_date, date, description, category, account_id)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *)
    SELECT inserted.*, c.name AS name
    FROM inserted
    INNER JOIN categories c ON inserted.category = c.id`;

    const values = [
      uuidv4(),
      req.body.amount,
      moment(new Date()),
      moment(new Date()),
      moment(new Date(req.body.date)),
      req.body.description,
      req.body.category,
      req.accountId,
    ];

    const { rows } = await db.query(text, values);
    return rows;
  },

  getAll(req) {
    const findAllQuery = 'SELECT * FROM categories WHERE account_id = $1';
    return db.query(findAllQuery, [req.accountId]);
  },

  getOne(req) {
    const text = 'SELECT * FROM categories WHERE id = $1 AND account_id = $2';
    return db.query(text, [req.params.id, req.accountId]);
  },

  update(req, existingRecord) {
    const updateOneQuery =`UPDATE categories
      SET name = $1, modified_date = $2
      WHERE id = $3 RETURNING *`;

    const values = [
      req.body.name || existingRecord.name,
      moment(new Date()),
      req.params.id
    ];

    return db.query(updateOneQuery, values);
  },

  delete(req) {
    const deleteQuery = 'DELETE FROM categories WHERE id = $1 AND account_id = $2 RETURNING *';
    return db.query(deleteQuery, [req.params.id, req.accountId]);
  }

}

export default ExpenseModel;