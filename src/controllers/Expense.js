import moment from 'moment';
import uuidv4 from 'uuid/v4';
import db from '../db';

const Expense = {
  /**
   * Create A Expense
   * @param {object} req 
   * @param {object} res
   * @returns {object} expense object 
   */
  async create(req, res) {
    const text = `WITH inserted AS (INSERT INTO
        expenses(id, amount, created_date, modified_date, date, description, category)
        VALUES($1, $2, $3, $4, $5, $6, $7)
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
      req.body.category
    ];

    try {
      const { rows } = await db.query(text, values);
      return res.status(201).send(rows[0]);
    } catch(error) {
      console.log(error);
      return res.status(400).send(error);
    }
  },

  async getAll(req, res) {
    const findAllQuery = 'SELECT * FROM expenses';
    try {
      const { rows, rowCount } = await db.query(findAllQuery);
      return res.status(200).send({ rows, rowCount });
    } catch(error) {
      return res.status(400).send(error);
    }
  },

  async getOne(req, res) {
    const text = `SELECT e.*, c.name 
      FROM expenses e 
      LEFT JOIN categories c ON e.category = c.id
      WHERE e.id = $1`;
    try {
      const { rows } = await db.query(text, [req.params.id]);
      if (!rows[0]) {
        return res.status(404).send({'message': 'expense not found'});
      }
      console.log('got 1');
      return res.status(200).send(rows[0]);
    } catch(error) {
      return res.status(400).send(error)
    }
  },

  async update(req, res) {
    const findOneQuery = 'SELECT * FROM expenses WHERE id=$1';
    const updateOneQuery = `WITH updated AS (UPDATE
        expenses SET amount=$1,modified_date=$2, date=$3, description=$4, category=$5
        WHERE id=$6
        RETURNING *)
      SELECT updated.*, c.name
      FROM updated
      INNER JOIN categories c ON updated.category = c.id`;

    try {
      const { rows } = await db.query(findOneQuery, [req.params.id]);
      if(!rows[0]) {
        return res.status(404).send({'message': 'expense not found'});
      }
      const values = [
        req.body.amount || rows[0].amount,
        moment(new Date()),
        moment(new Date(req.body.date)),
        req.body.description,
        req.body.category,
        req.params.id
      ];
      const response = await db.query(updateOneQuery, values);
      return res.status(200).send(response.rows[0]);
    } catch(err) {
      return res.status(400).send(err);
    }
  },

  async delete(req, res) {
    const deleteQuery = 'DELETE FROM expenses WHERE id=$1 returning *';
    try {
      const { rows } = await db.query(deleteQuery, [req.params.id]);
      if(!rows[0]) {
        return res.status(404).send({'message': 'expense not found'});
      }
      return res.status(204).send({ 'message': 'deleted' });
    } catch(error) {
      return res.status(400).send(error);
    }
  },

  async monthlyTotals(req, res) {
    const monthStart = req.body.monthStart || '2019-02-01';
    const monthEnd = req.body.monthEnd || '2019-03-01';
    const findAllQuery = `SELECT c.name, SUM(amount)
      FROM expenses e LEFT JOIN categories c ON e.category = c.id
      WHERE date >= ${monthStart} AND date < ${monthEnd} GROUP BY c.name;`;
    try {
      const { rows, rowCount } = await db.query(findAllQuery);
      return res.status(200).send({ rows, rowCount });
    } catch(error) {
      return res.status(400).send(error);
    }
  },

  async getRecentExpenses(req, res) {
    const getQuery = `
      SELECT e.*, c.name FROM expenses e 
      LEFT JOIN categories c ON e.category = c.id 
      ORDER BY e.date DESC, e.created_date DESC LIMIT 10`;
    try {
      const { rows, rowCount } = await db.query(getQuery);
      return res.status(200).send({ rows, rowCount });
    } catch(error) {
      return res.status(400).send(error);
    }
  },
}

export default Expense;