const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { checkBudget, getGoalAlerts, getUpcomingBills } = require('../controllers/notificationController');

const router = express.Router();

router.get('/budget-alerts', authMiddleware, checkBudget);
router.get('/goal-alerts', authMiddleware, getGoalAlerts);
router.get('/upcoming-bills', authMiddleware, getUpcomingBills);

module.exports = router;
