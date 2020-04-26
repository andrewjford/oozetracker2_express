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

describe("GET /api/v1/revenues", () => {
  it("should return 401 when no auth token is passed", async () => {
    const result = await request(app).get("/api/v1/revenues");

    expect(result.statusCode).toEqual(401);
  });
});

describe("insert, update and delete revenues", () => {
  let revenueId;
  const REVENUE_DESCRIPTION: string = "test income";
  const UPDATED_DESCRIPTION: string = "updated income";
  const UPDATED_AMOUNT: number = 1998.74;
  const REVENUE_AMOUNT: number = 2000.05;

  it("creates revenue", async () => {
    expect.assertions(3);

    const result = await request(app)
      .post("/api/v1/revenues")
      .set("Authorization", `Bearer ${token}`)
      .send({
        description: REVENUE_DESCRIPTION,
        amount: REVENUE_AMOUNT,
      });
    expect(result.statusCode).toEqual(201);
    expect(result.body.description).toEqual(REVENUE_DESCRIPTION);
    expect(result.body.amount).toEqual(REVENUE_AMOUNT.toFixed(2));
    revenueId = result.body.id;
  });

  it("updates revenue", async () => {
    expect.assertions(3);

    const result = await request(app)
      .put(`/api/v1/revenues/${revenueId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        description: UPDATED_DESCRIPTION,
        amount: UPDATED_AMOUNT,
      });

    expect(result.statusCode).toEqual(200);
    expect(result.body.description).toEqual(UPDATED_DESCRIPTION);
    expect(result.body.amount).toEqual(UPDATED_AMOUNT.toFixed(2));
  });

  it("gets a revenue", async () => {
    const result = await request(app)
      .get(`/api/v1/revenues/${revenueId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(result.statusCode).toEqual(200);
    expect(result.body.description).toEqual(UPDATED_DESCRIPTION);
  });

  it("should return all test user revenues", async () => {
    expect.assertions(2);

    const result = await request(app)
      .get("/api/v1/revenues")
      .set("Authorization", `Bearer ${token}`);
    expect(result.statusCode).toEqual(200);
    expect(result.body.rowCount).not.toEqual(0);
  });

  it("deletes revenue", async () => {
    const result = await request(app)
      .delete(`/api/v1/revenues/${revenueId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(result.statusCode).toEqual(204);
  });
});
