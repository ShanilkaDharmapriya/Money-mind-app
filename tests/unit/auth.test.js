const request = require("supertest");
const { app } = require("../../src/index");
const User = require("../../src/models/User");
const bcrypt = require("bcryptjs");
jest.mock("../../src/models/User");
jest.mock("bcryptjs");

describe("Authentication Controller Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Register a new user", async () => {
        User.findOne.mockResolvedValue(null); 
        User.create.mockResolvedValue({ id: "user123", username: "TestUser", email: "test@example.com" });

        const response = await request(app).post("/api/auth/register").send({
            username: "TestUser",
            email: "test@example.com",
            password: "password123",
            preferredCurrency: "EUR"
        });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("User registered successfully");
    });

    test("Login with valid credentials", async () => {
        const hashedPassword = await bcrypt.hash("password123", 10);

        User.findOne.mockResolvedValue({
            id: "user123",
            email: "test@example.com",
            password: hashedPassword, 
            role: "user"
        });

        bcrypt.compare.mockResolvedValue(true); 

        const response = await request(app).post("/api/auth/login").send({
            email: "test@example.com",
            password: "password123"
        });

        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
    });

    test("Fail login with incorrect password", async () => {
        User.findOne.mockResolvedValue({
            id: "user123",
            email: "test@example.com",
            password: await bcrypt.hash("password123", 10),
            role: "user"
        });

        bcrypt.compare.mockResolvedValue(false); 

        const response = await request(app).post("/api/auth/login").send({
            email: "test@example.com",
            password: "wrongpassword"
        });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid credentials");
    });
});
