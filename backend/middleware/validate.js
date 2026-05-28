/**
 * Request Validation Middleware for SmartSpend
 */

function validateRegister(req, res, next) {
    const { name, email, password } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ success: false, message: 'Valid name is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }

    if (!password || password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    next();
}

function validateLogin(req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    next();
}

function validateTransaction(req, res, next) {
    const { userId, amount, type, category, date } = req.body;

    if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
        return res.status(400).json({ success: false, message: 'Amount must be a positive number' });
    }

    if (!['income', 'expense'].includes(type)) {
        return res.status(400).json({ success: false, message: 'Type must be either "income" or "expense"' });
    }

    if (!category || typeof category !== 'string' || category.trim().length === 0) {
        return res.status(400).json({ success: false, message: 'Category is required' });
    }

    next();
}

function validateBudget(req, res, next) {
    const { userId, category, limit } = req.body;

    if (!userId || !category) {
        return res.status(400).json({ success: false, message: 'User ID and category are required' });
    }

    const numericLimit = parseFloat(limit);
    if (isNaN(numericLimit) || numericLimit <= 0) {
        return res.status(400).json({ success: false, message: 'Limit must be a positive number' });
    }

    next();
}

function validateGoal(req, res, next) {
    const { userId, name, targetAmount, currentAmount, targetDate } = req.body;

    if (!userId || !name || !targetDate) {
        return res.status(400).json({ success: false, message: 'User ID, goal name, and target date are required' });
    }

    const numericTarget = parseFloat(targetAmount);
    if (isNaN(numericTarget) || numericTarget <= 0) {
        return res.status(400).json({ success: false, message: 'Target amount must be a positive number' });
    }

    if (currentAmount !== undefined) {
        const numericCurrent = parseFloat(currentAmount);
        if (isNaN(numericCurrent) || numericCurrent < 0) {
            return res.status(400).json({ success: false, message: 'Current saved amount cannot be negative' });
        }
    }

    next();
}

function validateEMI(req, res, next) {
    const { loanAmount, interestRate, tenure } = req.body;

    if (loanAmount === undefined || interestRate === undefined || tenure === undefined) {
        return res.status(400).json({ success: false, message: 'Loan amount, interest rate, and tenure are required' });
    }

    if (parseFloat(loanAmount) <= 0 || parseFloat(interestRate) <= 0 || parseFloat(tenure) <= 0) {
        return res.status(400).json({ success: false, message: 'All inputs must be positive numbers' });
    }

    next();
}

module.exports = {
    validateRegister,
    validateLogin,
    validateTransaction,
    validateBudget,
    validateGoal,
    validateEMI
};
