const express = require('express')
const {authMiddleware}=require('../middleware/authMiddleware')
const {
    createGoal,
    getGoal,
    getProgressGoal,
    deleteGoal

} = require('../controllers/goalController');

const router=express.Router();

router.post('/',authMiddleware,createGoal)
router.get('/',authMiddleware,getGoal)
router.get('/progress',authMiddleware,getProgressGoal)
router.delete('/:id',authMiddleware,deleteGoal)

module.exports=router;