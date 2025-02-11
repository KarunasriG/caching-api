const express = require("express");
const router = express.Router();
const {
  createCache,
  getCache,
  deleteCache,
} = require("../controllers/cacheControllers");

router.post("/", createCache);
router.get("/:key", getCache);
router.delete("/:key", deleteCache);

module.exports = router;
