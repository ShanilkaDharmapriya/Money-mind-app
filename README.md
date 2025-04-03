
# Personal Finance Tracker API

This is a Node.js + Express backend for a personal finance tracker application. It allows users to manage transactions, budgets, savings goals, and view financial reports securely with JWT authentication.

---

##  Features

- ✅ JWT-based user authentication
- ✅ Create and manage income/expense transactions
- ✅ Monthly and category-wise budgets
- ✅ Savings goals with auto-save feature
- ✅ Currency conversion utility
- ✅ Reports: spending summary, income vs expense
- ✅ Role-based dashboard (User/Admin)
- ✅ Alerts for budget, goals, upcoming bills

---

##  Getting Started

###  1. Clone the Repository


  API Endpoints

	Postman Collection LINK- https://shanilka-3339.postman.co/workspace/shanilka-Workspace~2f378149-5046-49c1-b8c8-f6cf73723244/collection/33343276-c0c7d8cb-31af-4bbb-8b27-d60eb8ea0035?action=share&creator=33343276  



	 Authentication(POST)
		register-http://localhost:5000/api/auth/register
		login-http://localhost:5000/api/auth/login


	Transactions
		POST-http://localhost:5000/api/transactions
		GET-http://localhost:5000/api/transactions
		DELETE-http://localhost:5000/api/transactions/:id
		PUT-http://localhost:5000/api/transactions/:id
	
	Budget
		POST-http://localhost:5000/api/budgets
		GET-http://localhost:5000/api/budgets
		DELETE-http://localhost:5000/api/budgets/:id
		PUT-http://localhost:5000/api/budgets/:id
	

	Goals
		POST-http://localhost:5000/api/goals
		GET-http://localhost:5000/api/goals
		DELETE-http://localhost:5000/api/goals/:id
		PUT-http://localhost:5000/api/goals/:id
	
	Goals Progress
		GET-http://localhost:5000/api/goals/progress

	Reports
		(Spending)GET-http://localhost:5000/api/reports/spending?startDate&endDate&category
		(Income and outcome)GET-http://localhost:5000/api/reports/income-expense?startDate&endDate
		
	

	Alerts

		GET-http://localhost:5000/api/notifications/goal-alerts

		GET-http://localhost:5000/api/notifications/budget-alerts

	Currency Converter

		POST-http://localhost:5000/api/currencys/convert

	Dashboard

		GET-http://localhost:5000/api/dashboard


  Tech Stack
Backend: Node.js + Express

Database: MongoDB + Mongoose

Auth: JWT (JSON Web Tokens)

Testing: Jest + Supertest

Environment Config: dotenv


[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/xIbq4TFL)
	
	
