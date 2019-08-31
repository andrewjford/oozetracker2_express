"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mail = _interopRequireDefault(require("@sendgrid/mail"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const hostUrl = process.env.HOST_URL;
const mailer = {
  async sendVerificationMessage(toEmail, token) {
    const sendGridMail = _mail.default;
    sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: toEmail,
      from: "verify@cashtracker.tech",
      subject: "Welcome to Cash Tracker! Please Confirm Your Email",
      text: `Click on this link to verify your email ${hostUrl}/verification?token=${token}&email=${toEmail}`,
      html: `<strong>
        Click <a href="${hostUrl}/api/v1/verification?token=${token}&email=${toEmail}">here</a> to verify your email
        </strong>`
    };
    sendGridMail.send(msg);
  }

};
var _default = mailer;
exports.default = _default;