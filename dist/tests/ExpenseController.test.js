"use strict";

var _moment = _interopRequireDefault(require("moment"));

var _app = _interopRequireDefault(require("../app"));

var _supertest = _interopRequireDefault(require("supertest"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let token;
let categoryId;
beforeAll(async done => {
  const login = await (0, _supertest.default)(_app.default).post("/api/v1/login").send({
    email: "test@test.test",
    password: "test"
  });
  token = login.body.token;
  const createCategory = await (0, _supertest.default)(_app.default).post("/api/v1/categories").set("Authorization", `Bearer ${token}`).send({
    name: "test category"
  });
  categoryId = createCategory.body.id;
  done();
});
afterAll(async done => {
  const result = await (0, _supertest.default)(_app.default).delete(`/api/v1/categories/${categoryId}`).set("Authorization", `Bearer ${token}`);
  done();
});
describe("test auth", () => {
  it("should return 401 when no auth token is passed", async () => {
    const result = await (0, _supertest.default)(_app.default).get("/api/v1/expenses");
    expect(result.statusCode).toEqual(401);
  });
});
describe("Expense Create validation", () => {
  it("should reject expense creation if an invalid category is passed", async () => {
    const requestBody = {
      amount: 200.01,
      date: (0, _moment.default)(new Date("2019-01-01")),
      description: "test description",
      category: 1
    };
    const result = await (0, _supertest.default)(_app.default).post("/api/v1/expenses").set("Authorization", `Bearer ${token}`).send(requestBody);
    expect(result.statusCode).toEqual(400);
  });
});
describe("insert, update and delete expenses", () => {
  let expenseId;
  const UPDATED_DESCRIPTION = "something else";
  it("creates expenses", async () => {
    const requestBody = {
      amount: 200.01,
      date: (0, _moment.default)(new Date("2019-01-01")),
      description: "test description",
      category: categoryId
    };
    const result = await (0, _supertest.default)(_app.default).post("/api/v1/expenses").set("Authorization", `Bearer ${token}`).send(requestBody);
    expect(result.statusCode).toEqual(201);
    expect(result.body.description).toEqual("test description");
    expect(result.body.name).toEqual("test category");
    expenseId = result.body.id;
  });
  it("updates expenses", async () => {
    const result = await (0, _supertest.default)(_app.default).put(`/api/v1/expenses/${expenseId}`).set("Authorization", `Bearer ${token}`).send({
      description: UPDATED_DESCRIPTION,
      date: (0, _moment.default)(new Date("2019-01-01")),
      category: categoryId
    });
    expect(result.statusCode).toEqual(200);
    expect(result.body.description).toEqual(UPDATED_DESCRIPTION);
    expect(result.body.name).toEqual("test category");
  });
  it("gets a expense", async () => {
    const result = await (0, _supertest.default)(_app.default).get(`/api/v1/expenses/${expenseId}`).set("Authorization", `Bearer ${token}`);
    expect(result.statusCode).toEqual(200);
    expect(result.body.description).toEqual(UPDATED_DESCRIPTION);
    expect(result.body.name).toEqual("test category");
  });
  it("returns all expenses related to account", async () => {
    const result = await (0, _supertest.default)(_app.default).get("/api/v1/expenses").set("Authorization", `Bearer ${token}`);
    expect(result.statusCode).toEqual(200);
    expect(result.body.rowCount).toEqual(1);
  });
  it("deletes expense", async () => {
    const result = await (0, _supertest.default)(_app.default).delete(`/api/v1/expenses/${expenseId}`).set("Authorization", `Bearer ${token}`);
    expect(result.statusCode).toEqual(204);
  });
});