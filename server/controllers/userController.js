import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// register user : POST /api/user/register
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // 2. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'User with this email already exists' });
        }

        // 3. Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Create new user
        const user = await User.create({ name, email, password: hashedPassword });

        // 5. Create JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // 6. Set the token in an HTTP-Only cookie
        res.cookie('token', token, {
            httpOnly: true, // Prevents client-side JS from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // 7. Send success response with user data (excluding password)
        return res.status(201).json({ success: true, user: { email: user.email, name: user.name } });

    } catch (error) {
        console.error("Register Error:", error.message);
        res.status(500).json({ success: false, message: "Server error during registration." });
    }
};

// Login User : POST /api/user/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validate input
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        // 2. Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            // Use a generic message to prevent leaking info about which emails are registered
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // 3. Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // 4. Create JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // 5. Set the token in an HTTP-Only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // 6. Send success response
        return res.status(200).json({ success: true, user: { email: user.email, name: user.name } });

    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ success: false, message: "Server error during login." });
    }
};

// Check Auth Status : GET /api/user/is-auth
export const isAuth = async (req, res) => {
    try {
        // CORRECT: Get the userId from the req object set by the authUser middleware
        const userId = req.userId;

        const user = await User.findById(userId).select("-password");

        // Best practice: Check if a user was actually found with that ID
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        return res.status(200).json({ success: true, user });

    } catch (error) {
        console.error("isAuth Error:", error.message);
        res.status(500).json({ success: false, message: "Server error during authentication check." });
    }
};

// Logout User : GET /api/user/logout
export const logout = async (req, res) => {
    try {
        // Clear the cookie. Options must match the ones used when setting the cookie.
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout Error:", error.message);
        res.status(500).json({ success: false, message: "Server error during logout." });
    }
};