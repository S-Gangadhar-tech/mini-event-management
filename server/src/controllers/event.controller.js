import asyncHandler from "../utils/asyncHandler.js";
import Event from "../models/event.model.js";
import User from "../models/user.model.js";
import { ApiSuccess } from "../utils/apiresponse/ApiSuccess.js";
import { ApiError } from "../utils/apiresponse/ApiError.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js"; // Fixed typo 'coudinary' -> 'cloudinary'

// --- 1. Create Event ---
const createEvent = asyncHandler(async (req, res) => {
    // 1. Get User ID from JWT Middleware
    const userPayload = req.jwtDecodedPayload;
    if (!userPayload) {
        throw new ApiError({ statusCode: 401, message: "Unauthorized: User not identified" });
    }

    // 2. Get Data from Body
    const { title, description, location, capacity, eventDate, eventTime } = req.body;

    // 3. Validation
    if (!title || !description || !location || !eventDate || !eventTime) {
        throw new ApiError({ statusCode: 400, message: "All fields (title, description, location, date, time) are required" });
    }

    // 4. Handle Image Upload
    const localFilePath = req.file?.path;

    if (!localFilePath) {
        throw new ApiError({ statusCode: 400, message: "Event image is required" });
    }

    let cloudinaryResponse = null;
    try {
        cloudinaryResponse = await uploadOnCloudinary(localFilePath);

        if (!cloudinaryResponse) {
            throw new Error("Failed to upload image to Cloudinary");
        }
    } catch (error) {
        console.log("🔥 FULL CLOUDINARY ERROR:", error);
        throw new ApiError({ statusCode: 500, message: "Failed to upload image to Cloudinary" });
    }

    // 5. Create Event Object
    const newEvent = new Event({
        title,
        description,
        location,
        capacity: capacity || 100,
        ownerId: userPayload.id,
        ImageUrl: cloudinaryResponse.url,
        eventDate,
        eventTime
    });

    const savedEvent = await newEvent.save();

    // 6. Update User's 'createdEvents' array
    await User.findByIdAndUpdate(userPayload.id, {
        $push: { createdEvents: savedEvent._id }
    });

    res.status(201).json(new ApiSuccess({
        message: "Event created successfully",
        statusCode: 201,
        data: savedEvent
    }));
});

// --- 2. Get All Events ---
const getAllEvents = asyncHandler(async (req, res) => {
    const events = await Event.find().populate("ownerId", "name email");

    res.status(200).json(new ApiSuccess({
        message: "All events fetched successfully",
        statusCode: 200,
        data: events
    }));
});

