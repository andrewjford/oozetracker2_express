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
    const text = `INSERT INTO
      expenses(id, amount, created_date, modified_date)
      VALUES($1, $2, $3, $4)
      returning *`;
    const values = [
      uuidv4(),
      req.body.amount,
      moment(new Date()),
      moment(new Date())
    ];

    try {
      const { rows } = await db.query(text, values);
      return res.status(201).send(rows[0]);
    } catch(error) {
      return res.status(400).send(error);
    }
  },
  /**
   * Get All Expense
   * @param {object} req 
   * @param {object} res 
   * @returns {object} expenses array
   */
  async getAll(req, res) {
    const findAllQuery = 'SELECT * FROM expenses';
    try {
      const { rows, rowCount } = await db.query(findAllQuery);
      return res.status(200).send({ rows, rowCount });
    } catch(error) {
      return res.status(400).send(error);
    }
  },
  /**
   * Get A Expense
   * @param {object} req 
   * @param {object} res
   * @returns {object} expense object
   */
  async getOne(req, res) {
    const text = 'SELECT * FROM expenses WHERE id = $1';
    try {
      const { rows } = await db.query(text, [req.params.id]);
      if (!rows[0]) {
        return res.status(404).send({'message': 'expense not found'});
      }
      return res.status(200).send(rows[0]);
    } catch(error) {
      return res.status(400).send(error)
    }
  },
  /**
   * Update A Expense
   * @param {object} req 
   * @param {object} res 
   * @returns {object} updated expense
   */
  async update(req, res) {
    const findOneQuery = 'SELECT * FROM expenses WHERE id=$1';
    const updateOneQuery =`UPDATE expenses
      SET amount=$1,modified_date=$2
      WHERE id=$3 returning *`;
    try {
      const { rows } = await db.query(findOneQuery, [req.params.id]);
      if(!rows[0]) {
        return res.status(404).send({'message': 'expense not found'});
      }
      const values = [
        req.body.amount || rows[0].amount,
        moment(new Date()),
        req.params.id
      ];
      const response = await db.query(updateOneQuery, values);
      return res.status(200).send(response.rows[0]);
    } catch(err) {
      return res.status(400).send(err);
    }
  },
  /**
   * Delete A Expense
   * @param {object} req 
   * @param {object} res 
   * @returns {void} return statuc code 204 
   */
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
  }
}

export default Expense;