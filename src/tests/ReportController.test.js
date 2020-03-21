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
