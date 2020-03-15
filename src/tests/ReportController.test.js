import moment from "moment";
import app from "../app";
import request from "supertest";
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

  await models.Expense.destroy({
    where: {
      account_id: accountId
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

describe("getSuggestions", () => {
  it("gets expenses", async () => {
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

    let requestBody2 = {
      amount: 199.99,
      date: moment(new Date("2019-01-01")),
      description: "test description",
      category: categoryId
    };
    await request(app)
      .post("/api/v1/expenses")
      .set("Authorization", `Bearer ${token}`)
      .send(requestBody2);

    const result = await request(app)
      .get("/api/v1/reports/expenseSuggestions")
      .set("Authorization", `Bearer ${token}`);

    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(1);
  });
});
