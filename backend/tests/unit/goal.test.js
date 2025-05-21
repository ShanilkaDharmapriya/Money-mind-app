const mongoose = require('mongoose');
const { createGoal } = require("../../src/controllers/goalController");
const Goal = require("../../src/models/Goal");
jest.mock("../../src/models/Goal");

describe("Goal Controller Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Create a new savings goal", async () => {
        const req = {
            user: { id: new mongoose.Types.ObjectId() },
            body: { title: "Buy a Car", targetAmount: 10000, autoSavePercentage: 10 }
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Goal.create.mockResolvedValue({
            user: req.user.id,
            title: "Buy a Car",
            targetAmount: 10000,
            autoSavePercentage: 10
        });

        await createGoal(req, res);

        expect(res.status).toHaveBeenCalledWith(201); 
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ title: "Buy a Car" }));
    });

    test("Fail to create goal due to missing required fields", async () => {
        const req = { user: { id: new mongoose.Types.ObjectId() }, body: {} }; 
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Goal.create.mockRejectedValue(new Error("Validation failed"));

        await createGoal(req, res);

        expect(res.status).toHaveBeenCalledWith(500); 
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Validation failed" }));
    });
});
