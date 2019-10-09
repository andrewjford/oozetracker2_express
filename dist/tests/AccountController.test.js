"use strict";

var _app = _interopRequireDefault(require("../app"));

var _supertest = _interopRequireDefault(require("supertest"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("account endpoints", () => {
  const TEST_EMAIL = "testworthy4@test.test";
  const TEST_PASSWORD = "testgoodpassword1!";
  let accountId;
  let token;
  it("should create a user", async () => {
    const result = await (0, _supertest.default)(_app.default).post("/api/v1/register").send({
      name: "mr Testworth",
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });
    expect(result.statusCode).toEqual(201);
    accountId = result.body.user.id;
    token = result.body.token;
  });
  it("should login a user", async () => {
    const result = await (0, _supertest.default)(_app.default).post("/api/v1/login").send({
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });
    expect(result.statusCode).toEqual(200);
  });
  it("should delete a user", async () => {
    const result = await (0, _supertest.default)(_app.default).delete(`/api/v1/accounts/${accountId}`).set("Authorization", `Bearer ${token}`);
    expect(result.statusCode).toEqual(204);
  });
});