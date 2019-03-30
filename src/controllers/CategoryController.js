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
    try {
      const { rows } = await CategoryModel.getOne(req);
      if (!rows[0]) {
        return res.status(404).send({'message': 'category not found'});
      }
      return res.status(200).send(rows[0]);
    } catch(error) {
      return res.status(400).send(error)
    }
  },

  async update(req, res) {
    try {
      const { rows } = await CategoryModel.getOne(req);
      if(!rows[0]) {
        return res.status(404).send({'message': 'category not found'});
      }
      const response = await CategoryModel.update(req, rows[0]);
      return res.status(200).send(response.rows[0]);
    } catch(err) {
      return res.status(400).send(err);
    }
  },

  async delete(req, res) {
    try {
      const { rows } = await CategoryModel.delete(req);
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