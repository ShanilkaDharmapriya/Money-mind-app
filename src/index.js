const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes')
const  transactionRouts = require('./routes/transactionRouts')

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(morgan('dev'));


// Routes

app.use('/api/auth', authRoutes );
app.use('/api/transactions', transactionRouts); 
app.use('/api/budgets', require('./routes/budgetRoutes'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
