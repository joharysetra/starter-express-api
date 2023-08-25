const express = require('express');
const { verifyToken } = require('../functions/verification');
const handleSendMessage  = require('../functions/message');
const router = express.Router();



//handle route for webhook api bot messenger
router.get('/webhook', verifyToken);
router.post('/webhook', handleSendMessage);

module.exports = router;
