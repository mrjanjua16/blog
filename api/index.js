import express from 'express';
import dotenv from 'dotenv'; dotenv.config(); 
import mongoose from 'mongoose';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';

mongoose
    .connect(process.env.MONGO)
    .then(
        () => {
            console.log("Mongodb is connected");
        }
    )
    .catch(
        (err) => {
            console.log(err);
        }
    );

const app = express();

app.use(express.json());
app.use(cookieParser());

app.listen(3000,()=>{
        console.log("Server is running on port 3000");
    }
);

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});