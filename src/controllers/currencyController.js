const { getExchangeRate } = require('../utils/currencyConverter');

exports.convertCurrency = async (req, res) => {
    try {
        const { fromCurrency, toCurrency, amount } = req.body;

        if (!fromCurrency || !toCurrency || !amount) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const convertedAmount = await getExchangeRate(fromCurrency, toCurrency, amount);
        res.json({ convertedAmount, fromCurrency, toCurrency });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
