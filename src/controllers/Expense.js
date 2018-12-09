import ExpenseModel from '../models/Expense';

const Expense = {

  create(req, res) {
    console.log(req.body);
    if (!req.body.amount) {
      return res.status(400).send({'message': 'All fields are required'})
    }
    const expense = ExpenseModel.create(req.body);
    return res.status(201).send(expense);
  },

  getAll(req, res) {
    const expenses = ExpenseModel.findAll();
    return res.status(200).send(expenses);
  },

  getOne(req, res) {
    const expense = ExpenseModel.findOne(req.params.id);
    if (!expense) {
      return res.status(404).send({'message': 'expense not found'});
    }
    return res.status(200).send(expense);
  },

  update(req, res) {
    const expense = ExpenseModel.findOne(req.params.id);
    if (!expense) {
      return res.status(404).send({'message': 'expense not found'});
    }
    const updatedExpense = ExpenseModel.update(req.params.id, req.body)
    return res.status(200).send(updatedExpense);
  },

  delete(req, res) {
    const expense = ExpenseModel.findOne(req.params.id);
    if (!expense) {
      return res.status(404).send({'message': 'expense not found'});
    }
    const ref = ExpenseModel.delete(req.params.id);
    return res.status(204).send(ref);
  }
}

export default Expense;