"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _CategoryModel = _interopRequireDefault(require("../models/CategoryModel"));

var _models = _interopRequireDefault(require("../models/models"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CategoryController = {
  async create(req, res) {
    return _models.default.Category.create({
      name: req.body.name,
      account_id: req.accountId
    }).then(result => {
      return res.status(201).send(result);
    }).catch(error => {
      console.log(`error creating category: ${error}`);
      return res.status(500).send({
        message: "Internal Server error."
      });
    });
  },

  async getAll(req, res) {
    try {
      const {
        rows,
        rowCount
      } = await _CategoryModel.default.getAll(req);
      return res.status(200).send({
        rows,
        rowCount
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  async getOne(req, res) {
    try {
      const {
        rows
      } = await _CategoryModel.default.getOne(req);

      if (!rows[0]) {
        return res.status(404).send({
          'message': 'category not found'
        });
      }

      return res.status(200).send(rows[0]);
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  async update(req, res) {
    try {
      const {
        rows
      } = await _CategoryModel.default.getOne(req);

      if (!rows[0]) {
        return res.status(404).send({
          'message': 'category not found'
        });
      }

      const response = await _CategoryModel.default.update(req, rows[0]);
      return res.status(200).send(response.rows[0]);
    } catch (err) {
      return res.status(400).send(err);
    }
  },

  async delete(req, res) {
    try {
      const {
        rows
      } = await _CategoryModel.default.delete(req);

      if (!rows[0]) {
        return res.status(404).send({
          'message': 'category not found'
        });
      }

      return res.status(204).send({
        'message': 'deleted'
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  }

};
var _default = CategoryController;
exports.default = _default;