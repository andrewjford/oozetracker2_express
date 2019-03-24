import moment from 'moment';
import uuid from 'uuid';

class Expense {
  constructor() {
    this.expenses = [];
  }

  create(data) {
    const newExpense = {
      id: uuid.v4(),
      amount: data.amount || '',
      createdDate: moment.now(),
      modifiedDate: moment.now()
    };
    this.expenses.push(newExpense);
    return newExpense;
  }

  findOne(id) {
    return this.expenses.find(expense => expense.id === id);
  }

  findAll() {
    return this.expenses;
  }

  update(id, data) {
    const expense = this.findOne(id);
    const index = this.expenses.indexOf(expense);
    this.expenses[index].amount = data['amount'] || expense.amount;
    this.expenses[index].modifiedDate = moment.now()
    return this.expenses[index];
  }

  delete(id) {
    const expense = this.findOne(id);
    const index = this.expenses.indexOf(expense);
    this.expenses.splice(index, 1);
    return {};
  }
}
export default new Expense();