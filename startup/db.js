const mongoose = require("mongoose");

module.exports = function () {
  mongoose
    .connect("mongodb://localhost:27017/vidly")
    .then(() => console.log("mongodb connected successfully..."))
    .catch((err) => console.log(err.message));
};
