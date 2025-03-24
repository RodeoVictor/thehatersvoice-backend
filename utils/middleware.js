const jwt = require('jsonwebtoken');
const User = require('./models/User'); 

//To be used later
const isAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Authentication token is missing' });
        } 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decoded.userId);
        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: 'Access denied. Admin rights required.' });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error('Error in isAdmin middleware:', error.message);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = {
    isAdmin,
};

