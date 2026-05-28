const bcrypt = require('bcryptjs');
const { readData, writeData } = require('../database/db');

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

const authController = {
    register: (req, res) => {
        try {
            const { name, email, password } = req.body;
            const users = readData('users.json');

            // Check if user exists
            const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
            if (existingUser) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Email is already registered' 
                });
            }

            // Secure Hashing
            const hashedPassword = bcrypt.hashSync(password, 10);

            const newUser = {
                id: generateId(),
                name: name.trim(),
                email: email.toLowerCase().trim(),
                password: hashedPassword,
                createdAt: new Date().toISOString()
            };

            users.push(newUser);
            writeData('users.json', users);

            return res.status(201).json({
                success: true,
                message: 'User registered successfully',
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email
                }
            });
        } catch (error) {
            console.error('Registration controller error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error during registration' });
        }
    },

    login: (req, res) => {
        try {
            const { email, password } = req.body;
            const users = readData('users.json');

            // Find user
            const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
            if (userIndex === -1) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Invalid email or password' 
                });
            }

            const user = users[userIndex];
            let isMatch = false;

            // Detect if password is standard bcrypt hash or plain-text
            const isHash = user.password.startsWith('$2a$') || user.password.startsWith('$2b$');
            if (isHash) {
                isMatch = bcrypt.compareSync(password, user.password);
            } else {
                // Fallback for legacy plain-text data: check and auto-upgrade to hash
                if (password === user.password) {
                    isMatch = true;
                    // Auto-migrate to secure hash
                    users[userIndex].password = bcrypt.hashSync(password, 10);
                    writeData('users.json', users);
                }
            }

            if (!isMatch) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Invalid email or password' 
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Login successful',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });
        } catch (error) {
            console.error('Login controller error:', error);
            return res.status(500).json({ success: false, message: 'Internal server error during login' });
        }
    },

    logout: (req, res) => {
        return res.status(200).json({ success: true, message: 'Logged out successfully' });
    }
};

module.exports = authController;
