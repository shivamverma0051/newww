import jwt from 'jsonwebtoken';

const authUser = (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not Authorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // --- ✅ THE FIX ---
        // We set a single, consistent property for all controllers to use.
        req.userId = decoded.id; 

        next(); // Proceed to the next function (the controller)

    } catch (error) {
        // This catches invalid or expired tokens.
        return res.status(401).json({ success: false, message: 'Not Authorized: Invalid token' });
    }
};

export default authUser;