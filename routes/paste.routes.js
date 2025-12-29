const express = require("express");
const {
  createPaste,
  getPaste
} = require("../controllers/paste.controller");

const router = express.Router();

router.post("/pastes", createPaste);
router.get("/pastes/:id", getPaste);

module.exports = router;
