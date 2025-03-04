const Budget=require('../models/Budget')
const Transaction = require('../models/Transaction'); 


exports.createBudget=async (req,res) => {
    try{
        const{category,amount,startDate,endDate}=req.body

        
            const newBudget = await Budget.create({
                user: req.user.id,
                category,
                amount,
                startDate,
                endDate
            });
                res.status(201).json(newBudget)
        }catch(error){
            res.status(500).json({message:error.message})
        }
}

exports.getBudgets=async (req,res) => {
    try{
        const budget=await Budget.find({user:req.user.id})
        res.status(201).json(budget)
    }catch(error){
        res.status(404).json({message:error.message})
    }
}

exports.getBudgetById=async (req,res) => {
    try{
        const budget=await Budget.findById(req.params.id)
        if(!budget ||budget.user.toString() !== req.user.id)
            res.status(404).json({message:'budget not found'})

        res.json(budget)
    }catch(error){
        res.status(404).json({message:error.message})
    }
}
exports.updateBudget = async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.id);
        if (!budget || budget.user.toString() !== req.user.id)
            return res.status(404).json({ message: 'Budget not found' });

        const updatedBudget = await Budget.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedBudget);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteBudget=async(req,res)=>{
    try {
        const budget=await Budget.findById(req.params.id)
        if (!budget || budget.user.toString() !== req.user.id)
            return res.status(404).json({ message: 'Budget not found' });
        budget.deleteOne()
        res.json({message:'budget deleted'})

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.checkBudget = async (req, res) => {
    try {
        const budgets = await Budget.find({ user: req.user.id });
        const transactions = await Transaction.find({
            user: req.user.id,
            type: 'expense'
        });

        let budgetAlerts = [];
        let totalSpent = 0;
        let monthlyBudgetLimit = 0;

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

        // Check if total expenses exceed the monthly budget
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

        res.json(budgetAlerts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};