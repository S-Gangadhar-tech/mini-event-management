import { Router } from "express";
import { jwtAuthMiddleware } from "../auth/jwt.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
    createEvent,
    getAllEvents,
    getMyEvents,
    updateEvent,
    deleteEvent,
    getUpcomingEvents,
    leaveEvent,
    joinEvent,
    getEventById
} from "../controllers/event.controller.js";

const router = Router();

router.post("/", jwtAuthMiddleware, upload.single("image"), createEvent);

router.get("/", jwtAuthMiddleware, getAllEvents);

router.get("/upcoming", jwtAuthMiddleware, getUpcomingEvents);

router.get("/my-events", jwtAuthMiddleware, getMyEvents);

router.get("/:eventId", jwtAuthMiddleware, getEventById);


router.put("/:eventId", jwtAuthMiddleware, upload.single("image"), updateEvent);

router.delete("/:eventId", jwtAuthMiddleware, deleteEvent);

// POST /api/events/:eventId/join
router.post("/:eventId/join", jwtAuthMiddleware, joinEvent);

// POST /api/events/:eventId/leave (Using POST is common for actions, or DELETE)
router.post("/:eventId/leave", jwtAuthMiddleware, leaveEvent);

export default router;