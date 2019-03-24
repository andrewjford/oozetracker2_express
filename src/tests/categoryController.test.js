import app from "../app";
import request from "supertest";

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
