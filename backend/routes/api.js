const express = require('express');
const router = express.Router();

// Controllers
const authController = require('../controllers/authController');
const financeController = require('../controllers/financeController');

// Middlewares
const {
    validateRegister,
    validateLogin,
    validateTransaction,
    validateBudget,
    validateGoal,
    validateEMI
} = require('../middleware/validate');

// Health Check
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'SmartSpend backend service is healthy',
        timestamp: new Date().toISOString()
    });
});

// Authentication Endpoints
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/logout', authController.logout);

// Financial Data Summary
router.get('/dashboard', financeController.getDashboard);
router.get('/reports', financeController.getReports);

// Transactions CRUD Endpoints
router.get('/transactions', financeController.getTransactions);
router.post('/transactions', validateTransaction, financeController.addTransaction);
router.put('/transactions/:id', validateTransaction, financeController.updateTransaction);
router.delete('/transactions/:id', financeController.deleteTransaction);

// Budget Constraints Endpoints
router.get('/budgets', financeController.getBudgets);
router.post('/budgets', validateBudget, financeController.setBudget);
router.delete('/budgets/:category', financeController.deleteBudget);

// Financial Goals Endpoints
router.get('/goals', financeController.getGoals);
router.post('/goals', validateGoal, financeController.addGoal);
router.put('/goals/:id', validateGoal, financeController.updateGoal);
router.delete('/goals/:id', financeController.deleteGoal);

// EMI Tool
router.post('/emi', validateEMI, financeController.calculateEMI);

// Backup Utilities
router.get('/export', financeController.exportData);
router.post('/import', financeController.importData);
router.delete('/clear', financeController.clearData);

module.exports = router;
