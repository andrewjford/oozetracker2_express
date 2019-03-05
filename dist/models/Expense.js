'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Expense = function () {
  function Expense() {
    _classCallCheck(this, Expense);

    this.expenses = [];
  }

  _createClass(Expense, [{
    key: 'create',
    value: function create(data) {
      var newExpense = {
        id: _uuid2.default.v4(),
        amount: data.amount || '',
        createdDate: _moment2.default.now(),
        modifiedDate: _moment2.default.now()
      };
      this.expenses.push(newExpense);
      return newExpense;
    }
  }, {
    key: 'findOne',
    value: function findOne(id) {
      return this.expenses.find(function (expense) {
        return expense.id === id;
      });
    }
  }, {
    key: 'findAll',
    value: function findAll() {
      return this.expenses;
    }
  }, {
    key: 'update',
    value: function update(id, data) {
      var expense = this.findOne(id);
      var index = this.expenses.indexOf(expense);
      this.expenses[index].amount = data['amount'] || expense.amount;
      this.expenses[index].modifiedDate = _moment2.default.now();
      return this.expenses[index];
    }
  }, {
    key: 'delete',
    value: function _delete(id) {
      var expense = this.findOne(id);
      var index = this.expenses.indexOf(expense);
      this.expenses.splice(index, 1);
      return {};
    }
  }]);

  return Expense;
}();

exports.default = new Expense();