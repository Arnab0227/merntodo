const jwt = require('jsonwebtoken');
const User = require('../db/users');
require('dotenv').config()

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; 
        if (!token) {
            return res.status(401).send('Access denied. No token provided.');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); 

        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(402).send('Invalid token.');
        }

        req.userId = decoded.userId;
        next(); 
    } catch (error) {
        res.status(403).send('Invalid token.');
    }
};

module.exports = authMiddleware;


   