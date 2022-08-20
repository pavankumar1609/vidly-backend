const Joi = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const Genre = mongoose.model(
  "Genre",
  new Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
  })
);

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
  });

  return schema.validate(genre);
}

module.exports.Genre = Genre;
module.exports.validate = validateGenre;
