const mongoose=require('mongoose')

const goalSchema=new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title:{type:String,require:true},
    targetAmount:{type:Number,require:true},
    currentAmount:{type:Number,default:0},
    deadline:{type:Date,require:true},
    autoSavePercentage:{type:Number,default:0}
})

module.exports=mongoose.model('Goal',goalSchema)