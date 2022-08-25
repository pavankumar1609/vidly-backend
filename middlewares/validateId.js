const mongoose = require("mongoose");

function validateId(req, res, next) {
  const valid = mongoose.Types.ObjectId.isValid(req.params.id);
  if (!valid)
    return res
      .status(400)
      .send(`"${req.params.id}" fails to match the valid mongo id pattern`);

  next();
}

module.exports = validateId;
