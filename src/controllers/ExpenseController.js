import moment from 'moment';
import db from '../services/dbService';
import ExpenseModel from '../models/ExpenseModel';
import CategoryModel from '../models/CategoryModel';

const ExpenseController = {
  async create(req, res) {
    const category = await CategoryModel.getOne({
      params:{id: req.body.category},
      accountId: req.accountId
    });
    if (category.rows.length === 0) {
      return res.status(400).send('Invalid category');
    }
    
    try {
      const rows = await ExpenseModel.create(req);
      return res.status(201).send(rows[0]);
    } catch(error) {
      console.log(error);
      return res.status(400).send(error);
    }
  },

  async getAll(req, res) {
    const findAllQuery = 'SELECT * FROM expenses WHERE account_id = $1';
    try {
      const { rows, rowCount } = await db.query(findAllQuery, [req.accountId]);
      return res.status(200).send({ rows, rowCount });
    } catch(error) {
      return res.status(400).send(error);
    }
  },

  async getOne(req, res) {
    const text = `SELECT e.*, c.name 
      FROM expenses e 
      LEFT JOIN categories c ON e.category = c.id
      WHERE e.id = $1 AND e.account_id = $2`;
    try {
      const { rows } = await db.query(text, [req.params.id, req.accountId]);
      if (!rows[0]) {
        return res.status(404).send({'message': 'expense not found'});
      }
      return res.status(200).send(rows[0]);
    } catch(error) {
      return res.status(400).send(error)
    }
  },

  async update(req, res) {
    const findOneQuery = 'SELECT * FROM expenses WHERE id = $1 AND account_id = $2';
    const updateOneQuery = `WITH updated AS (UPDATE
        expenses SET amount=$1,modified_date=$2, date=$3, description=$4, category=$5
        WHERE id=$6
        RETURNING *)
      SELECT updated.*, c.name
      FROM updated
      INNER JOIN categories c ON updated.category = c.id`;

    try {
      const { rows } = await db.query(findOneQuery, [req.params.id, req.accountId]);
      if(!rows[0]) {
        return res.status(404).send({'message': 'expense not found'});
      }
      const values = [
        req.body.amount || rows[0].amount,
        moment(new Date()),
        req.body.date ? moment(new Date(req.body.date)) : rows[0].date,
        req.body.description ? req.body.description : rows[0].description,
        req.body.category ? req.body.category : rows[0].category,
        req.params.id
      ];
      const response = await db.query(updateOneQuery, values);
      return res.status(200).send(response.rows[0]);
    } catch(err) {
      return res.status(400).send(err);
    }
  },

  async delete(req, res) {
    const deleteQuery = 'DELETE FROM expenses WHERE id = $1 AND account_id = $2 RETURNING *';
    try {
      const { rows } = await db.query(deleteQuery, [req.params.id, req.accountId]);
      if(!rows[0]) {
        return res.status(404).send({'message': 'expense not found'});
      }
      return res.status(204).send({ 'message': 'deleted' });
    } catch(error) {
      return res.status(400).send(error);
    }
  },

  async getRecentExpenses(req, res) {
    const getQuery = `
      SELECT e.*, c.name FROM expenses e 
      LEFT JOIN categories c ON e.category = c.id 
      WHERE e.account_id = $1
      ORDER BY e.date DESC, e.created_date DESC LIMIT 10`;
    try {
      const { rows, rowCount } = await db.query(getQuery, [req.accountId]);
      return res.status(200).send({ rows, rowCount });
    } catch(error) {
      return res.status(400).send(error);
    }
  },
}

export default ExpenseController;