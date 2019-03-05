'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _db = require('../db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var Report = {
  getMonthly: function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
      var requestedMonth, nextMonth, queryString, values, _ref2, rows, rowCount;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              requestedMonth = new Date(req.body.year, req.body.month);
              nextMonth = new Date(req.body.year, req.body.month);

              nextMonth.setMonth(nextMonth.getMonth() + 1);

              queryString = '\n      SELECT SUM(e.amount), c.id, c.name\n      FROM expenses e \n      LEFT JOIN categories c ON e.category = c.id\n      WHERE e.date >= $1 AND\n        e.date < $2\n      GROUP BY c.id';
              values = [requestedMonth.getFullYear() + '-' + (requestedMonth.getMonth() + 1) + '-01', nextMonth.getFullYear() + '-' + (nextMonth.getMonth() + 1) + '-01'];
              _context.prev = 5;
              _context.next = 8;
              return _db2.default.query(queryString, values);

            case 8:
              _ref2 = _context.sent;
              rows = _ref2.rows;
              rowCount = _ref2.rowCount;
              return _context.abrupt('return', res.status(200).send({
                rows: rows,
                rowCount: rowCount,
                month: req.body.month,
                year: req.body.year
              }));

            case 14:
              _context.prev = 14;
              _context.t0 = _context['catch'](5);

              console.log(_context.t0);
              return _context.abrupt('return', res.status(400).send(_context.t0));

            case 18:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[5, 14]]);
    }));

    function getMonthly(_x, _x2) {
      return _ref.apply(this, arguments);
    }

    return getMonthly;
  }()
};

exports.default = Report;