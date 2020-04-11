import moment from "moment";
import app from "../app";
import request from "supertest";
import models from "./models";
import ExpenseModel from "./ExpenseModel";

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
  const login = await request(app).post("/api/v1/login").send({
    email: "test@test.test",
    password: "test",
  });
  token = login.body.token;

  accountId = login.body.user.id;
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

describe("getRecentExpenses", () => {
  it("gets recent expenses by account Id", async () => {
    expect.assertions(4);

    const expense = {
      amount: 200.01,
      date: moment(new Date("2019-01-01")),
      description: "test description",
      category: categoryId,
    };
    await request(app)
      .post("/api/v1/expenses")
      .set("Authorization", `Bearer ${token}`)
      .send(expense);

    const result: any = await ExpenseModel.getRecentExpenses({
      accountId,
    });

    expect(result).not.toEqual(null);
    expect(result.rows.length).toEqual(1);
    expect(result.rows[0].description).toEqual(expense.description);
    expect(result.rows[0].category_id).toEqual(expense.category);
  });

  it("returns an empty list with no accountId", async () => {
    expect.assertions(2);

    const expense = {
      amount: 200.01,
      date: moment(new Date("2019-01-01")),
      description: "test description",
      category: categoryId,
    };
    await request(app)
      .post("/api/v1/expenses")
      .set("Authorization", `Bearer ${token}`)
      .send(expense);

    const result: any = await ExpenseModel.getRecentExpenses({});

    expect(result).not.toEqual(null);
    expect(result.rows.length).toEqual(0);
  });
});

describe("getExpenseSuggestions", () => {
  it("gets expenses", async () => {
    const requestBody = {
      amount: 200.01,
      date: moment(new Date("2019-01-01")),
      description: "test description",
      category: categoryId,
    };
    await request(app)
      .post("/api/v1/expenses")
      .set("Authorization", `Bearer ${token}`)
      .send(requestBody);

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

    const result = await ExpenseModel.getExpenseSuggestions(accountId);

    expect(Object.keys(result.topDescriptions)).toEqual(["test description"]);
    expect(result.categoryToDescription).toEqual({
      [categoryId]: ["test description"],
    });
  });
});
