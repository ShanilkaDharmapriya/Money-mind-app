const exchangeRates = require('./exchangeRates.json');

exports.getExchangeRate = (fromCurrency, toCurrency, amount) => {
    try {


        if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
            console.error(`Unsupported currency: ${fromCurrency} or ${toCurrency}`);
            return amount;
        }



        const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];
        return amount * rate; 
    } catch (error) {
        console.error("Error fetching exchange rate:", error.message);
        return amount; 
    }
};
