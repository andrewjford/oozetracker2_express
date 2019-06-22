import app from "../app";
import AccountModel from "../models/AccountModel";

describe("account model tests", () => {
  let accountId;

  it("should create a user", async () => {
    const EMAIL = "testworth10@test.test";
    const req = {
      body: {
        name: "mr Testworth",
        email: EMAIL,
        password: "testgoodpassword!111"
      },
    };
    const result = await AccountModel.create(req);
    expect(result.user.email).toEqual(EMAIL);
    accountId = result.user.id;
  });

  it("should delete a user", async () => {
    const req = { accountId };
    const response = await AccountModel.delete(req);
    expect(response.command).toEqual("DELETE");
  });
});
