import moment from 'moment';
import db from '../services/dbService';
import CategoryModel from '../models/CategoryModel';

const CategoryController = {

  async create(req, res) {
    try {
      const { rows } = await CategoryModel.create(req);
      return res.status(201).send(rows[0]);
    } catch(error) {
      return res.status(400).send(error);
    }
  },

  async getAll(req, res) {
    try {
      const { rows, rowCount } = await CategoryModel.getAll(req);
      return res.status(200).send({ rows, rowCount });
    } catch(error) {
      return res.status(400).send(error);
    }
  },

  async getOne(req, res) {
    const text = 'SELECT * FROM categories WHERE id = $1 AND account_id = $2';
    try {
      const { rows } = await db.query(text, [req.params.id, req.accountId]);
      if (!rows[0]) {
        return res.status(404).send({'message': 'category not found'});
      }
      return res.status(200).send(rows[0]);
    } catch(error) {
      return res.status(400).send(error)
    }
  },

  async update(req, res) {
    const findOneQuery = 'SELECT * FROM categories WHERE id = $1 AND account_id = $2';
    const updateOneQuery =`UPDATE categories
      SET name = $1, modified_date = $2
      WHERE id = $3 RETURNING *`;
    try {
      const { rows } = await db.query(findOneQuery, [req.params.id, req.accountId]);
      if(!rows[0]) {
        return res.status(404).send({'message': 'category not found'});
      }
      const values = [
        req.body.name || rows[0].name,
        moment(new Date()),
        req.params.id
      ];
      const response = await db.query(updateOneQuery, values);
      return res.status(200).send(response.rows[0]);
    } catch(err) {
      return res.status(400).send(err);
    }
  },

  async delete(req, res) {
    const deleteQuery = 'DELETE FROM categories WHERE id = $1 AND account_id = $2 RETURNING *';
    try {
      const { rows } = await db.query(deleteQuery, [req.params.id, req.accountId]);
      if(!rows[0]) {
        return res.status(404).send({'message': 'category not found'});
      }
      return res.status(204).send({ 'message': 'deleted' });
    } catch(error) {
      return res.status(400).send(error);
    }
  }
}

export default CategoryController;