'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dbService = require('../services/dbService');

var _dbService2 = _interopRequireDefault(_dbService);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var User = {
  create: function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
      var sqlString, values, _ref2, rows, tokenExpiration, token;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(!req.body.name, !req.body.email, !req.body.password)) {
                _context.next = 2;
                break;
              }

              return _context.abrupt('return', res.status(400).send({ message: 'Missing required params' }));

            case 2:
              sqlString = '\n      INSERT INTO\n        accounts(name, email, password)\n      VALUES($1, $2, $3)\n      RETURNING id, name, email';
              values = [req.body.name, req.body.email, _bcryptjs2.default.hashSync(req.body.password, 10)];
              _context.prev = 4;
              _context.next = 7;
              return _dbService2.default.query(sqlString, values);

            case 7:
              _ref2 = _context.sent;
              rows = _ref2.rows;
              tokenExpiration = 24 * 60 * 60;
              token = _jsonwebtoken2.default.sign({ id: rows[0].id }, process.env.SECRET_KEY, { expiresIn: tokenExpiration });
              return _context.abrupt('return', res.status(201).send({
                user: rows[0], token: token, tokenExpiration: tokenExpiration }));

            case 14:
              _context.prev = 14;
              _context.t0 = _context['catch'](4);

              console.log(_context.t0);
              return _context.abrupt('return', res.status(400).send(_context.t0));

            case 18:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[4, 14]]);
    }));

    function create(_x, _x2) {
      return _ref.apply(this, arguments);
    }

    return create;
  }(),
  login: function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
      var sqlString, _ref4, rows, user, passwordIsCorrect, tokenExpiration, token;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              sqlString = 'SELECT id, password \n      FROM accounts \n      WHERE email = $1';
              _context2.prev = 1;
              _context2.next = 4;
              return _dbService2.default.query(sqlString, [req.body.email]);

            case 4:
              _ref4 = _context2.sent;
              rows = _ref4.rows;
              user = rows[0];

              if (user) {
                _context2.next = 9;
                break;
              }

              return _context2.abrupt('return', res.status(404).send({ 'message': 'Account not found for provided email' }));

            case 9:
              passwordIsCorrect = _bcryptjs2.default.compareSync(req.body.password, user.password);

              if (passwordIsCorrect) {
                _context2.next = 12;
                break;
              }

              return _context2.abrupt('return', res.status(401).send('Password not valid!'));

            case 12:
              tokenExpiration = 24 * 60 * 60;
              token = _jsonwebtoken2.default.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: tokenExpiration });
              return _context2.abrupt('return', res.status(201).send({
                user: { id: user.id },
                token: token,
                tokenExpiration: tokenExpiration
              }));

            case 17:
              _context2.prev = 17;
              _context2.t0 = _context2['catch'](1);
              return _context2.abrupt('return', res.status(400).send(_context2.t0));

            case 20:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this, [[1, 17]]);
    }));

    function login(_x3, _x4) {
      return _ref3.apply(this, arguments);
    }

    return login;
  }()
};

exports.default = User;