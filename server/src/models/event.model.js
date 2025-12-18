import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    capacity: { type: Number, required: true },

    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true // Good practice to require owner
    },

    ImageUrl: {
        type: String, // FIX: Remove quotes
        required: true
    },

    eventDate: { type: String, required: true },
    eventTime: { type: String, required: true },

    usersJoined: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for Status
eventSchema.virtual('status').get(function () {
    // Combine date and time for comparison
    // Note: Ensure eventDate is stored in "YYYY-MM-DD" format for this to work perfectly
    const start = new Date(`${this.eventDate}T${this.eventTime}:00`);
    const now = new Date();

    if (now < start) return "Upcoming";
    return "Started"; // Changed to capitalized for consistency
});

const Event = mongoose.model("Event", eventSchema);

export default Event;