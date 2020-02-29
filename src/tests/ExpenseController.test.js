import moment from "moment";
import app from "../app";
import request from "supertest";
import ExpenseModel from "../models/ExpenseModel";
import models from "../models/models";

let token;
let categoryId;

beforeAll(async done => {
  const loginResult = await request(app)
    .post("/api/v1/login")
    .send({
      email: "test@test.test",
      password: "test"
    });
  token = loginResult.body.token;

  const accountId = loginResult.body.user.id;

  const createCategory = await request(app)
    .post("/api/v1/categories")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "test category"
    });
  categoryId = createCategory.body.id;

  const existingExpenses = await ExpenseModel.getAll({
    accountId
  });

  const existingIds = existingExpenses.rows.map(expense => expense.id);

  await models.Expense.destroy({
    where: {
      id: existingIds
    }
  });

  done();
});

afterEach(async done => {
  const login = await request(app)
    .post("/api/v1/login")
    .send({
      email: "test@test.test",
      password: "test"
    });
  token = login.body.token;

  const accountId = login.body.user.id;
  await models.Expense.destroy({
    where: {
      account_id: accountId
    }
  });

  done();
});

afterAll(async done => {
  await request(app)
    .delete(`/api/v1/categories/${categoryId}`)
    .set("Authorization", `Bearer ${token}`);
  done();
});

describe("test auth", () => {
  it("should return 401 when no auth token is passed", async () => {
    const result = await request(app).get("/api/v1/expenses");

    expect(result.statusCode).toEqual(401);
  });
});

describe("Expense Create validation", () => {
  it("should reject expense creation if an invalid category is passed", async () => {
    const requestBody = {
      amount: 200.01,
      date: moment(new Date("2019-01-01")),
      description: "test description",
      category: 1
    };
    const result = await request(app)
      .post("/api/v1/expenses")
      .set("Authorization", `Bearer ${token}`)
      .send(requestBody);
    expect(result.statusCode).toEqual(400);
  });
});

describe("insert, update and delete expenses", () => {
  it("creates expenses", async () => {
    const requestBody = {
      amount: 200.01,
      date: moment(new Date("2019-01-01")),
      description: "test description",
      category: categoryId
    };
    const result = await request(app)
      .post("/api/v1/expenses")
      .set("Authorization", `Bearer ${token}`)
      .send(requestBody);

    expect(result.statusCode).toEqual(201);
    expect(result.body.description).toEqual("test description");
    expect(result.body.category_id).toEqual(categoryId);
  });

  it("updates expenses", async () => {
    const UPDATED_DESCRIPTION = "something else";

    const requestBody = {
      amount: 200.01,
      date: moment(new Date("2019-01-01")),
      description: "test description",
      category: categoryId
    };
    const insertResult = await request(app)
      .post("/api/v1/expenses")
      .set("Authorization", `Bearer ${token}`)
      .send(requestBody);

    const expenseId = insertResult.body.id;

    const result = await request(app)
      .put(`/api/v1/expenses/${expenseId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        description: UPDATED_DESCRIPTION,
        date: moment(new Date("2019-01-01")),
        category: categoryId
      });

    expect(result.statusCode).toEqual(200);
    expect(result.body.description).toEqual(UPDATED_DESCRIPTION);
    expect(result.body.category_id).toEqual(categoryId);
  });

  it("gets a expense", async () => {
    const requestBody = {
      amount: 200.01,
      date: moment(new Date("2019-01-01")),
      description: "test description",
      category: categoryId
    };
    const insertResult = await request(app)
      .post("/api/v1/expenses")
      .set("Authorization", `Bearer ${token}`)
      .send(requestBody);

    const expenseId = insertResult.body.id;

    const result = await request(app)
      .get(`/api/v1/expenses/${expenseId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(result.statusCode).toEqual(200);
    expect(result.body.description).toEqual(requestBody.description);
    expect(result.body.category_id).toEqual(categoryId);
  });

  it("returns all expenses related to account", async () => {
    const requestBody = {
      amount: 200.01,
      date: moment(new Date("2019-01-01")),
      description: "test description",
      category: categoryId
    };

    await request(app)
      .post("/api/v1/expenses")
      .set("Authorization", `Bearer ${token}`)
      .send(requestBody);

    const result = await request(app)
      .get("/api/v1/expenses")
      .set("Authorization", `Bearer ${token}`);

    expect(result.statusCode).toEqual(200);
    expect(result.body.rowCount).toEqual(1);
  });

  it("deletes expense", async () => {
    const requestBody = {
      amount: 200.01,
      date: moment(new Date("2019-01-01")),
      description: "test description",
      category: categoryId
    };
    const insertResult = await request(app)
      .post("/api/v1/expenses")
      .set("Authorization", `Bearer ${token}`)
      .send(requestBody);

    const expenseId = insertResult.body.id;

    const result = await request(app)
      .delete(`/api/v1/expenses/${expenseId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(result.statusCode).toEqual(204);
  });
});
