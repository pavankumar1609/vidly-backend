const Joi = require("joi");
const validator = require("../middlewares/validator");
const { Rental } = require("../models/rental");
const { Movie } = require("../models/movie");
const auth = require("../middlewares/auth");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.post("/", [auth, validator(validateReturn)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental) return res.status(404).send("Rental not found.");

  if (rental.dateReturned)
    return res.status(400).send("Return already processed.");

  rental.return();

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    await rental.save({ session });

    await Movie.updateOne(
      { _id: rental.movie._id },
      {
        $inc: {
          numberInStock: 1,
        },
      },
      { session }
    );

    await session.commitTransaction();
    res.send(rental);
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    session.endSession();
  }
});

function validateReturn(req) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(req);
}

module.exports = router;
