const { createTransaction } = require('../../src/controllers/transactionController');
const User = require('../../src/models/User');
const Transaction = require('../../src/models/Transaction');
jest.mock('../../src/models/User');
jest.mock('../../src/models/Transaction');

describe("Transaction Controller Tests", () => {
    test("Create a transaction and store in preferred currency", async () => {
        const req = {
            user: { id: "user123" },
            body: { type: "income", category: "Salary", amount: 1000, currency: "USD", date: "2024-04-01", description: "Salary Payment" }
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        User.findById.mockResolvedValue({ preferredCurrency: "EUR" });
        Transaction.create.mockResolvedValue({ user: "user123", type: "income", category: "Salary", amount: 920, currency: "EUR", date: "2024-04-01T00:00:00.000Z", description: "Salary Payment" });

        await createTransaction(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ currency: "EUR" }));
    });
});
