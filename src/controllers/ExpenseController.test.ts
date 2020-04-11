import * as moment from "moment";
import app from "../app";
import request from "supertest";
import models from "../models/models";
import expense from "../models/Expense";

let token;
let categoryId;
let accountId;

beforeAll(async (done) => {
  const loginResult = await request(app).post("/api/v1/login").send({
    email: "test@test.test",
    password: "test",
  });
  token = loginResult.body.token;

  accountId = loginResult.body.user.id;

  const createCategory = await request(app)
    .post("/api/v1/categories")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "test category",
    });
  categoryId = createCategory.body.id;

  await models.Expense.destroy({
    where: {
      account_id: accountId,
    },
  });

  done();
});

afterEach(async (done) => {
  await models.Expense.destroy({
    where: {
      account_id: accountId,
    },
  });

  done();
});

afterAll(async (done) => {
  await request(app)
    .delete(`/api/v1/categories/${categoryId}`)
    .set("Authorization", `Bearer ${token}`);
  done();
});

describe("test auth", () => {
  it("should return 401 when no auth token is passed", async () => {
    expect.assertions(1);

    const result = await request(app).get("/api/v1/expenses");

    expect(result.statusCode).toEqual(401);
  });
});

describe("Expense Create validation", () => {
  it("should reject expense creation if an invalid category is passed", async () => {
    expect.assertions(1);

    const requestBody = {
      amount: 200.01,
      date: moment(new Date("2019-01-01")),
      description: "test description",
      category: 1,
    };
    const result = await request(app)
      .post("/api/v1/expenses")
      .set("Authorization", `Bearer ${token}`)
      .send(requestBody);

    expect(result.statusCode).toEqual(400);
  });
});

describe("API insert, update and delete expenses", () => {
  it("creates expenses", async () => {
    expect.assertions(3);

    const requestBody = {
      amount: 200.01,
      date: moment(new Date("2019-01-01")),
      description: "test description",
      category: categoryId,
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
    expect.assertions(3);

    const UPDATED_DESCRIPTION = "something else";

    const insertResult = await insertTestExpense();

    const expenseId = insertResult.body.id;

    const result = await request(app)
      .put(`/api/v1/expenses/${expenseId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        description: UPDATED_DESCRIPTION,
        date: moment(new Date("2019-01-01")),
        category: categoryId,
      });

    expect(result.statusCode).toEqual(200);
    expect(result.body.description).toEqual(UPDATED_DESCRIPTION);
    expect(result.body.category_id).toEqual(categoryId);
  });

  it("gets a expense", async () => {
    expect.assertions(3);

    const insertResult = await insertTestExpense();

    const expenseId = insertResult.body.id;

    const result = await request(app)
      .get(`/api/v1/expenses/${expenseId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(result.statusCode).toEqual(200);
    expect(result.body.description).toEqual(insertResult.body.description);
    expect(result.body.category_id).toEqual(categoryId);
  });

  it("returns all expenses related to account", async () => {
    expect.assertions(2);

    await insertTestExpense();

    const result = await request(app)
      .get("/api/v1/expenses")
      .set("Authorization", `Bearer ${token}`);

    expect(result.statusCode).toEqual(200);
    expect(result.body.rowCount).toEqual(1);
  });

  it("deletes expense", async () => {
    expect.assertions(1);

    const insertResult = await insertTestExpense();

    const expenseId = insertResult.body.id;

    const result = await request(app)
      .delete(`/api/v1/expenses/${expenseId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(result.statusCode).toEqual(204);
  });
});

describe("API getSuggestions", () => {
  it("gets expenses", async () => {
    await insertTestExpense();

    let requestBody2 = {
      amount: 199.99,
      date: moment(new Date("2019-01-01")),
      description: "test description",
      category: categoryId,
    };
    await request(app)
      .post("/api/v1/expenses")
      .set("Authorization", `Bearer ${token}`)
      .send(requestBody2);

    const result = await request(app)
      .get("/api/v1/reports/expenseSuggestions")
      .set("Authorization", `Bearer ${token}`);

    expect(result.statusCode).toEqual(200);
    expect(Object.keys(result.body.topDescriptions)).toEqual([
      requestBody2.description,
    ]);
    expect(result.body.categoryToDescription).toEqual({
      [categoryId]: [requestBody2.description],
    });
  });
});

describe("API getRecentExpenses", () => {
  it("gets expenses", async () => {
    expect.assertions(3);

    await insertTestExpense();

    const result = await request(app)
      .get("/api/v1/reports/recent")
      .set("Authorization", `Bearer ${token}`);

    expect(result.statusCode).toEqual(200);
    expect(result.body.rowCount).toEqual(1);
    expect(result.body.rows[0].category_id).toEqual(categoryId);
  });
});

async function insertTestExpense() {
  const requestBody = {
    amount: 200.01,
    date: moment(new Date("2019-01-01")),
    description: "test description",
    category: categoryId,
  };
  return await request(app)
    .post("/api/v1/expenses")
    .set("Authorization", `Bearer ${token}`)
    .send(requestBody);
}
