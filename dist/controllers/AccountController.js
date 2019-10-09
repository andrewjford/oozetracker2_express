"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _AccountModel = _interopRequireDefault(require("../models/AccountModel"));

var _AccountValidator = _interopRequireDefault(require("../validators/AccountValidator"));

var _VerificationTokenController = _interopRequireDefault(require("./VerificationTokenController"));

var _dbService = _interopRequireDefault(require("../services/dbService"));

var _models = _interopRequireDefault(require("../models/models"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _mailer = _interopRequireDefault(require("../services/mailer"));

var _CategoryModel = _interopRequireDefault(require("../models/CategoryModel"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const AccountController = {
  async validateAccount(req, res) {
    const query = `SELECT v.*, a.*
      FROM verification_tokens v 
      LEFT JOIN accounts a ON v.account_id = a.id
      WHERE v.token = $1`;
    const {
      rows
    } = await _dbService.default.query(query, [req.query.token]);

    if (rows && rows.length > 0) {
      try {
        const updatedAccount = await _models.default.Account.update({
          isVerified: true
        }, {
          where: {
            id: rows[0].id
          }
        });

        _models.default.VerificationToken.destroy({
          where: {
            account_id: rows[0].id
          }
        });

        return res.status(200).send({
          message: "email successfully verified"
        });
      } catch (error) {
        console.log("error updating account... " + error);
        return res.status(500).send({
          message: "internal server error"
        });
      }
    } else {
      return res.status(400).send({
        message: "Unable to resolve email verification."
      });
    }
  },

  async getOne(req, res) {
    const user = await _models.default.Account.findOne({
      where: {
        id: req.accountId
      }
    });
    return res.status(200).send({
      name: user.name,
      email: user.email,
      id: user.id
    });
  },

  async create(req, res) {
    const errors = _AccountValidator.default.onCreate(req);

    if (errors.length > 0) {
      return res.status(422).send({
        message: errors
      });
    }

    try {
      const password = await _bcryptjs.default.hash(req.body.password, 10);
      const account = await _models.default.Account.create({
        name: req.body.name,
        email: req.body.email.toLowerCase(),
        password
      }).catch(error => {
        if (error.parent.code === "23505") {
          return res.status(422).send({
            message: ["A user already exists for this email."]
          });
        } else {
          throw Error(error);
        }
      });
      const verificationTokenModel = await _VerificationTokenController.default.create(req, res, account);

      _mailer.default.sendVerificationMessage(account.email, verificationTokenModel.token).catch(error => {
        console.log(`error sending email: ${error}`);
        return res.status(500).send({
          message: "Error sending email."
        });
      });

      _CategoryModel.default.create({
        body: {
          name: "Groceries"
        },
        accountId: account.id
      });

      const tokenExpiration = 24 * 60 * 60;

      const token = _jsonwebtoken.default.sign({
        id: account.id
      }, process.env.SECRET_KEY, {
        expiresIn: tokenExpiration
      });

      return res.status(201).send({
        user: account,
        // prob need to strip this down
        token,
        tokenExpiration
      });
    } catch (error) {
      return res.status(400).send({
        message: ["error creating user"]
      });
    }
  },

  async update(req, res) {
    const errors = _AccountValidator.default.onUpdate(req);

    if (errors.length > 0) {
      console.log(errors);
      return res.status(422).send({
        message: errors
      });
    }

    const user = await _models.default.Account.findOne({
      where: {
        id: req.accountId
      }
    });

    if (!user) {
      return {
        status: "Not Found",
        message: "Account not found for provided email"
      };
    }

    const passwordIsCorrect = _bcryptjs.default.compareSync(req.body.oldPassword, user.password);

    if (!passwordIsCorrect) {
      return res.status(400).send({
        status: "Unauthorized",
        message: "Old password not valid"
      });
    }

    try {
      const password = await _bcryptjs.default.hash(req.body.newPassword, 10);
      await _models.default.Account.update({
        name: req.body.name,
        password
      }, {
        where: {
          id: req.accountId
        }
      });
      return res.status(200).send({
        message: "successful update"
      });
    } catch (error) {
      throw Error(error);
    }
  },

  async login(req, res) {
    try {
      const result = await _AccountModel.default.login(req);

      switch (result.status) {
        case "Success":
          return res.status(200).send(result);

        case "Not Found":
          return res.status(404).send(result);

        case "Unauthorized":
          return res.status(401).send(result);

        default:
          return res.status(400).send("unable to login");
      }
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  async delete(req, res) {
    try {
      const result = _models.default.Account.destroy({
        where: {
          id: req.accountId
        }
      });

      if (result.rowCount === 0) {
        return res.status(404).send({
          message: "account not found"
        });
      }

      return res.status(204).send({
        message: "deleted"
      });
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  }

};
var _default = AccountController;
exports.default = _default;