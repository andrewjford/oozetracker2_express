"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _models = _interopRequireDefault(require("../models/models"));

var _mailer = _interopRequireDefault(require("../services/mailer"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const VerificationTokenController = {
  async resendEmailVerification(req, res) {
    const account = await _models.default.Account.findOne({
      where: {
        email: req.query.email
      },
      include: [{
        model: _models.default.VerificationToken,
        as: "VerificationToken"
      }]
    });

    if (account && account.VerificationToken) {
      _mailer.default.sendVerificationMessage(account.email, account.VerificationToken.token).then(() => {
        return res.status(200).send({
          message: "Verification email sent."
        });
      });
    } else if (account) {
      const newVerificationToken = await this.create(req, res, account);

      _mailer.default.sendVerificationMessage(account.email, newVerificationToken.token).then(() => {
        return res.status(200).send({
          message: "Verification email sent."
        });
      });
    } else {
      return res.status(404).send({
        message: "Account not found for given email."
      });
    }
  },

  async create(req, res, account) {
    const newToken = await _bcryptjs.default.hash(account.email, 10);
    return _models.default.VerificationToken.create({
      token: newToken,
      account_id: account.id
    }).catch(error => {
      console.log(`error creating verification token: ${error}`);
      return res.status(500).send({
        message: "Internal Server error."
      });
    });
  }

};
var _default = VerificationTokenController;
exports.default = _default;