const { Genre, validate } = require("../models/genre");
const validator = require("../middlewares/validator");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const validateId = require("../middlewares/validateId");
const express = require("express");
const router = express.Router();
require("express-async-errors");

router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

router.get("/:id", [validateId], async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(genre);
});

router.post("/", [auth, validator(validate)], async (req, res) => {
  const genre = new Genre({ name: req.body.name });
  await genre.save();

  res.send(genre);
});

router.put(
  "/:id",
  [auth, validateId, validator(validate)],
  async (req, res) => {
    const genre = await Genre.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );

    if (!genre)
      return res.status(404).send("The genre with the given ID was not found.");

    res.send(genre);
  }
);

router.delete("/:id", [auth, admin, validateId], async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(genre);
});

module.exports = router;
