const express = require('express');
const router = express.Router();
const toughtsController = require('./src/controllers/toughtsController');

// Toughts routes
router.get('/', toughtsController.showToughts);

module.exports = router;
