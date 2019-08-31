"use strict";

var _app = _interopRequireDefault(require("../app"));

var _supertest = _interopRequireDefault(require("supertest"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let token;
beforeAll(async done => {
  const response = await (0, _supertest.default)(_app.default).post('/api/v1/login').send({
    email: "test@test.test",
    password: "test"
  });
  token = response.body.token;
  done();
});
describe("GET /api/v1/categories", () => {
  it("should return 401 when no auth token is passed", async () => {
    const result = await (0, _supertest.default)(_app.default).get("/api/v1/categories");
    expect(result.statusCode).toEqual(401);
  });
});
describe("GET /api/v1/categories", () => {
  it("should return test user categories", async () => {
    const result = await (0, _supertest.default)(_app.default).get("/api/v1/categories").set("Authorization", `Bearer ${token}`);
    expect(result.statusCode).toEqual(200);
    expect(!!result.body.id);
  });
});
describe("insert, update and delete categories", () => {
  let categoryId;
  const CATEGORY_NAME = "test tacos";
  const UPDATED_NAME = "updated tacos";
  it("creates category", async () => {
    const result = await (0, _supertest.default)(_app.default).post("/api/v1/categories").set("Authorization", `Bearer ${token}`).send({
      name: CATEGORY_NAME
    });
    expect(result.statusCode).toEqual(201);
    expect(result.body.name).toEqual(CATEGORY_NAME);
    categoryId = result.body.id;
  });
  it("updates category", async () => {
    const result = await (0, _supertest.default)(_app.default).put(`/api/v1/categories/${categoryId}`).set("Authorization", `Bearer ${token}`).send({
      name: UPDATED_NAME
    });
    expect(result.statusCode).toEqual(200);
    expect(result.body.name).toEqual(UPDATED_NAME);
  });
  it("gets a category", async () => {
    const result = await (0, _supertest.default)(_app.default).get(`/api/v1/categories/${categoryId}`).set("Authorization", `Bearer ${token}`);
    expect(result.statusCode).toEqual(200);
    expect(result.body.name).toEqual(UPDATED_NAME);
  });
  it("deletes category", async () => {
    const result = await (0, _supertest.default)(_app.default).delete(`/api/v1/categories/${categoryId}`).set("Authorization", `Bearer ${token}`);
    expect(result.statusCode).toEqual(204);
  });
});