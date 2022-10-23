const mongoose = require("mongoose");

function validateId(req, res, next) {
  const valid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!valid) return res.status(404).send("Invalid ID");

  next();
}

module.exports = validateId;
