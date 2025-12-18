import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiresponse/ApiError.js"; // Ensure extensions are used

const generateToken = (userData) => {
    // Ensure you use an expiration time!
    return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '1d' });
}

const jwtAuthMiddleware = (req, res, next) => {

    // 1. Check Cookies first (Browser/React), then Header (Postman/Mobile)
    // Note: req.cookies requires 'cookie-parser' in app.js
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json(new ApiError({
            message: "Unauthorized request: No token found",
            statusCode: 401
        }));
    }

    // 2. Validate token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.jwtDecodedPayload = decoded;
        next();
    } catch (error) {
        console.log("JWT Error:", error.message);
        // Clear the invalid cookie so the client knows to logout
        res.clearCookie("accessToken");
        res.status(401).json(new ApiError({ message: "Invalid or expired token", statusCode: 401 }));
    }
}

export { generateToken, jwtAuthMiddleware };