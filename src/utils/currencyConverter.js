const exchangeRates = require('./exchangeRates.json');

exports.getExchangeRate = (fromCurrency, toCurrency, amount) => {
    try {
        if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
            console.error(`Unsupported currency: ${fromCurrency} or ${toCurrency}`);
            return amount; // Return original amount if the currency is not supported
        }

        const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];
        return amount * rate; // ✅ Convert the amount using the local exchange rate
    } catch (error) {
        console.error("Error fetching exchange rate:", error.message);
        return amount; // Return original amount if any error occurs
    }
};