// --- 3. Get Upcoming Events ---
const getUpcomingEvents = asyncHandler(async (req, res) => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0]; // "YYYY-MM-DD"
    const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`; // "HH:MM"

    // Find events that are EITHER in a future date OR today at a later time
    const events = await Event.find({
        $or: [
            { eventDate: { $gt: todayStr } },
            {
                eventDate: todayStr,
                eventTime: { $gt: currentTimeStr }
            }
        ]
    })
        .sort({ eventDate: 1, eventTime: 1 })
        .populate("ownerId", "name email");

    res.status(200).json(new ApiSuccess({
        message: "Upcoming events fetched successfully",
        statusCode: 200,
        data: events
    }));
});

// --- 4. Get Single Event ---
const getMyEvents = asyncHandler(async (req, res) => {
    // 1. Get the authenticated user's ID from the decoded JWT payload
    const userId = req.jwtDecodedPayload.id;

    // 2. Find events where the ownerId matches the current user
    // This is more efficient than fetching the user first and then their events
    const myEvents = await Event.find({ ownerId: userId })
        .populate("ownerId", "name email")
        .sort({ createdAt: -1 }); // Show newest first

    // 3. Optional: Check if the user has any events
    if (!myEvents || myEvents.length === 0) {
        return res.status(200).json(new ApiSuccess({
            message: "No events created by this user yet.",
            statusCode: 200,
            data: []
        }));
    }

    // 4. Send successful response
    res.status(200).json(new ApiSuccess({
        message: "Your events fetched successfully",
        statusCode: 200,
        data: myEvents
    }));
});

// --- 5. Update Event (Protected) ---
const updateEvent = asyncHandler(async (req, res) => {
    const { eventId } = req.params;
    const userId = req.jwtDecodedPayload.id;
    const updates = req.body;

    const event = await Event.findById(eventId);

    if (!event) {
        throw new ApiError({ statusCode: 404, message: "Event not found" });
    }

    // Ownership Check
    if (event.ownerId.toString() !== userId) {
        throw new ApiError({ statusCode: 403, message: "You are not authorized to update this event" });
    }

    // Image Cleanup Logic
    if (req.file) {
        const localFilePath = req.file.path;
        const cloudinaryResponse = await uploadOnCloudinary(localFilePath);

        if (cloudinaryResponse) {
            // Delete OLD image if exists
            if (event.ImageUrl) {
                await deleteFromCloudinary(event.ImageUrl);
            }
            updates.ImageUrl = cloudinaryResponse.url;
        }
    }

    const updatedEvent = await Event.findByIdAndUpdate(
        eventId,
        { $set: updates },
        { new: true }
    );

    res.status(200).json(new ApiSuccess({
        message: "Event updated successfully",
        statusCode: 200,
        data: updatedEvent
    }));
});

// --- 6. Delete Event (Protected) ---
const deleteEvent = asyncHandler(async (req, res) => {
    const { eventId } = req.params;
    const userId = req.jwtDecodedPayload.id;

    const event = await Event.findById(eventId);

    if (!event) {
        throw new ApiError({ statusCode: 404, message: "Event not found" });
    }

    // Ownership Check
    if (event.ownerId.toString() !== userId) {
        throw new ApiError({ statusCode: 403, message: "You are not authorized to delete this event" });
    }

    // Delete Image from Cloudinary
    if (event.ImageUrl) {
        await deleteFromCloudinary(event.ImageUrl);
    }

    // Remove event from User's 'createdEvents' list
    await User.findByIdAndUpdate(userId, {
        $pull: { createdEvents: eventId }
    });

    await Event.findByIdAndDelete(eventId);

    res.status(200).json(new ApiSuccess({
        message: "Event and associated image deleted successfully",
        statusCode: 200,
        data: {}
    }));
});



const joinEvent = asyncHandler(async (req, res) => {
    const { eventId } = req.params;
    const userId = req.jwtDecodedPayload.id;

    // 1. Basic Validation: Ensure user exists first
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError({
            statusCode: 404,
            message: "User account not found"
        });
    }

    // 2. ATOMIC UPDATE
    const result = await Event.updateOne(
        {
            _id: eventId,
            usersJoined: { $ne: userId }, // Condition A: User NOT already in array
            $expr: { $lt: [{ $size: "$usersJoined" }, "$capacity"] } // Condition B: Not Full
        },
        {
            $push: { usersJoined: userId }
        }
    );

    // 3. Check if the update actually happened
    if (result.modifiedCount === 0) {
        const event = await Event.findById(eventId);

        if (!event) {
            throw new ApiError({
                statusCode: 404,
                message: "Event not found"
            });
        }

        // Check if already joined
        const isJoined = event.usersJoined.some(id => id.toString() === userId);
        if (isJoined) {
            throw new ApiError({
                statusCode: 400,
                message: "You have already joined this event"
            });
        }

        // Check capacity
        if (event.usersJoined.length >= event.capacity) {
            throw new ApiError({
                statusCode: 400,
                message: "Event is full"
            });
        }

        // Fallback error
        throw new ApiError({
            statusCode: 500,
            message: "Join failed due to concurrency. Please try again."
        });
    }

    // 4. Fetch the updated event to return
    const updatedEvent = await Event.findById(eventId);

    res.status(200).json(new ApiSuccess({
        message: "Successfully joined the event",
        statusCode: 200,
        data: updatedEvent
    }));
});

const leaveEvent = asyncHandler(async (req, res) => {
    const { eventId } = req.params;
    const userId = req.jwtDecodedPayload.id;

    // ATOMIC UPDATE
    const result = await Event.updateOne(
        {
            _id: eventId,
            usersJoined: userId
        },
        {
            $pull: { usersJoined: userId }
        }
    );

    // Check if the update actually happened
    if (result.modifiedCount === 0) {
        const event = await Event.findById(eventId);

        if (!event) {
            throw new ApiError({
                statusCode: 404,
                message: "Event not found"
            });
        }

        // If event exists but count is 0, user wasn't in the list
        throw new ApiError({
            statusCode: 400,
            message: "You have not joined this event, so you cannot leave it."
        });
    }

    // Fetch updated event
    const updatedEvent = await Event.findById(eventId);

    res.status(200).json(new ApiSuccess({
        message: "Successfully left the event",
        statusCode: 200,
        data: updatedEvent
    }));
});

// --- 7. Get Single Event by ID ---
const getEventById = asyncHandler(async (req, res) => {
    const { eventId } = req.params;

    // Find the event and populate owner details
    const event = await Event.findById(eventId).populate("ownerId", "name email");

    if (!event) {
        throw new ApiError({
            statusCode: 404,
            message: "Event not found"
        });
    }

    res.status(200).json(new ApiSuccess({
        message: "Event details fetched successfully",
        statusCode: 200,
        data: event
    }));
});
export {
    createEvent,
    getAllEvents,
    getUpcomingEvents,
    getMyEvents,
    updateEvent,
    deleteEvent,
    leaveEvent,
    joinEvent,
    getEventById
};