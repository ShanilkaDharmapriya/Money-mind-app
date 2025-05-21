const mongoose=require('mongoose')

const budgetSchema=new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category:{type:String,default:'Monthly'},
    amount:{type:String,required:true},
    startDate:{type:String,required:true},
    endDate:{type:String,required:true},
})

module.exports=mongoose.model('Budget',budgetSchema)