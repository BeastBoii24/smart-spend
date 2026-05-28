const { readData, writeData } = require('../database/db');

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getCurrentMonth() {
    return new Date().toISOString().slice(0, 7);
}

const financeController = {
    getDashboard: (req, res) => {
        try {
            const userId = req.query.userId;
            if (!userId) {
                return res.status(400).json({ success: false, message: 'User ID is required' });
            }

            const transactions = readData('transactions.json').filter(t => t.userId === userId);
            const currentMonth = getCurrentMonth();
            const monthlyTransactions = transactions.filter(t => t.date.startsWith(currentMonth));

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

            const recentTransactions = [...transactions]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 5);

            return res.status(200).json({
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
            console.error('Dashboard controller error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error fetching dashboard data' });
        }
    },

    getTransactions: (req, res) => {
        try {
            const userId = req.query.userId;
            if (!userId) {
                return res.status(400).json({ success: false, message: 'User ID is required' });
            }

            const transactions = readData('transactions.json')
                .filter(t => t.userId === userId)
                .sort((a, b) => new Date(b.date) - new Date(a.date));

            return res.status(200).json({ success: true, data: transactions });
        } catch (error) {
            console.error('Get transactions controller error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error fetching transactions' });
        }
    },

    addTransaction: (req, res) => {
        try {
            const { userId, amount, type, category, note, date } = req.body;
            const transactions = readData('transactions.json');

            const newTransaction = {
                id: generateId(),
                userId,
                amount: parseFloat(amount),
                type,
                category,
                note: note ? note.trim() : '',
                date: date || new Date().toISOString().slice(0, 10)
            };

            transactions.push(newTransaction);
            writeData('transactions.json', transactions);

            return res.status(201).json({
                success: true,
                message: 'Transaction added successfully',
                data: newTransaction
            });
        } catch (error) {
            console.error('Add transaction controller error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error adding transaction' });
        }
    },

    updateTransaction: (req, res) => {
        try {
            const { id } = req.params;
            const { amount, type, category, note, date } = req.body;

            const transactions = readData('transactions.json');
            const index = transactions.findIndex(t => t.id === id);

            if (index === -1) {
                return res.status(404).json({ success: false, message: 'Transaction not found' });
            }

            transactions[index] = {
                ...transactions[index],
                amount: amount !== undefined ? parseFloat(amount) : transactions[index].amount,
                type: type || transactions[index].type,
                category: category || transactions[index].category,
                note: note !== undefined ? note.trim() : transactions[index].note,
                date: date || transactions[index].date
            };

            writeData('transactions.json', transactions);

            return res.status(200).json({
                success: true,
                message: 'Transaction updated successfully',
                data: transactions[index]
            });
        } catch (error) {
            console.error('Update transaction controller error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error updating transaction' });
        }
    },

    deleteTransaction: (req, res) => {
        try {
            const { id } = req.params;
            const transactions = readData('transactions.json');
            const index = transactions.findIndex(t => t.id === id);

            if (index === -1) {
                return res.status(404).json({ success: false, message: 'Transaction not found' });
            }

            transactions.splice(index, 1);
            writeData('transactions.json', transactions);

            return res.status(200).json({ success: true, message: 'Transaction deleted successfully' });
        } catch (error) {
            console.error('Delete transaction controller error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error deleting transaction' });
        }
    },

    getBudgets: (req, res) => {
        try {
            const userId = req.query.userId;
            if (!userId) {
                return res.status(400).json({ success: false, message: 'User ID is required' });
            }

            const currentMonth = getCurrentMonth();
            const budgets = readData('budgets.json')
                .filter(b => b.userId === userId && b.month === currentMonth);

            const transactions = readData('transactions.json')
                .filter(t => t.userId === userId && t.type === 'expense' && t.date.startsWith(currentMonth));

            const budgetsWithSpent = budgets.map(budget => {
                const spent = transactions
                    .filter(t => t.category === budget.category)
                    .reduce((sum, t) => sum + t.amount, 0);
                return { ...budget, spent };
            });

            return res.status(200).json({ success: true, data: budgetsWithSpent });
        } catch (error) {
            console.error('Get budgets controller error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error fetching budgets' });
        }
    },

    setBudget: (req, res) => {
        try {
            const { userId, category, limit } = req.body;
            const budgets = readData('budgets.json');
            const currentMonth = getCurrentMonth();

            const existingIndex = budgets.findIndex(
                b => b.userId === userId && b.category === category && b.month === currentMonth
            );

            if (existingIndex >= 0) {
                budgets[existingIndex].limit = parseFloat(limit);
            } else {
                budgets.push({
                    id: generateId(),
                    userId,
                    category,
                    limit: parseFloat(limit),
                    month: currentMonth
                });
            }

            writeData('budgets.json', budgets);

            return res.status(200).json({
                success: true,
                message: 'Budget configured successfully'
            });
        } catch (error) {
            console.error('Set budget controller error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error setting budget' });
        }
    },

    deleteBudget: (req, res) => {
        try {
            const { category } = req.params;
            const userId = req.query.userId;

            if (!userId) {
                return res.status(400).json({ success: false, message: 'User ID is required' });
            }

            const currentMonth = getCurrentMonth();
            let budgets = readData('budgets.json');
            
            const initialLength = budgets.length;
            budgets = budgets.filter(
                b => !(b.userId === userId && b.category === category && b.month === currentMonth)
            );

            if (budgets.length === initialLength) {
                return res.status(404).json({ success: false, message: 'Budget category not found for current month' });
            }

            writeData('budgets.json', budgets);
            return res.status(200).json({ success: true, message: 'Budget deleted successfully' });
        } catch (error) {
            console.error('Delete budget controller error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error deleting budget' });
        }
    },

    getGoals: (req, res) => {
        try {
            const userId = req.query.userId;
            if (!userId) {
                return res.status(400).json({ success: false, message: 'User ID is required' });
            }

            const goals = readData('goals.json').filter(g => g.userId === userId);
            return res.status(200).json({ success: true, data: goals });
        } catch (error) {
            console.error('Get goals controller error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error fetching goals' });
        }
    },

    addGoal: (req, res) => {
        try {
            const { userId, name, targetAmount, currentAmount, targetDate } = req.body;
            const goals = readData('goals.json');

            const newGoal = {
                id: generateId(),
                userId,
                name: name.trim(),
                targetAmount: parseFloat(targetAmount),
                currentAmount: parseFloat(currentAmount) || 0,
                targetDate,
                createdAt: new Date().toISOString()
            };

            goals.push(newGoal);
            writeData('goals.json', goals);

            return res.status(201).json({
                success: true,
                message: 'Goal configured successfully',
                data: newGoal
            });
        } catch (error) {
            console.error('Add goal controller error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error adding goal' });
        }
    },

    updateGoal: (req, res) => {
        try {
            const { id } = req.params;
            const { name, targetAmount, currentAmount, targetDate } = req.body;

            const goals = readData('goals.json');
            const index = goals.findIndex(g => g.id === id);

            if (index === -1) {
                return res.status(404).json({ success: false, message: 'Goal not found' });
            }

            goals[index] = {
                ...goals[index],
                name: name ? name.trim() : goals[index].name,
                targetAmount: targetAmount !== undefined ? parseFloat(targetAmount) : goals[index].targetAmount,
                currentAmount: currentAmount !== undefined ? parseFloat(currentAmount) : goals[index].currentAmount,
                targetDate: targetDate || goals[index].targetDate
            };

            writeData('goals.json', goals);

            return res.status(200).json({
                success: true,
                message: 'Goal updated successfully',
                data: goals[index]
            });
        } catch (error) {
            console.error('Update goal controller error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error updating goal' });
        }
    },

    deleteGoal: (req, res) => {
        try {
            const { id } = req.params;
            const goals = readData('goals.json');
            const index = goals.findIndex(g => g.id === id);

            if (index === -1) {
                return res.status(404).json({ success: false, message: 'Goal not found' });
            }

            goals.splice(index, 1);
            writeData('goals.json', goals);

            return res.status(200).json({ success: true, message: 'Goal deleted successfully' });
        } catch (error) {
            console.error('Delete goal controller error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error deleting goal' });
        }
    },

    calculateEMI: (req, res) => {
        try {
            const { loanAmount, interestRate, tenure } = req.body;

            const principal = parseFloat(loanAmount);
            const rate = parseFloat(interestRate);
            const years = parseFloat(tenure);

            const monthlyRate = rate / 12 / 100;
            const months = years * 12;
            
            const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / 
                        (Math.pow(1 + monthlyRate, months) - 1);
            
            const totalPayable = emi * months;
            const totalInterest = totalPayable - principal;

            return res.status(200).json({
                success: true,
                data: {
                    monthlyEMI: Math.round(emi),
                    totalInterest: Math.round(totalInterest),
                    totalPayable: Math.round(totalPayable)
                }
            });
        } catch (error) {
            console.error('EMI calculation controller error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error calculating EMI' });
        }
    },

    getReports: (req, res) => {
        try {
            const userId = req.query.userId;
            if (!userId) {
                return res.status(400).json({ success: false, message: 'User ID is required' });
            }

            const transactions = readData('transactions.json').filter(t => t.userId === userId);

            const totalIncome = transactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);

            const totalExpenses = transactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);

            const netSavings = totalIncome - totalExpenses;

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

            return res.status(200).json({
                success: true,
                data: {
                    totalIncome,
                    totalExpenses,
                    netSavings,
                    categoryBreakdown
                }
            });
        } catch (error) {
            console.error('Reports controller error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error fetching financial report' });
        }
    },

    exportData: (req, res) => {
        try {
            const userId = req.query.userId;
            if (!userId) {
                return res.status(400).json({ success: false, message: 'User ID is required' });
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

            return res.status(200).json({
                success: true,
                data: exportData
            });
        } catch (error) {
            console.error('Export controller error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error during data export' });
        }
    },

    importData: (req, res) => {
        try {
            const { userId, data } = req.body;
            if (!userId || !data) {
                return res.status(400).json({ success: false, message: 'User ID and backup data are required' });
            }

            if (data.transactions) {
                let transactions = readData('transactions.json');
                transactions = transactions.filter(t => t.userId !== userId);
                const importedTransactions = data.transactions.map(t => ({ ...t, userId }));
                transactions.push(...importedTransactions);
                writeData('transactions.json', transactions);
            }

            if (data.budgets) {
                let budgets = readData('budgets.json');
                budgets = budgets.filter(b => b.userId !== userId);
                const importedBudgets = data.budgets.map(b => ({ ...b, userId }));
                budgets.push(...importedBudgets);
                writeData('budgets.json', budgets);
            }

            if (data.goals) {
                let goals = readData('goals.json');
                goals = goals.filter(g => g.userId !== userId);
                const importedGoals = data.goals.map(g => ({ ...g, userId }));
                goals.push(...importedGoals);
                writeData('goals.json', goals);
            }

            return res.status(200).json({ success: true, message: 'Backup restored successfully' });
        } catch (error) {
            console.error('Import controller error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error during backup restore' });
        }
    },

    clearData: (req, res) => {
        try {
            const userId = req.query.userId;
            if (!userId) {
                return res.status(400).json({ success: false, message: 'User ID is required' });
            }

            let transactions = readData('transactions.json').filter(t => t.userId !== userId);
            writeData('transactions.json', transactions);

            let budgets = readData('budgets.json').filter(b => b.userId !== userId);
            writeData('budgets.json', budgets);

            let goals = readData('goals.json').filter(g => g.userId !== userId);
            writeData('goals.json', goals);

            return res.status(200).json({ success: true, message: 'Personal database cleared successfully' });
        } catch (error) {
            console.error('Clear data controller error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error during data clearing' });
        }
    }
};

module.exports = financeController;
