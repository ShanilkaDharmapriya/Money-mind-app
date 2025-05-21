const mongoose = require('mongoose');
const { getIncomeVsExpense } = require("../../src/controllers/reportController");
const Transaction = require("../../src/models/Transaction");
jest.mock("../../src/models/Transaction");

describe("Report Controller Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Generate income vs expense report", async () => {
        const req = { 
            user: { id: new mongoose.Types.ObjectId() }, 
            query: { startDate: "2024-04-01", endDate: "2024-04-30" }
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Transaction.aggregate.mockImplementation((pipeline) => {
            if (pipeline[0].$match.type === "income") return Promise.resolve([{ totalIncome: 3000 }]);
            if (pipeline[0].$match.type === "expense") return Promise.resolve([{ totalExpenses: 1200 }]);
            return Promise.resolve([]);
        });

        await getIncomeVsExpense(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            totalIncome: 3000,
            totalExpenses: 1200
        }));
    });

    test("Return zero income and expenses when no data is found", async () => {
        const req = { 
            user: { id: new mongoose.Types.ObjectId() }, 
            query: { startDate: "2024-04-01", endDate: "2024-04-30" }
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Transaction.aggregate.mockResolvedValueOnce([]).mockResolvedValueOnce([]);

        await getIncomeVsExpense(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ totalIncome: 0, totalExpenses: 0 });
    });
});
