const { ObjectId } = require("mongoose").Types;
const { Rental } = require("../../../models/rental");
const { User } = require("../../../models/user");
const { Movie } = require("../../../models/movie");
const request = require("supertest");
const moment = require("moment");

describe("api/returns", () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  let movie;
  let token;

  function exec() {
    return request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  }

  beforeEach(async () => {
    server = require("../../../index");
    customerId = new ObjectId();
    movieId = new ObjectId();
    token = new User().generateAuthToken();

    movie = new Movie({
      _id: movieId,
      title: "67488",
      dailyRentalRate: 5,
      genre: { name: "23344" },
      numberInStock: 10,
    });

    movie.save();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "pavan kumar",
        phone: "12345",
      },
      movie: {
        _id: movieId,
        title: "movie title",
        dailyRentalRate: 5,
      },
    });

    await rental.save();
  });

  afterEach(async () => {
    server.close();
    await Rental.deleteMany({});
    await Movie.deleteMany({});
  });

  it("should work!", async () => {
    const result = await Rental.findById(rental._id);

    expect(result).not.toBeNull();
  });

  it("should return 401 if client is not logged in.", async () => {
    token = "";

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return 400 if customerId is not provieded.", async () => {
    customerId = "";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if movieId is not provided.", async () => {
    movieId = "";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 404 if no rental found for the customer/movie.", async () => {
    await Rental.deleteMany({});

    const res = await exec();

    expect(res.status).toBe(404);
  });

  it("should return 400 if return is already processed.", async () => {
    rental.dateReturned = new Date();
    await rental.save();

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 200 if we have valid request.", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  it("should set the returnDate if input is valid.", async () => {
    await exec();

    const rentalInDb = await Rental.findOne(rental._id);

    const diff = new Date() - rentalInDb.dateReturned;

    expect(diff).toBeLessThan(10 * 1000);
  });

  it("should set the rentalFee if input is valid.", async () => {
    rental.dateOut = moment().add(-7, "days").toDate();
    await rental.save();

    await exec();

    const rentalInDb = await Rental.findOne(rental._id);
    expect(rentalInDb.rentalFee).toBe(35);
  });

  it("should decrease the numberinstock if input is valid.", async () => {
    await exec();

    const movieInDb = await Movie.findOne(movieId);
    expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
  });

  it("shoud return the rental if input is valid.", async () => {
    const res = await exec();

    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining([
        "dateOut",
        "dateReturned",
        "rentalFee",
        "movie",
        "customer",
      ])
    );
  });
});
