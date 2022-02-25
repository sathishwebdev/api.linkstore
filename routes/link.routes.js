const express = require("express");
const router = express.Router();
const linkController = require("../controllers/link.controller");

// add Link
router.post("/add", linkController.addLinks)

//  get link data
router.get("/", linkController.getLinkData)

module.exports = router