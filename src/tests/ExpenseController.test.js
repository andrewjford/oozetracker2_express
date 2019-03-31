import moment from 'moment';
import app from "../app";
import request from "supertest";

let token;
let categoryId;

beforeAll(async (done) => {
  const login = await request(app).post('/api/v1/login')
    .send({
      email: "test@test.test",
      password: "test",
    });
  token = login.body.token;
  const createCategory = await request(app)
    .post("/api/v1/categories")
    .set("Authorization",`Bearer ${token}`)
    .send({
      name: "test category",
    });
  categoryId = createCategory.body.id;
  done();
});

afterAll(async (done) => {
  const result = await request(app)
    .delete(`/api/v1/categories/${categoryId}`)
    .set("Authorization",`Bearer ${token}`);
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
      created_date: moment(new Date()),
      modified_date: moment(new Date()),
      date: moment(new Date("2019-01-01")),
      description: "test description",
      category: 1,
    }
    const result = await request(app)
      .post("/api/v1/expenses")
      .set("Authorization",`Bearer ${token}`)
      .send(requestBody);
    expect(result.statusCode).toEqual(400);
  })
})

describe("insert, update and delete expenses", () => {
  let expenseId;
  const UPDATED_DESCRIPTION = "something else";
  
  it("creates expenses", async () => {
    const requestBody = {
      amount: 200.01,
      created_date: moment(new Date()),
      modified_date: moment(new Date()),
      date: moment(new Date("2019-01-01")),
      description: "test description",
      category: categoryId,
    }
    const result = await request(app)
      .post("/api/v1/expenses")
      .set("Authorization",`Bearer ${token}`)
      .send(requestBody);
    expect(result.statusCode).toEqual(201);
    console.log(JSON.stringify(result.body));
    expect(result.body.description).toEqual("test description");
    expenseId = result.body.id;
  });

  it("updates expenses", async () => {
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
  });

  it("gets a expense", async () => {
    const result = await request(app)
      .get(`/api/v1/expenses/${expenseId}`)
      .set("Authorization",`Bearer ${token}`);
    expect(result.statusCode).toEqual(200);
    expect(result.body.description).toEqual(UPDATED_DESCRIPTION);
  });

  it("returns all expenses related to account", async () => {
    const result = await request(app)
      .get("/api/v1/expenses")
      .set("Authorization", `Bearer ${token}`);
    expect(result.statusCode).toEqual(200);
    expect(result.body.rowCount).toEqual(1);
  });

  it("deletes expense", async () => {
    const result = await request(app)
      .delete(`/api/v1/expenses/${expenseId}`)
      .set("Authorization",`Bearer ${token}`);
    expect(result.statusCode).toEqual(204);
  });
});

