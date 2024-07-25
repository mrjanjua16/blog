import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyAdmin = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return next(errorHandler(401, 'Access token is missing'));
    }
    if (!req.user || !req.user.isAdmin) {
        return next(errorHandler(401, 'Only admin can access this'));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return next(errorHandler(401, 'Unauthorized Access'));
        }
        req.user = user;
        next();
    });
};