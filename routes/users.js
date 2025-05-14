const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

 
/* GET users listing. - Keep the placeholder or replace if needed */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
