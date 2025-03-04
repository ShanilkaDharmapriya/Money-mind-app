const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { 
    createBudget, 
    getBudgets,
    getBudgetById,
    checkBudget,
    updateBudget,
    deleteBudget
} = require('../controllers/budgetController');

const router = express.Router();

// Create a new budget
router.post('/', authMiddleware, createBudget);

// Get all budgets
router.get('/', authMiddleware, getBudgets);

router.get('/', authMiddleware, getBudgetById);

// Update a budget
router.put('/:id', authMiddleware, updateBudget);

// Delete a budget
router.delete('/:id', authMiddleware, deleteBudget);

// Check if category or monthly budget exceeded
router.get('/check/alerts', authMiddleware, checkBudget);

module.exports = router;
