import app from "../app";
import request from "supertest";

let token;

beforeAll(async (done) => {
  const response = await request(app).post("/api/v1/login").send({
    email: "test@test.test",
    password: "test",
  });
  token = response.body.token;
  done();
});

describe("GET /api/v1/categories", () => {
  it("should return 401 when no auth token is passed", async () => {
    const result = await request(app).get("/api/v1/categories");

    expect(result.statusCode).toEqual(401);
  });
});

describe("getAll /api/v1/categories", () => {
  let categoryId;

  it("should return test user categories", async () => {
    expect.assertions(2);

    const result = await request(app)
      .get("/api/v1/categories")
      .set("Authorization", `Bearer ${token}`);
    expect(result.statusCode).toEqual(200);
    expect(result.body.rowCount).not.toEqual(0);

    categoryId = result.body.rows[0].id;
  });

  it("getOne should return the test user category", async () => {
    expect.assertions(2);

    const result = await request(app)
      .get(`/api/v1/categories/${categoryId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(result.statusCode).toEqual(200);
    expect(result.body.id).toEqual(categoryId);
  });
});

describe("insert, update and delete categories", () => {
  let categoryId;
  const CATEGORY_NAME = "test tacos";
  const UPDATED_NAME = "updated tacos";

  it("creates category", async () => {
    const result = await request(app)
      .post("/api/v1/categories")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: CATEGORY_NAME,
      });
    expect(result.statusCode).toEqual(201);
    expect(result.body.name).toEqual(CATEGORY_NAME);
    categoryId = result.body.id;
  });

  it("updates category", async () => {
    expect.assertions(2);

    const result = await request(app)
      .put(`/api/v1/categories/${categoryId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: UPDATED_NAME,
      });

    expect(result.statusCode).toEqual(200);
    expect(result.body.name).toEqual(UPDATED_NAME);
  });

  it("gets a category", async () => {
    const result = await request(app)
      .get(`/api/v1/categories/${categoryId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(result.statusCode).toEqual(200);
    expect(result.body.name).toEqual(UPDATED_NAME);
  });

  it("deletes category", async () => {
    const result = await request(app)
      .delete(`/api/v1/categories/${categoryId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(result.statusCode).toEqual(204);
  });
});
