import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password || username === '' || email === '' || password === '') {
        next(errorHandler(400, "All fields are required!"));
    }

    const existingEmail = await User.findOne({ email }); 
    if (existingEmail) {
        return next(errorHandler(400, "User exists, please sign in."))
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
        return next(errorHandler(400, "Username already exist, please use different."))
    }

    const hashedPw = bcryptjs.hashSync(password, 10);

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
            return next(errorHandler(404, 'User not found'));
        }
        const validPw = bcryptjs.compareSync(password, validUser.password);
        const token = jwt.sign({ id: validUser._id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET);
        const { password: pass , ...rest} = validUser._doc; 
        res
            .status(200)
            .cookie('access_token', token, {
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
    const { name, email, googlePhotoUrl } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
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
                profilePicture: googlePhotoUrl,
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET);
            const { password, ...rest } = newUser._doc;
            res.status(200)
                .cookie('access_token', token, { httpOnly: true })
                .json(rest);
        }
    } catch (error) {
        next(error);
    }
};

export const setAdmin = async (req, res, next) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (user.isAdmin) {
            return next(errorHandler(400, 'User is already an admin!'));
        }
        await User.findByIdAndUpdate(id, { isAdmin: true });
        res.status(200).json('Admin created successfully!');
    } catch (error) {
        next(error);
    }
};

export const unSetAdmin = async (req, res, next) => {
    const { id } = req.params;
    try {
        if (req.user.id === id) {
            return next(errorHandler(400, 'You cannot remove yourself as admin!'));
        }

        const user = await User.findById(id);
        if (!user.isAdmin) {
            return next(errorHandler(400, 'User is not an admin!'));
        }
        await User.findByIdAndUpdate(id, { isAdmin: false });
        res.status(200).json('Admin removed successfully!');
    } catch (error) {
        next(error);
    }
};