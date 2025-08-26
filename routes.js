const express = require('express');
const router = express.Router();
const toughtsController = require('./src/controllers/toughtsController');
const authController = require('./src/controllers/authController');

// Toughts routes
router.get('/', toughtsController.showToughts);

//Auth Routes
router.get('/register', authController.register);
router.post('/register', authController.registerPost);
router.get('/login', authController.login);
//router.post('/login', authController.loginPost);

module.exports = router;
