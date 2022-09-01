const request = require("supertest");
const mongoose = require("mongoose");
const { Genre } = require("../../../models/genre");
const { User } = require("../../../models/user");
let server;

describe("api/genres", () => {
  beforeEach(async () => {
    server = require("../../../index");
  });

  afterEach(async () => {
    await Genre.deleteMany({});
    server.close();
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genre.insertMany([{ name: "genre1" }, { name: "genre2" }]);

      const res = await request(server).get("/api/genres");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return a genre if valid id is passed.", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();

      const res = await request(server).get("/api/genres/" + genre._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });

    it("should return 400 if invalid id passed.", async () => {
      const res = await request(server).get("/api/genres/1");

      expect(res.status).toBe(400);
    });

    it("should return 404 if genre with the given id was not exist.", async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(server).get("/api/genres/" + id);

      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let token;
    let name;

    function exec() {
      return request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name });
    }

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "genre1";
    });

    it("should return 401 if client is not logged in.", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if genre is less than 5 characters.", async () => {
      name = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is more than 50 characters.", async () => {
      name = new Array(52).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should save the genre if it is valid.", async () => {
      await exec();

      const genre = await Genre.findOne({ name: "genre1" });

      expect(genre).not.toBeNull();
    });

    it("should return the genre if it is valid.", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });

  describe("PUT /:id", () => {
    let genreId;
    let token;
    let name;

    function exec() {
      return request(server)
        .put("/api/genres/" + genreId)
        .set("x-auth-token", token)
        .send({ name });
    }

    beforeEach(() => {
      token = new User().generateAuthToken();
      genreId = new mongoose.Types.ObjectId();
      name = "genre1";
    });

    it("should return 401 if client is not logged in.", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if invalid id is passed.", async () => {
      genreId = "1";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is less than 5 characters.", async () => {
      name = "h";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is more than 50 characters.", async () => {
      name = new Array(52).join("h");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 404 if genre with the given id was not exist.", async () => {
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should update the genre with the given id.", async () => {
      let genre = new Genre({ name });
      genre = await genre.save();

      genreId = genre._id;
      name = "genre2";

      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", "genre2");
    });
  });

  describe("DELETE /:id", () => {
    let genreId;
    let token;

    function exec() {
      return request(server)
        .delete("/api/genres/" + genreId)
        .set("x-auth-token", token);
    }

    beforeEach(() => {
      genreId = new mongoose.Types.ObjectId();
      token = new User().generateAuthToken();
    });

    it("should return 401 if client is not logged in.", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 403 if client is not an admin.", async () => {
      const res = await exec();

      expect(res.status).toBe(403);
    });

    it("should return 400 if invalid id is passed.", async () => {
      genreId = "123";
      token = new User({ isAdmin: true }).generateAuthToken();

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 404 if genre with the given id was not exists.", async () => {
      token = new User({ isAdmin: true }).generateAuthToken();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 200 if genre with the given id is exists.", async () => {
      let genre = new Genre({ name: "genre1" });
      genre = await genre.save();

      token = new User({ isAdmin: true }).generateAuthToken();
      genreId = genre._id;

      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });
});
