'use strict';

require('@babel/polyfill');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _Expense = require('./controllers/Expense');

var _Expense2 = _interopRequireDefault(_Expense);

var _Category = require('./controllers/Category');

var _Category2 = _interopRequireDefault(_Category);

var _Report = require('./controllers/Report');

var _Report2 = _interopRequireDefault(_Report);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.use(_express2.default.json());

app.get('/', function (req, res) {
  return res.status(200).send({ 'message': 'YAY! Congratulations! Your first endpoint is working' });
});
app.post('/api/v1/expenses', _Expense2.default.create);
app.get('/api/v1/expenses', _Expense2.default.getAll);
app.get('/api/v1/expenses/:id', _Expense2.default.getOne);
app.put('/api/v1/expenses/:id', _Expense2.default.update);
app.delete('/api/v1/expenses/:id', _Expense2.default.delete);

app.get('/api/v1/categories', _Category2.default.getAll);
app.post('/api/v1/categories', _Category2.default.create);
app.put('/api/v1/categories/:id', _Category2.default.update);
app.delete('/api/v1/categories/:id', _Category2.default.delete);

app.get('/api/v1/reports/recent', _Expense2.default.getRecentExpenses);
app.post('/api/v1/reports/monthly', _Report2.default.getMonthly);

app.listen(process.env.PORT || 3001);
console.log('app running on port ', 3001);