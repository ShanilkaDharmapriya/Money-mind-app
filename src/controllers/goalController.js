const Goal=require('../models/Goal')
const Transaction=require('../models/Transaction')

exports.createGoal=async (req,res) => {
    try{
        const{title,targetAmount,currentAmount,deadline,autoSavePercentage}=req.body

        const goal=await Goal.create({
            user:req.user.id,
            title,
            targetAmount,
            currentAmount,
            deadline,
            autoSavePercentage
        })
        res.json(goal)

    }catch(error){
        res.status(200).json({message:error.message})
    }
}

exports.getGoal=async (req,res) => {
    try{
        const goal=await Goal.find({user:req.user.id})
        res.json(goal)
    }catch(error){
        res.status(200).json({message:error.message})
    }
}

exports.getProgressGoal=async (req,res) => {
    try{
        const goal=await Goal.find({user:req.user.id})

        const progress=goal.map(goals => ({
            title:goals.title,
            targetAmount:goals.targetAmount,
            currentAmount:goals.currentAmount,
            progress:`${((goals.currentAmount/goals.targetAmount)*100).toFixed(2)}%`
        }))
        res.json(progress)
    }catch(error){
        res.status(200).json({message:error.message})
    }
}

exports.autoSavings = async (userId, incomeAmount) => {
    try {
        const goal = await Goal.find({ user: userId });

        await Promise.all(goal.map(async (goals) => {
            let allocatedAmount = (incomeAmount * goals.autoSavePercentage ) / 100;

            if (isNaN(allocatedAmount)) {
                allocatedAmount = 0;
            }
            goals.currentAmount += allocatedAmount;
            await goals.save();
        }));

        console.log("Savings allocated automatically from income.");
    } catch (error) {
        console.error(error.message);
    }
};

exports.deleteGoal = async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);
        if (!goal || goal.user.toString() !== req.user.id)
            return res.status(404).json({ message: 'Goal not found' });

        await goal.deleteOne();
        res.json({ message: 'Goal deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};