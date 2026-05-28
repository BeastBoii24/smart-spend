# SmartSpend API Documentation Guide

This document lists all available API endpoints, request schemas, validation parameters, and response profiles for the SmartSpend Node.js Express REST API service.

- **Base Service URL:** `http://localhost:3001/api`
- **Request Headers:**
  - `Content-Type: application/json`

---

## 1. Authentication Endpoints

### Register User
- **HTTP Method:** `POST`
- **Path:** `/register`
- **Payload Schema:**
  ```json
  {
    "name": "Rahul Sharma",
    "email": "rahul@gmail.com",
    "password": "securePassword123"
  }
  ```
- **Validations Enforced:**
  - `name` cannot be empty.
  - `email` must match a valid regex pattern.
  - `password` must be at least 6 characters.
- **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "user": {
      "id": "mo690zkre21kz01d4sk",
      "name": "Rahul Sharma",
      "email": "rahul@gmail.com"
    }
  }
  ```
- **Error Response (400 Bad Request):**
  ```json
  { "success": false, "message": "Email is already registered" }
  ```

### Login User
- **HTTP Method:** `POST`
- **Path:** `/login`
- **Payload Schema:**
  ```json
  {
    "email": "rahul@gmail.com",
    "password": "securePassword123"
  }
  ```
- **Security Action:** Compares password hash using `bcryptjs`. Automatically converts plain-text legacy passwords on the first successful login.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "user": {
      "id": "mo690zkre21kz01d4sk",
      "name": "Rahul Sharma",
      "email": "rahul@gmail.com"
    }
  }
  ```
- **Error Response (401 Unauthorized):**
  ```json
  { "success": false, "message": "Invalid email or password" }
  ```

### Logout User
- **HTTP Method:** `POST`
- **Path:** `/logout`
- **Success Response (200 OK):**
  ```json
  { "success": true, "message": "Logged out successfully" }
  ```

---

## 2. Transactions API

### Get Transaction List
- **HTTP Method:** `GET`
- **Path:** `/transactions`
- **Query Parameter:** `userId` (String, Required)
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "txn001",
        "userId": "demo123",
        "amount": 60000,
        "type": "income",
        "category": "Salary",
        "note": "Monthly paycheck",
        "date": "2026-05-01"
      }
    ]
  }
  ```

### Add Transaction
- **HTTP Method:** `POST`
- **Path:** `/transactions`
- **Payload Schema:**
  ```json
  {
    "userId": "demo123",
    "amount": 450,
    "type": "expense",
    "category": "Food",
    "note": "Family dinner",
    "date": "2026-05-04"
  }
  ```
- **Validations Enforced:**
  - `amount` must be a positive non-zero number.
  - `type` must be either "income" or "expense".
  - `category` cannot be empty.
- **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Transaction added successfully",
    "data": { ... }
  }
  ```

### Update Transaction
- **HTTP Method:** `PUT`
- **Path:** `/transactions/:id`
- **Payload Schema:** Supports partial updates.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Transaction updated successfully",
    "data": { ... }
  }
  ```

### Delete Transaction
- **HTTP Method:** `DELETE`
- **Path:** `/transactions/:id`
- **Success Response (200 OK):**
  ```json
  { "success": true, "message": "Transaction deleted successfully" }
  ```

---

## 3. Budgets API

### Get Budgets List
- **HTTP Method:** `GET`
- **Path:** `/budgets`
- **Query Parameter:** `userId` (Required)
- **Success Response (200 OK):** Lists budgets pre-calculated with exact spent amounts for the current month.

### Create/Update Budget
- **HTTP Method:** `POST`
- **Path:** `/budgets`
- **Payload Schema:**
  ```json
  {
    "userId": "demo123",
    "category": "Food",
    "limit": 8000
  }
  ```
- **Validations Enforced:** `limit` must be a positive number.
- **Success Response (200 OK):**
  ```json
  { "success": true, "message": "Budget configured successfully" }
  ```

### Delete Budget
- **HTTP Method:** `DELETE`
- **Path:** `/budgets/:category`
- **Query Parameter:** `userId` (Required)
- **Success Response (200 OK):**
  ```json
  { "success": true, "message": "Budget deleted successfully" }
  ```

---

## 4. Goals API

### Get Goals List
- **HTTP Method:** `GET`
- **Path:** `/goals`
- **Query Parameter:** `userId` (Required)

### Add Savings Goal
- **HTTP Method:** `POST`
- **Path:** `/goals`
- **Payload Schema:**
  ```json
  {
    "userId": "demo123",
    "name": "Emergency Fund",
    "targetAmount": 100000,
    "currentAmount": 25000,
    "targetDate": "2026-12-31"
  }
  ```
- **Validations Enforced:** `targetAmount` must be positive. `currentAmount` cannot be negative.
- **Success Response (201 Created):**
  ```json
  { "success": true, "message": "Goal configured successfully", "data": { ... } }
  ```

### Delete Savings Goal
- **HTTP Method:** `DELETE`
- **Path:** `/goals/:id`
- **Success Response (200 OK):**
  ```json
  { "success": true, "message": "Goal deleted successfully" }
  ```

---

## 5. Repayment & Utility Tools

### Calculate EMI Repayment
- **HTTP Method:** `POST`
- **Path:** `/emi`
- **Payload Schema:**
  ```json
  {
    "loanAmount": 500000,
    "interestRate": 8.5,
    "tenure": 5
  }
  ```
- **Validations Enforced:** All values must be positive.
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "monthlyEMI": 10258,
      "totalInterest": 115487,
      "totalPayable": 615487
    }
  }
  ```

---

## 6. Offline LEDGER Backup & Restore

### Export Ledger
- **HTTP Method:** `GET`
- **Path:** `/export`
- **Query Parameter:** `userId` (Required)
- **Success Response (200 OK):** Returns consolidated transaction, budget, and goal data payload.

### Import Backup File
- **HTTP Method:** `POST`
- **Path:** `/import`
- **Payload Schema:** Contains `userId` and `data` objects representing database records.
- **Success Response (200 OK):**
  ```json
  { "success": true, "message": "Backup restored successfully" }
  ```

### Wipe User Database
- **HTTP Method:** `DELETE`
- **Path:** `/clear`
- **Query Parameter:** `userId` (Required)
- **Success Response (200 OK):**
  ```json
  { "success": true, "message": "Personal database cleared successfully" }
  ```
