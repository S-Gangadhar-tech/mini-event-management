import asyncHandler from "../utils/asyncHandler.js";
import { generateToken } from "../auth/jwt.js";
import User from "../models/user.model.js";
import { ApiSuccess } from "../utils/apiresponse/ApiSuccess.js";
import { ApiError } from "../utils/apiresponse/ApiError.js";

const cookieOptions = {
    httpOnly: true,
    // Vercel uses HTTPS by default, so secure must be true for sameSite: 'none'
    secure: true,
    // "none" is required if client and server are different Vercel URLs
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000
};

// --- Register User ---
const createUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError({ statusCode: 400, message: "User with this email already exists" });
    }

    const newUser = await User.create({ name, email, password });

    const payload = {
        id: newUser._id,
        username: newUser.name
    };

    const token = generateToken(payload);

    // Remove sensitive data
    const userResponse = newUser.toObject();
    delete userResponse.password;

    // Set Cookie and Send Response
    res
        .status(201)
        .cookie("accessToken", token, cookieOptions)
        .json(new ApiSuccess({
            message: "User registered successfully",
            statusCode: 201,
            data: userResponse
        }));
});

// --- Login User ---
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError({ statusCode: 400, message: "Please provide both email and password" });
    }

    const user = await User.findOne({ email });

    if (user && (await user.isPasswordCorrect(password))) {
        const payload = { id: user._id, username: user.name };
        const token = generateToken(payload);

        const userResponse = user.toObject();
        delete userResponse.password;

        res
            .status(200)
            .cookie("accessToken", token, cookieOptions)
            .json(new ApiSuccess({
                message: "Login successful",
                statusCode: 200,
                data: userResponse
            }));
    } else {
        throw new ApiError({ statusCode: 401, message: "Invalid email or password" });
    }
});

// --- Logout User ---
const logoutUser = asyncHandler(async (req, res) => {
    res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .json(new ApiSuccess({
            message: "Logged out successfully",
            statusCode: 200,
            data: {}
        }));
});

// --- Get Current User (For React Persistence) ---
const getCurrentUser = asyncHandler(async (req, res) => {
    // We get the ID from the middleware
    const userId = req.jwtDecodedPayload.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
        throw new ApiError({ statusCode: 404, message: "User not found" });
    }

    res.status(200).json(new ApiSuccess({
        message: "User fetched successfully",
        statusCode: 200,
        data: user
    }));
});

export { createUser, loginUser, logoutUser, getCurrentUser };