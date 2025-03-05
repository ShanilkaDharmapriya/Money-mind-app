const express=require('express')
const {authMiddleware}=require('../middleware/authMiddleware')
const {getSpendingReport,
       getIncomeVsExpense
}=require('../controllers/reportController')

const router=express.Router()

router.get('/spending',authMiddleware,getSpendingReport)

router.get('/income-expense',authMiddleware,getIncomeVsExpense)

module.exports=router;