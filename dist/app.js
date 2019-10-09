"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("@babel/polyfill");

var _express = _interopRequireDefault(require("express"));

var _index = _interopRequireDefault(require("./routes/index"));

var _cors = _interopRequireDefault(require("cors"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _models = require("./models/models");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express.default)();

_models.sequelize.sync();

app.use(_express.default.json());
app.use(_bodyParser.default.urlencoded({
  extended: false
}));
app.use((0, _cors.default)());
app.enable("trust proxy");
app.use("/", _index.default);
var _default = app;
exports.default = _default;