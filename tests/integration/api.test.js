/*const request = require("supertest");
const { app } = require("../../src/index");
const mongoose = require("mongoose");

describe("Integration Testing - API Endpoints", () => {
    let authToken;

    beforeAll(async () => {
        await mongoose.connect(process.env.TEST_MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

        await request(app).post("/api/auth/register").send({
            username: "testuser",
            email: "testuser@example.com",
            password: "password123",
            preferredCurrency: "USD"
        });

        const loginRes = await request(app).post("/api/auth/login").send({
            email: "testuser@example.com",
            password: "password123"
        });

        authToken = loginRes.body.token;
    });

    afterAll(async () => {
        await mongoose.connection.close(); 
    });

    test("Create a new transaction", async () => {
        const res = await request(app)
            .post("/api/transactions")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                type: "income",
                category: "Salary",
                amount: 3000,
                currency: "USD",
                date: "2024-04-01",
                description: "April Salary"
            });

        expect(res.status).toBe(201);
        expect(res.body.amount).toBe(3000);
    });

    test("Get all transactions", async () => {
        const res = await request(app)
            .get("/api/transactions")
            .set("Authorization", `Bearer ${authToken}`);

        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    test("Create a new budget", async () => {
        const res = await request(app)
            .post("/api/budgets")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                category: "Food",
                amount: 500,
                startDate: "2024-04-01",
                endDate: "2024-04-30"
            });

        expect(res.status).toBe(201);
        expect(res.body.amount).toBe(500);
    });

    test("Get budget alerts", async () => {
        const res = await request(app)
            .get("/api/alerts/budget")
            .set("Authorization", `Bearer ${authToken}`);

        expect(res.status).toBe(200);
    });

    test("Get income vs expense report", async () => {
        const res = await request(app)
            .get("/api/reports/income-expense?startDate=2024-04-01&endDate=2024-04-30")
            .set("Authorization", `Bearer ${authToken}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("totalIncome");
        expect(res.body).toHaveProperty("totalExpenses");
    });
});*/
