const Transaction=require ('../models/Transaction')
const {autoSavings}=require('../controllers/goalController')

exports.createTransaction=async (req,res) => {
    try{
        const {type,category,amount,date,tags,description}=req.body;
        const newTransaction= await Transaction.create({
            user:req.user.id,
            type,
            category,
            amount,
            date,
            tags,
            description,

        })
        if (type === "income") {
            await autoSavings(req.user.id, amount);
        }
        res.status(201).json(newTransaction);
        
    }catch(error){
        res.status(201).json({message:error.message})
    }
}

exports.getTransaction=async(req,res)=>{
    try{
        const transaction=await Transaction.find({user:req.user.id}).sort({date:-1})
        res.json(transaction)
    }catch(error){
        res.status(500).json({message:error.message})
    }
}

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
