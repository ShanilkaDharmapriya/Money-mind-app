const { createBudget } = require("../../src/controllers/budgetController");
const Budget = require("../../src/models/Budget");
jest.mock("../../src/models/Budget");

describe("Budget Controller Tests", () => {
    test("Create a new budget", async () => {
        const req = { user: { id: "user123" }, body: { category: "Food", amount: 500 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Budget.create.mockResolvedValue({ user: "user123", category: "Food", amount: 500 });

        await createBudget(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ category: "Food" }));
    });
});
