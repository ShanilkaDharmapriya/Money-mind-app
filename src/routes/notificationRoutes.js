const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { checkBudget, getGoalAlerts, getUpcomingBills } = require('../controllers/notificationController');

const router = express.Router();

// ✅ Get budget alerts
router.get('/budget-alerts', authMiddleware, checkBudget);

// ✅ Get goal alerts
router.get('/goal-alerts', authMiddleware, getGoalAlerts);

// ✅ Get upcoming bill reminders
router.get('/upcoming-bills', authMiddleware, getUpcomingBills);

module.exports = router;
