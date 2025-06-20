const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not defined');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if token is expired
        if (decoded.exp && Date.now() >= decoded.exp * 1000) {
            return res.status(401).json({ error: 'Token expired' });
        }

        const user = await User.findByPk(decoded.userId);

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        console.error('Auth middleware error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const adminAuth = async (req, res, next) => {
    try {
        await auth(req, res, () => {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Access denied. Admin only.' });
            }
            next();
        });
    } catch (error) {
        console.error('Admin auth middleware error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { auth, adminAuth }; 