import { Router } from "express"; // Standard import
import {
    createUser,
    loginUser,
    logoutUser,
    getCurrentUser
} from "../controllers/auth.controller.js"; // Point to correct controller file
import { jwtAuthMiddleware } from "../auth/jwt.js";

const router = Router();

// Public Routes
router.post('/signup', createUser);
router.post('/login', loginUser); // Fixed: was logoutUser

// Protected Routes
router.post('/logout', jwtAuthMiddleware, logoutUser);

// THE MAGIC ROUTE: React calls this on page refresh (useEffect)
router.get('/me', jwtAuthMiddleware, getCurrentUser);

export default router;