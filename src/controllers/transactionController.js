const Transaction=require ('../models/Transaction')
const {autoSavings}=require('../controllers/goalController')
const { getExchangeRate } = require('../utils/currencyConverter');
const User = require('../models/User'); 


exports.createTransaction = async (req, res) => {
        try {
            const { type, category, amount, date, tags, description, currency } = req.body;
    
            // ✅ Get the user's preferred currency
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const userCurrency = user.preferredCurrency || "USD";
    
            let finalAmount = amount;
            let transactionCurrency = userCurrency; // ✅ Always save transactions in the user's preferred currency
    
            // ✅ Convert the transaction amount to the user's preferred currency before saving
            if (currency && currency !== userCurrency) {
                finalAmount = await getExchangeRate(currency, userCurrency, amount);
            }
    
            // ✅ Save the transaction with the converted amount
            const newTransaction = await Transaction.create({
                user: req.user.id,
                type,
                category,
                amount: finalAmount, // ✅ Stored in the user's preferred currency
                currency: userCurrency, // ✅ Always store in the user's currency
                date,
                tags,
                description
            });
    
            // ✅ Auto-savings should use the converted amount
            if (type === "income") {
                await autoSavings(req.user.id, finalAmount);
            }
    
            res.status(201).json(newTransaction);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

/*exports.getTransaction=async(req,res)=>{
    try{
        const transaction=await Transaction.find({user:req.user.id}).sort({date:-1})
        res.json(transaction)
    }catch(error){
        res.status(500).json({message:error.message})
    }
}*/

exports.getTransaction = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const userCurrency = user.preferredCurrency;

        const transactions = await Transaction.find({ user: req.user.id }).sort({date:-1});

        const convertedTransactions = await Promise.all(transactions.map(async (transaction) => {
            if (transaction.currency !== userCurrency) {
                transaction.amount = await getExchangeRate(transaction.currency, userCurrency, transaction.amount);
                transaction.currency = userCurrency;
            }
            return transaction;
        })); res.json(convertedTransactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTransactionById=async (req,res) => {
    try{
        const transaction=await Transaction.findById(req.params.id)
        if(!transaction ||  transaction.user.toString() !== req.user.id)
            res.status(404).json({message:'Transaction not found'})
        res.json(transaction)
    }catch(error){
        res.status(500).json({message:error.message})
    }
}

exports.updateTransaction=async (req,res) => {
    try{
        const {id} = req.params
        const response = await Transaction.findByIdAndUpdate({_id:id}, {...req.body})
        res.status(200).json(response)
    }catch(error){
        res.status(404).json({error:error})
    }
    /*try{
        const transaction=await Transaction.findById(req.params.id)
        if(!transaction || transaction.user.toString() !== req.user.id )
            res.status(404).json({message:'transaction not found'})

        const updatedTransaction=await Transaction.findByIdAndUpdate(req.params.id,req.body,{new:true})
        res.json(updatedTransaction)
    }catch(error){
        res.status(500).json({message:error.message})
    }*/
}

exports.deleteTransaction=async (req,res) => {
    try{
        const transaction=await Transaction.findById(req.params.id)
        if(!transaction || transaction.user.toString() !== req.user.id )
            res.status(404).json({message:'transaction not found'})
        transaction.deleteOne()
        res.json({message:'transaction deleted'})
    }catch{
        res.status(500).json({message:error.message})
    }
}
