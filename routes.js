const express = require('express');
const router = express.Router();
const homeController = require('./src/controllers/homeController');

router.get('/', homeController.home);

module.exports = router;
