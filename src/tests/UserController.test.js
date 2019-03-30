import app from "../app";
import request from "supertest";

describe("POST /api/v1/register", () => {
  const TEST_EMAIL = "testworth1@test.test";
  const TEST_PASSWORD = "test";
  let accountId;
  let token;

  it("should create a user", async () => {
    const result = await request(app).post("/api/v1/register")
      .send({
        name: "mr Testworth",
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      });

    expect(result.statusCode).toEqual(201);
    accountId = result.body.user.id;
    token = result.body.token;
  });

  it("should login a user", async () => {
    const result = await request(app)
      .post("/api/v1/login")
      .send({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      });
    
      expect(result.statusCode).toEqual(200);
  })

  it("should delete a user", async () => {
    const result = await request(app)
      .delete(`/api/v1/users/${accountId}`)
      .set("Authorization",`Bearer ${token}`);
    expect(result.statusCode).toEqual(204);
  });
});
