
const express = require('express');
const router = express.Router();

module.exports = (authController) => {
  router.post('/register', (req, res) => authController.register(req, res));
  router.post('/login', (req, res) => authController.login(req, res));

  return router;
};