import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const authMiddleware = async (req, res, next) => {
    try {
        
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({
                 message: "Unauthorized - No token provided", 
                 success: false 
                });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({
                message: "Unauthorized - Invalid token",
                success: false
            });
        }

        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized - User not found",
                success: false
            });
        }

        req.user = user;

        next();

    } catch (error) {
            res.status(500).json({ 
                message: error.message, 
                success: false 
            });
    }
}
