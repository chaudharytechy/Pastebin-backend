const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/healthz", (req, res) => {
  res.status(200).json({
    ok: mongoose.connection.readyState === 1
  });
});

module.exports = router;
