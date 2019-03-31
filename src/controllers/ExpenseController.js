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
    try {
      const { rows, rowCount } = await ExpenseModel.getAll(req);
      return res.status(200).send({ rows, rowCount });
    } catch(error) {
      return res.status(400).send(error);
    }
  },

  async getOne(req, res) {
    try {
      const { rows } = await ExpenseModel.getOne(req);
      if (!rows[0]) {
        return res.status(404).send({'message': 'expense not found'});
      }
      return res.status(200).send(rows[0]);
    } catch(error) {
      return res.status(400).send(error)
    }
  },

  async update(req, res) {
    const { rows } = await ExpenseModel.getOne(req);
    if (!rows[0]) {
      return res.status(404).send({'message': 'expense not found'});
    }
    const existingRecord = rows[0];

    try {
      const updateResults = await ExpenseModel.update(req, existingRecord);
      return res.status(200).send(updateResults.rows[0]);
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  },

  async delete(req, res) {
    try {
      const { rows } = await ExpenseModel.delete(req);
      if(!rows[0]) {
        return res.status(404).send({'message': 'expense not found'});
      }
      return res.status(204).send({ 'message': 'deleted' });
    } catch(error) {
      return res.status(400).send(error);
    }
  },

  async getRecentExpenses(req, res) {
    try {
      const { rows, rowCount } = await ExpenseModel.getRecentExpenses(req);
      return res.status(200).send({rows, rowCount});
    } catch(error) {
      return res.status(400).send(error);
    }
  },
}

export default ExpenseController;