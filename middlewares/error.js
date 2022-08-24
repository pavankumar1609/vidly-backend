function error(err, req, res, next) {
  //logging errors

  res.status(500).send("Something failed.");
}

module.exports = error;
