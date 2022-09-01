const mongoose = require("mongoose");
const request = require("supertest");
const { User } = require("../../../models/user");
let server;

describe("admin middleware", () => {
  beforeEach(() => {
    server = require("../../../index");
  });

  afterEach(() => {
    server.close();
  });

  it("should return 403 if client is not an admin.", async () => {
    const genreId = new mongoose.Types.ObjectId();
    const token = new User().generateAuthToken();

    const res = await request(server)
      .delete("/api/genres/" + genreId)
      .set("x-auth-token", token);

    expect(res.status).toBe(403);
  });
});
