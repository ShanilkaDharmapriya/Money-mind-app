const express = require('express')
const {authMiddleware}=require('../middleware/authMiddleware')
const {
    createTransaction,
    getTransaction, 
    getTransactionById, 
    updateTransaction, 
    deleteTransaction 
} = require('../controllers/transactionController');

const router=express.Router();

router.post('/',authMiddleware,createTransaction)
router.get('/',authMiddleware,getTransaction)
router.get('/:id',authMiddleware,getTransactionById)
router.patch('/:id',authMiddleware,updateTransaction)
router.delete('/:id',authMiddleware,deleteTransaction)

module.exports=router;