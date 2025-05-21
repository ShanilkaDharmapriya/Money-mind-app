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

