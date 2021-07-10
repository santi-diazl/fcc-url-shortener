const express = require("express");
const router = express.Router();

// require controller module
const controller = require("./controller");

// post new URL
router.post("/", controller.add_new_url);

// get
router.get("/:short_url", controller.redir_to_url);

module.exports = router;
