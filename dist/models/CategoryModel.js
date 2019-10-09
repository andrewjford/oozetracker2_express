"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dbService = _interopRequireDefault(require("../services/dbService"));

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CategoryModel = {
  create(req) {
    const text = `INSERT INTO
      categories(name, account_id)
      VALUES($1, $2)
      RETURNING *`;
    const values = [req.body.name, req.accountId];
    return _dbService.default.query(text, values);
  },

  getAll(req) {
    const findAllQuery = 'SELECT * FROM categories WHERE account_id = $1';
    return _dbService.default.query(findAllQuery, [req.accountId]);
  },

  getOne(req) {
    const text = 'SELECT * FROM categories WHERE id = $1 AND account_id = $2';
    return _dbService.default.query(text, [req.params.id, req.accountId]);
  },

  update(req, existingRecord) {
    const updateOneQuery = `UPDATE categories
      SET name = $1, updated_at = $2
      WHERE id = $3 RETURNING *`;
    const values = [req.body.name || existingRecord.name, (0, _moment.default)(new Date()), req.params.id];
    return _dbService.default.query(updateOneQuery, values);
  },

  delete(req) {
    const deleteQuery = 'DELETE FROM categories WHERE id = $1 AND account_id = $2 RETURNING *';
    return _dbService.default.query(deleteQuery, [req.params.id, req.accountId]);
  }

};
var _default = CategoryModel;
exports.default = _default;