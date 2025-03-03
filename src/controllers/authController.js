const User=require('../models/User');
const jwt=require('jsonwebtoken');
const bcrypt = require('bcryptjs');


exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = await User.create({ username, email, password });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {  // ✅ Fix: Now `error` is defined
        console.error(error); // Logs the error in the terminal
        res.status(500).json({ message: error.message });
    }
};

exports.login=async(req,res)=>{
    try{
        const{email,password}=req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        
        res.status(500).json({ error: error.message });
    }
};
