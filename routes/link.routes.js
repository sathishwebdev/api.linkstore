const express = require("express");
const router = express.Router();
const linkController = require("../controllers/link.controller");

// add Link
router.post("/add", linkController.addLinks)

//  get link data
router.get("/", linkController.getLinkData)
router.get('/redirect/:shortId', linkController.redirectUrl)
router.get('/user/:userName', linkController.getLinkByUser)
router.post("/add/sitemap", linkController.addSitemap)
router.get("/fetch/sitemap/:username", linkController.fetchSitemaps)
module.exports = router