const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { updatePreferredCurrency } = require('../controllers/userController');

const router = express.Router();

// ✅ Update Preferred Currency
router.put('/update-currency', authMiddleware, updatePreferredCurrency);

module.exports = router;
