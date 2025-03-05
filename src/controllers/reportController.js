const Transaction=require('../models/Transaction')
const mongoose = require('mongoose'); 

exports.getSpendingReport=async (req,res) => {
    try{
        const {startDate,endDate,category}=req.query

        let filter={
            user : req.user.id,
            type : 'expense',
            date : {$gte:new Date(startDate),$lte:new Date(endDate)}
        }

        if(category){
            filter.category=category
        }
        const transactions = await Transaction.find(filter);

        let report = {};
            transactions.forEach(transaction => {
            report[transaction.category] = (report[transaction.category] || 0) + transaction.amount;
            })
        res.json(report)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getIncomeVsExpense = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const start = new Date(startDate);
        const end = new Date(endDate);

        const userId = new mongoose.Types.ObjectId(req.user.id);

        const income = await Transaction.aggregate([
            { $match: { user: userId, type: "income", date: { $gte: start, $lte: end } } },
            { $group: { _id: null, totalIncome: { $sum: "$amount" } } }
        ]);

        const expenses = await Transaction.aggregate([
            { $match: { user: userId, type: "expense", date: { $gte: start, $lte: end } } },
            { $group: { _id: null, totalExpenses: { $sum: "$amount" } } }
        ]);

        res.json({
            chartData: {
                labels: ["Time"],
                income: [income.length > 0 ? income[0].totalIncome : 0],
                expenses: [expenses.length > 0 ? expenses[0].totalExpenses : 0]
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



    
