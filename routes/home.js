const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home");

router.get("/", homeController.getIndex);
router.get("/kovo", homeController.getKoVo);
router.get("/download", homeController.getHTML);

module.exports = router;