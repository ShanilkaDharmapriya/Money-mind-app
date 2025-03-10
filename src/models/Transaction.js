const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['income', 'expense'], required: true }, 
    category: { type: String, required: true }, 
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    tags: [{ type: String }], 
    description:{type:String},
    currency: { type: String, default: "USD" }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
