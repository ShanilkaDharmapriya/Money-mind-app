const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { updatePreferredCurrency } = require('../controllers/userController');

const router = express.Router();

router.put('/update-currency', authMiddleware, updatePreferredCurrency);

module.exports = router;
