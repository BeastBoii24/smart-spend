const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors()); // Enable CORS for frontend
app.use(express.json()); // Parse JSON bodies

const DATA_DIR = path.join(__dirname, 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Read data from a JSON file
 * @param {string} filename - Name of the JSON file
 * @returns {Array} - Parsed data or empty array
 */
function readData(filename) {
    const filePath = path.join(DATA_DIR, filename);
    try {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, '[]');
            return [];
        }
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filename}:`, error);
        return [];
    }
}

/**
 * Write data to a JSON file
 * @param {string} filename - Name of the JSON file
 * @param {Array} data - Data to write
 */
function writeData(filename, data) {
    const filePath = path.join(DATA_DIR, filename);
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(`Error writing ${filename}:`, error);
    }
}

/**
 * Generate a unique ID
 * @returns {string} - Unique ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Get current month in YYYY-MM format
 * @returns {string} - Current month
 */
function getCurrentMonth() {
    return new Date().toISOString().slice(0, 7);
}

app.get('/api/health', (_req, res) => {
    res.json({
        success: true,
        message: 'SmartSpend backend is running',
        data: {
            port: PORT,
            timestamp: new Date().toISOString()
        }
    });
});

// ============================================
// AUTHENTICATION ROUTES
// ============================================

/**
 * POST /api/register
 * Register a new user
 */
app.post('/api/register', (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name, email, and password are required' 
            });
        }

        // Read existing users
        const users = readData('users.json');

        // Check if email already exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email already registered' 
            });
        }

        // Create new user
        const newUser = {
            id: generateId(),
            name,
            email,
            password, // Note: In production, hash this password!
            createdAt: new Date().toISOString()
        };

        // Save user
        users.push(newUser);
        writeData('users.json', users);

        // Return success (without password)
        res.status(201).json({
            success: true,
            message: 'Registration successful',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * POST /api/login
 * Login user with email and password
 */
app.post('/api/login', (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and password are required' 
            });
        }

        // Find user
        const users = readData('users.json');
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        // Return success
        res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * POST /api/logout
 * Logout user (just returns success, frontend clears localStorage)
 */
app.post('/api/logout', (req, res) => {
    res.json({ success: true, message: 'Logged out successfully' });
});

// ============================================
// DASHBOARD ROUTE
// ============================================

/**
 * GET /api/dashboard
 * Get dashboard statistics for a user
 */
app.get('/api/dashboard', (req, res) => {
    try {
        const userId = req.query.userId;

        if (!userId) {
            return res.status(400).json({ 
                success: false, 
                message: 'User ID required' 
            });
        }

        const transactions = readData('transactions.json')
            .filter(t => t.userId === userId);

        const currentMonth = getCurrentMonth();
        const monthlyTransactions = transactions.filter(t => t.date.startsWith(currentMonth));

        // Calculate statistics
        const monthlyIncome = monthlyTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const monthlyExpenses = monthlyTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalBalance = totalIncome - totalExpenses;
        
        const savingsRate = monthlyIncome > 0 
            ? Math.round(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100) 
            : 0;

        // Get recent transactions (last 5)
        const recentTransactions = [...transactions]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        res.json({
            success: true,
            data: {
                totalBalance,
                monthlyIncome,
                monthlyExpenses,
                savingsRate,
                recentTransactions
            }
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ============================================
// TRANSACTIONS ROUTES
// ============================================

/**
 * GET /api/transactions
 * Get all transactions for a user
 */
app.get('/api/transactions', (req, res) => {
    try {
        const userId = req.query.userId;

        if (!userId) {
            return res.status(400).json({ 
                success: false, 
                message: 'User ID required' 
            });
        }

        const transactions = readData('transactions.json')
            .filter(t => t.userId === userId)
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json({ success: true, data: transactions });
    } catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * POST /api/transactions
 * Add a new transaction
 */
app.post('/api/transactions', (req, res) => {
    try {
        const { userId, amount, type, category, note, date } = req.body;

        // Validate input
        if (!userId || !amount || !type || !category) {
            return res.status(400).json({ 
                success: false, 
                message: 'userId, amount, type, and category are required' 
            });
        }

        const transactions = readData('transactions.json');

        // Create new transaction
        const newTransaction = {
            id: generateId(),
            userId,
            amount: parseFloat(amount),
            type,
            category,
            note: note || '',
            date: date || new Date().toISOString().slice(0, 10)
        };

        transactions.push(newTransaction);
        writeData('transactions.json', transactions);

        res.status(201).json({
            success: true,
            message: 'Transaction added',
            data: newTransaction
        });
    } catch (error) {
        console.error('Add transaction error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * PUT /api/transactions/:id
 * Update a transaction
 */
app.put('/api/transactions/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { amount, type, category, note, date } = req.body;

        const transactions = readData('transactions.json');
        const index = transactions.findIndex(t => t.id === id);

        if (index === -1) {
            return res.status(404).json({ 
                success: false, 
                message: 'Transaction not found' 
            });
        }

        // Update transaction
        transactions[index] = {
            ...transactions[index],
            amount: amount !== undefined ? parseFloat(amount) : transactions[index].amount,
            type: type || transactions[index].type,
            category: category || transactions[index].category,
            note: note !== undefined ? note : transactions[index].note,
            date: date || transactions[index].date
        };

        writeData('transactions.json', transactions);

        res.json({
            success: true,
            message: 'Transaction updated',
            data: transactions[index]
        });
    } catch (error) {
        console.error('Update transaction error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * DELETE /api/transactions/:id
 * Delete a transaction
 */
app.delete('/api/transactions/:id', (req, res) => {
    try {
        const { id } = req.params;

        const transactions = readData('transactions.json');
        const index = transactions.findIndex(t => t.id === id);

        if (index === -1) {
            return res.status(404).json({ 
                success: false, 
                message: 'Transaction not found' 
            });
        }

        transactions.splice(index, 1);
        writeData('transactions.json', transactions);

        res.json({ success: true, message: 'Transaction deleted' });
    } catch (error) {
        console.error('Delete transaction error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ============================================
// BUDGET ROUTES
// ============================================

/**
 * GET /api/budgets
 * Get all budgets for a user
 */
app.get('/api/budgets', (req, res) => {
    try {
        const userId = req.query.userId;

        if (!userId) {
            return res.status(400).json({ 
                success: false, 
                message: 'User ID required' 
            });
        }

        const currentMonth = getCurrentMonth();
        const budgets = readData('budgets.json')
            .filter(b => b.userId === userId && b.month === currentMonth);

        // Calculate spent amount for each budget
        const transactions = readData('transactions.json')
            .filter(t => t.userId === userId && t.type === 'expense' && t.date.startsWith(currentMonth));

        const budgetsWithSpent = budgets.map(budget => {
            const spent = transactions
                .filter(t => t.category === budget.category)
                .reduce((sum, t) => sum + t.amount, 0);
            return { ...budget, spent };
        });

        res.json({ success: true, data: budgetsWithSpent });
    } catch (error) {
        console.error('Get budgets error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * POST /api/budgets
 * Set a budget for a category
 */
app.post('/api/budgets', (req, res) => {
    try {
        const { userId, category, limit } = req.body;

        if (!userId || !category || !limit) {
            return res.status(400).json({ 
                success: false, 
                message: 'userId, category, and limit are required' 
            });
        }

        const budgets = readData('budgets.json');
        const currentMonth = getCurrentMonth();

        // Check if budget exists for this category and month
        const existingIndex = budgets.findIndex(
            b => b.userId === userId && b.category === category && b.month === currentMonth
        );

        if (existingIndex >= 0) {
            // Update existing budget
            budgets[existingIndex].limit = parseFloat(limit);
        } else {
            // Create new budget
            budgets.push({
                id: generateId(),
                userId,
                category,
                limit: parseFloat(limit),
                month: currentMonth
            });
        }

        writeData('budgets.json', budgets);

        res.status(201).json({
            success: true,
            message: 'Budget set successfully'
        });
    } catch (error) {
        console.error('Set budget error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * DELETE /api/budgets/:category
 * Delete a budget by category
 */
app.delete('/api/budgets/:category', (req, res) => {
    try {
        const { category } = req.params;
        const userId = req.query.userId;

        if (!userId) {
            return res.status(400).json({ 
                success: false, 
                message: 'User ID required' 
            });
        }

        const currentMonth = getCurrentMonth();
        let budgets = readData('budgets.json');
        
        budgets = budgets.filter(
            b => !(b.userId === userId && b.category === category && b.month === currentMonth)
        );

        writeData('budgets.json', budgets);

        res.json({ success: true, message: 'Budget deleted' });
    } catch (error) {
        console.error('Delete budget error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ============================================
// GOALS ROUTES
// ============================================

/**
 * GET /api/goals
 * Get all goals for a user
 */
app.get('/api/goals', (req, res) => {
    try {
        const userId = req.query.userId;

        if (!userId) {
            return res.status(400).json({ 
                success: false, 
                message: 'User ID required' 
            });
        }

        const goals = readData('goals.json')
            .filter(g => g.userId === userId);

        res.json({ success: true, data: goals });
    } catch (error) {
        console.error('Get goals error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * POST /api/goals
 * Add a new goal
 */
app.post('/api/goals', (req, res) => {
    try {
        const { userId, name, targetAmount, currentAmount, targetDate } = req.body;

        if (!userId || !name || !targetAmount || !targetDate) {
            return res.status(400).json({ 
                success: false, 
                message: 'userId, name, targetAmount, and targetDate are required' 
            });
        }

        const goals = readData('goals.json');

        const newGoal = {
            id: generateId(),
            userId,
            name,
            targetAmount: parseFloat(targetAmount),
            currentAmount: parseFloat(currentAmount) || 0,
            targetDate,
            createdAt: new Date().toISOString()
        };

        goals.push(newGoal);
        writeData('goals.json', goals);

        res.status(201).json({
            success: true,
            message: 'Goal added',
            data: newGoal
        });
    } catch (error) {
        console.error('Add goal error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * PUT /api/goals/:id
 * Update a goal
 */
app.put('/api/goals/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { name, targetAmount, currentAmount, targetDate } = req.body;

        const goals = readData('goals.json');
        const index = goals.findIndex(g => g.id === id);

        if (index === -1) {
            return res.status(404).json({ 
                success: false, 
                message: 'Goal not found' 
            });
        }

        // Update goal
        goals[index] = {
            ...goals[index],
            name: name || goals[index].name,
            targetAmount: targetAmount !== undefined ? parseFloat(targetAmount) : goals[index].targetAmount,
            currentAmount: currentAmount !== undefined ? parseFloat(currentAmount) : goals[index].currentAmount,
            targetDate: targetDate || goals[index].targetDate
        };

        writeData('goals.json', goals);

        res.json({
            success: true,
            message: 'Goal updated',
            data: goals[index]
        });
    } catch (error) {
        console.error('Update goal error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * DELETE /api/goals/:id
 * Delete a goal
 */
app.delete('/api/goals/:id', (req, res) => {
    try {
        const { id } = req.params;

        const goals = readData('goals.json');
        const index = goals.findIndex(g => g.id === id);

        if (index === -1) {
            return res.status(404).json({ 
                success: false, 
                message: 'Goal not found' 
            });
        }

        goals.splice(index, 1);
        writeData('goals.json', goals);

        res.json({ success: true, message: 'Goal deleted' });
    } catch (error) {
        console.error('Delete goal error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ============================================
// EMI CALCULATOR ROUTE
// ============================================

/**
 * POST /api/emi
 * Calculate EMI for a loan
 */
app.post('/api/emi', (req, res) => {
    try {
        const { loanAmount, interestRate, tenure } = req.body;

        if (!loanAmount || !interestRate || !tenure) {
            return res.status(400).json({ 
                success: false, 
                message: 'loanAmount, interestRate, and tenure are required' 
            });
        }

        const principal = parseFloat(loanAmount);
        const rate = parseFloat(interestRate);
        const years = parseFloat(tenure);

        // Calculate EMI using formula
        const monthlyRate = rate / 12 / 100;
        const months = years * 12;
        
        const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / 
                    (Math.pow(1 + monthlyRate, months) - 1);
        
        const totalPayable = emi * months;
        const totalInterest = totalPayable - principal;

        res.json({
            success: true,
            data: {
                monthlyEMI: Math.round(emi),
                totalInterest: Math.round(totalInterest),
                totalPayable: Math.round(totalPayable)
            }
        });
    } catch (error) {
        console.error('EMI calculation error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ============================================
// REPORTS ROUTE
// ============================================

/**
 * GET /api/reports
 * Get financial reports for a user
 */
app.get('/api/reports', (req, res) => {
    try {
        const userId = req.query.userId;

        if (!userId) {
            return res.status(400).json({ 
                success: false, 
                message: 'User ID required' 
            });
        }

        const transactions = readData('transactions.json')
            .filter(t => t.userId === userId);

        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const netSavings = totalIncome - totalExpenses;

        // Category breakdown
        const categoryMap = {};
        transactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
            });

        const categoryBreakdown = Object.entries(categoryMap).map(([category, amount]) => ({
            category,
            amount,
            percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0
        }));

        res.json({
            success: true,
            data: {
                totalIncome,
                totalExpenses,
                netSavings,
                categoryBreakdown
            }
        });
    } catch (error) {
        console.error('Reports error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ============================================
// DATA BACKUP ROUTES
// ============================================

/**
 * GET /api/export
 * Export all user data as JSON
 */
app.get('/api/export', (req, res) => {
    try {
        const userId = req.query.userId;

        if (!userId) {
            return res.status(400).json({ 
                success: false, 
                message: 'User ID required' 
            });
        }

        const transactions = readData('transactions.json').filter(t => t.userId === userId);
        const budgets = readData('budgets.json').filter(b => b.userId === userId);
        const goals = readData('goals.json').filter(g => g.userId === userId);

        const exportData = {
            transactions,
            budgets,
            goals,
            exportedAt: new Date().toISOString()
        };

        res.json({
            success: true,
            data: exportData
        });
    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * POST /api/import
 * Import user data from JSON
 */
app.post('/api/import', (req, res) => {
    try {
        const { userId, data } = req.body;

        if (!userId || !data) {
            return res.status(400).json({ 
                success: false, 
                message: 'userId and data are required' 
            });
        }

        // Import transactions
        if (data.transactions) {
            let transactions = readData('transactions.json');
            transactions = transactions.filter(t => t.userId !== userId);
            const importedTransactions = data.transactions.map(t => ({ ...t, userId }));
            transactions.push(...importedTransactions);
            writeData('transactions.json', transactions);
        }

        // Import budgets
        if (data.budgets) {
            let budgets = readData('budgets.json');
            budgets = budgets.filter(b => b.userId !== userId);
            const importedBudgets = data.budgets.map(b => ({ ...b, userId }));
            budgets.push(...importedBudgets);
            writeData('budgets.json', budgets);
        }

        // Import goals
        if (data.goals) {
            let goals = readData('goals.json');
            goals = goals.filter(g => g.userId !== userId);
            const importedGoals = data.goals.map(g => ({ ...g, userId }));
            goals.push(...importedGoals);
            writeData('goals.json', goals);
        }

        res.json({ success: true, message: 'Data imported successfully' });
    } catch (error) {
        console.error('Import error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * DELETE /api/clear
 * Clear all user data
 */
app.delete('/api/clear', (req, res) => {
    try {
        const userId = req.query.userId;

        if (!userId) {
            return res.status(400).json({ 
                success: false, 
                message: 'User ID required' 
            });
        }

        // Clear transactions
        let transactions = readData('transactions.json');
        transactions = transactions.filter(t => t.userId !== userId);
        writeData('transactions.json', transactions);

        // Clear budgets
        let budgets = readData('budgets.json');
        budgets = budgets.filter(b => b.userId !== userId);
        writeData('budgets.json', budgets);

        // Clear goals
        let goals = readData('goals.json');
        goals = goals.filter(g => g.userId !== userId);
        writeData('goals.json', goals);

        res.json({ success: true, message: 'All data cleared' });
    } catch (error) {
        console.error('Clear data error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ============================================
// SERVER START
// ============================================

app.listen(PORT, () => {
    console.log('===========================================');
    console.log('   SmartSpend Backend Server');
    console.log('===========================================');
    console.log(`Server running on: http://localhost:${PORT}`);
    console.log('');
    console.log('Available endpoints:');
    console.log('  POST   /api/register');
    console.log('  POST   /api/login');
    console.log('  GET    /api/dashboard?userId=xxx');
    console.log('  GET    /api/transactions?userId=xxx');
    console.log('  POST   /api/transactions');
    console.log('  GET    /api/budgets?userId=xxx');
    console.log('  POST   /api/budgets');
    console.log('  GET    /api/goals?userId=xxx');
    console.log('  POST   /api/goals');
    console.log('  POST   /api/emi');
    console.log('  GET    /api/reports?userId=xxx');
    console.log('  GET    /api/export?userId=xxx');
    console.log('  POST   /api/import');
    console.log('  DELETE /api/clear?userId=xxx');
    console.log('===========================================');
});
