const User = require('../models/User');

exports.updatePreferredCurrency = async (req, res) => {
    try {
        const { currency } = req.body;

        if (!currency) {
            return res.status(400).json({ message: "Currecy is required" });
        }

        await User.findByIdAndUpdate(req.user.id, { preferredCurrency: currency });

        res.json({ message: `Preferred currency updated to ${currency}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
