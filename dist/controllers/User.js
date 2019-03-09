'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _db = require('../db');

var _db2 = _interopRequireDefault(_db);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var User = {
  createUser: function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
      var sqlString, values, _ref2, rows;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              sqlString = '\n      INSERT INTO\n        users(name, email, password)\n      VALUES($1, $2, $3)\n      RETURNING *';
              values = [req.body.username, req.body.email, _bcryptjs2.default.hashSync(req.body.password)];
              _context.prev = 2;
              _context.next = 5;
              return _db2.default.query(sqlString, values);

            case 5:
              _ref2 = _context.sent;
              rows = _ref2.rows;
              return _context.abrupt('return', res.status(201).send(rows[0]));

            case 10:
              _context.prev = 10;
              _context.t0 = _context['catch'](2);

              console.log(_context.t0);
              return _context.abrupt('return', res.status(400).send(_context.t0));

            case 14:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[2, 10]]);
    }));

    function createUser(_x, _x2) {
      return _ref.apply(this, arguments);
    }

    return createUser;
  }()
};

exports.default = User;