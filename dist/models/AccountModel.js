"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dbService = _interopRequireDefault(require("../services/dbService"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const AccountModel = {
  async getOne(req) {
    const text = 'SELECT * FROM accounts WHERE id = $1';
    return _dbService.default.query(text, [req.params.id]);
  },

  async getByEmail(email) {
    const queryText = 'SELECT * FROM accounts WHERE email = $1';
    return _dbService.default.query(queryText, [email]);
  },

  async login(req) {
    const {
      rows
    } = await this.getByEmail(req.body.email.toLowerCase());
    const user = rows[0];

    if (!user) {
      return {
        status: "Not Found",
        message: "Account not found for provided email"
      };
    }

    const passwordIsCorrect = _bcryptjs.default.compareSync(req.body.password, user.password);

    if (!passwordIsCorrect) {
      return {
        status: "Unauthorized",
        message: "Password not valid"
      };
    }

    const tokenExpiration = req.header("Client-Type") === "mobile" ? 24 * 60 * 60 * 30 : 24 * 60 * 60;

    const token = _jsonwebtoken.default.sign({
      id: user.id
    }, process.env.SECRET_KEY, {
      expiresIn: tokenExpiration
    });

    return {
      status: "Success",
      user: {
        id: user.id
      },
      token,
      tokenExpiration
    };
  },

  async validateAccount(req) {
    const query = `SELECT v.*, a.*
      FROM verification_tokens v 
      LEFT JOIN accounts a ON v.account_id = a.id
      WHERE v.token = $1`;
    const {
      rows
    } = await _dbService.default.query(query, [req.query.token]);

    if (rows && rows.length > 0) {
      // update account
      // delete verification token
      console.log(rows[0]);
    }
  }

};
var _default = AccountModel;
exports.default = _default;