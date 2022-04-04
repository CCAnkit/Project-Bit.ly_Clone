const express = require('express');
const router = express.Router();
const urlController = require("../controllers/urlController.js");


router.post(`/url/shorten`, urlController.urlShorten);
router.get(`/:urlCode`,  urlController.getUrl);

// router.get(``, );
// router.get(``, );

module.exports = router;