const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { getDashboard } = require('../controllers/dashboardController');

const router = express.Router();

// ✅ Get dashboard based on user role
router.get('/', authMiddleware, getDashboard);

module.exports = router;
