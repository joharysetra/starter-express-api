const express = require('express');
const { functionTest } = require('../functions/verification');
const router = express.Router();

router.get('/',functionTest);

module.exports = router;