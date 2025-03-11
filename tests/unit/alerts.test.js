const { checkBudget, getGoalAlerts, getUpcomingBills } = require("../../src/controllers/notificationController");
const Budget = require("../../src/models/Budget");
const Goal = require("../../src/models/Goal");
const Transaction = require("../../src/models/Transaction");

jest.mock("../../src/models/Budget");
jest.mock("../../src/models/Goal");
jest.mock("../../src/models/Transaction");

describe("Notification Controller Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Budget alert when spending exceeds 80%", async () => {
        const req = { user: { id: "user123" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Budget.find.mockResolvedValue([{ category: "Food", amount: 500 }]);
        Transaction.find.mockResolvedValue([{ category: "Food", amount: 450, type: "expense" }]);

        await checkBudget(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
            expect.objectContaining({ message: expect.stringContaining("You are nearing your budget") })
        ]));
    });

    test("No budget alert when spending is under 80%", async () => {
        const req = { user: { id: "user123" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Budget.find.mockResolvedValue([{ category: "Entertainment", amount: 1000 }]);
        Transaction.find.mockResolvedValue([{ category: "Entertainment", amount: 200, type: "expense" }]);

        await checkBudget(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "No budget alerts." });
    });

    test("Goal alert when progress reaches 80%", async () => {
        const req = { user: { id: "user123" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Goal.find.mockResolvedValue([{ title: "Buy a Car", targetAmount: 10000, currentAmount: 8500 }]);

        await getGoalAlerts(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
            expect.objectContaining({ message: expect.stringContaining("You are nearing your goal") })
        ]));
    });

    
});
