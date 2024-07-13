import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password || username === '' || email === '' || password === '') {
        next(errorHandler(400, "All fields are required!"));
    }

    const hashedPw = bcrypt.hashSync(password, 10);

    const newUser = new User({
        username,
        email,
        password: hashedPw,
    });

    try {
        await newUser.save();
        res.json('Signup successful!');
    }
    catch (error) {
        next(error);
    }
};


export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password || email === '' || password === '') {
        return next(errorHandler(400, 'All fields are required!'));
    }

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(404, 'Invalid Credentials'));
        }
        const validPw = bcryptjs.compareSync(password, validUser.password);
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const { password: pass , ...rest} = validUser._doc; 
        res
            .status(200)
            .cookie('access token', token, {
                httpOnly: true,
            })
            .json(rest);
        
        if (!validPw) {
            next(errorHandler(400), "Invalid Credentials");
        }
    } catch (error) {
        next(error);
    }
};

export const google = async (req, res, next) => {
    const { name, email, googlePhotoUrl } = req.body; // Destructure name correctly
    try {
        const user = await User.findOne({ email });
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const { password, ...rest } = user._doc;
            res.status(200)
                .cookie('access_token', token, { httpOnly: true })
                .json(rest);
        } else {
            const generatedPw = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPw = bcryptjs.hashSync(generatedPw, 10);
            const newUser = new User({
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(36).slice(-4),
                email,
                password: hashedPw,
                profilePicture: googlePhotoUrl, // Make sure to use googlePhotoUrl here
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password, ...rest } = newUser._doc;
            res.status(200)
                .cookie('access_token', token, { httpOnly: true })
                .json(rest);
        }
    } catch (error) {
        next(error);
    }
};