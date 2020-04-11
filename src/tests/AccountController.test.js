import app from "../app";
import request from "supertest";

let globalAccountId;
let globalToken;

beforeAll(async (done) => {
  const loginResult = await request(app).post("/api/v1/login").send({
    email: "test@test.test",
    password: "test",
  });

  globalToken = loginResult.body.token;
  globalAccountId = loginResult.body.user.id;

  done();
});

describe("account creation", () => {
  const TEST_EMAIL = "testworthy4@test.test";
  let testPassword = "testgoodpassword1!";
  let accountId;
  let token;

  it("should create a user", async () => {
    const result = await request(app).post("/api/v1/register").send({
      name: "mr Testworth",
      email: TEST_EMAIL,
      password: testPassword,
    });

    expect(result.statusCode).toEqual(201);
    accountId = result.body.user.id;
    token = result.body.token;
  });

  it("should login a user", async () => {
    const result = await request(app).post("/api/v1/login").send({
      email: TEST_EMAIL,
      password: testPassword,
    });

    expect(result.statusCode).toEqual(200);
  });

  it("should update a user password", async () => {
    expect.assertions(1);
    const newPassword = "testgoodpassword2!";

    const result = await request(app)
      .put(`/api/v1/accounts/${accountId}`)
      .send({
        oldPassword: testPassword,
        newPassword,
        confirmPassword: newPassword,
      })
      .set("Authorization", `Bearer ${token}`);

    expect(result.statusCode).toEqual(200);
    testPassword = newPassword;
  });

  it("should delete a user", async () => {
    const result = await request(app)
      .delete(`/api/v1/accounts/${accountId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(result.statusCode).toEqual(204);
  });
});

describe("account update and get", () => {
  const changedName = "changed name";

  it("should update a user name", async () => {
    expect.assertions(1);

    const result = await request(app)
      .put(`/api/v1/accounts/${globalAccountId}`)
      .send({
        name: changedName,
      })
      .set("Authorization", `Bearer ${globalToken}`);

    expect(result.statusCode).toEqual(200);
  });

  it("should get updated user info", async () => {
    expect.assertions(2);

    const result = await request(app)
      .get("/api/v1/account")
      .set("Authorization", `Bearer ${globalToken}`);

    expect(result.statusCode).toEqual(200);
    expect(result.body.name).toEqual(changedName);
  });
});
