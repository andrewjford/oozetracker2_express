import app from "../app";
import request from "supertest";

let token;

beforeAll(async (done) => {
  const response = await request(app).post('/api/v1/login')
    .send({
      email: "test@test.test",
      password: "test",
    });
  token = response.body.token
  done();
});

describe("GET / - default endpoint test", () => {
  it("Hello world API Request", async () => {
    const result = await request(app).get("/");

    expect(result.statusCode).toEqual(200);
  });
});

describe("GET /api/v1/categories", () => {
  it("categories", async () => {
    const result = await request(app).get("/api/v1/categories");

    expect(result.statusCode).toEqual(401);
  });
});

describe("GET /api/v1/categories", () => {
  it("returns test user categories", async () => {
    const result = await request(app)
      .get("/api/v1/categories")
      .set("Authorization",`Bearer ${token}`);
    expect(result.statusCode).toEqual(200);
    expect(result.body.rows.length > 0);
  });
});
