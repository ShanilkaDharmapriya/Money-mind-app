const Budget = require('../models/Budget');
const Goal = require('../models/Goal');
const Transaction = require('../models/Transaction');

exports.checkBudget = async (req, res) => {
    try {
        const budgets = await Budget.find({ user: req.user.id });
        const transactions = await Transaction.find({ user: req.user.id, type:'expense' });

        let budgetAlerts = [];
        let totalSpent = 0;
        let monthlyBudgetLimit =0;

        if (!budgets || budgets.length === 0) {
            return res.status(200).json({ message:"No budget data available." });
        }

        for (const budget of budgets) {
            const spent = transactions
                .filter(t => budget.category === "Monthly" || t.category === budget.category)
                .reduce((sum, t) => sum + t.amount, 0);

            if (budget.category === "Monthly") {
                totalSpent = spent;
                monthlyBudgetLimit = budget.amount;
            } else if (spent >= budget.amount * 0.8) {
                budgetAlerts.push({
                    category: budget.category,
                    totalSpent: spent,
                    budgetLimit: budget.amount,
                    message: spent >= budget.amount
                        ? `You have exceeded your budget for ${budget.category}!`
                        : `You are nearing your budget for ${budget.category}.`
                });
            }
        }




        if (monthlyBudgetLimit > 0 && totalSpent >= monthlyBudgetLimit * 0.8) {
            budgetAlerts.push({
                category: "Monthly",
                totalSpent: totalSpent,
                budgetLimit: monthlyBudgetLimit,
                message: totalSpent >= monthlyBudgetLimit
                    ? `You have exceeded your total monthly budget!`
                    : `You are nearing your total monthly budget.`
            });
        }

        res.status(200).json(budgetAlerts.length > 0 ? budgetAlerts : { message:"No budget alerts." });
    } catch (error) {
        console.error("Error in checkBudget:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.getGoalAlerts = async (req, res) => {
    try {
        const goals = await Goal.find({ user: req.user.id });
        let alerts = [];

        if (!goals || goals.length === 0) {
            return res.status(200).json({ message: "No goals found." });
        }

        for (const goal of goals) {
            let progress = (goal.currentAmount / goal.targetAmount) * 100;

            if (progress >= 80) {
                alerts.push({
                    goal: goal.title,
                    progress: `${progress.toFixed(2)}%`,
                    message: progress >= 100
                        ? `Congratulations! You have achieved your goal: ${goal.title}`
                        : `You are nearing your goal (${goal.title}) with ${progress.toFixed(2)}% saved.`
                });
            }
        }

        res.status(200).json(alerts.length > 0 ? alerts : { message: "No goal alerts." });
    } catch (error) {
        console.error("Error in getGoalAlerts:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.getUpcomingBills = async (req, res) => {
    try {
        const today = new Date();
        const upcomingTransactions = await Transaction.find({
            user: req.user.id,
            type: 'expense',
            date: { $gte: today }
        }).sort({ date: 1 });

        res.status(200).json(upcomingTransactions.length > 0 ? upcomingTransactions : { message: "No upcoming bills." });
    } catch (error) {
        console.error("Error in getUpcomingBills:", error);
        res.status(500).json({ message: error.message });
    }
};
