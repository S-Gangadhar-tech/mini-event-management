import React, { createContext, useContext, useState, useCallback } from "react";
import EventService from "../services/eventService";
import { toast } from "react-toastify";

const EventContext = createContext();

export const EventProvider = ({ children }) => {
    const [events, setEvents] = useState([]);
    const [myEvents, setMyEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch all events
    const fetchAllEvents = useCallback(async () => {
        setLoading(true);
        try {
            const res = await EventService.getAll();
            // Matching your nested response: res.data.data
            setEvents(res.data?.data || []);
        } finally {
            setLoading(false);
        }
    }, []);

    // Create a new event
    const createEvent = async (formData) => {
        try {
            const res = await EventService.create(formData);
            toast.success("Event created successfully!");
            await fetchAllEvents(); // Refresh list
            return res.data?.data;
        } catch (error) {
            throw error;
        }
    };
    const fetchMyEvents = useCallback(async () => {
        setLoading(true);
        try {
            const res = await EventService.getMyEvents();
            // Matching your JSON structure: res.data.data
            setMyEvents(res.data?.data || []);
        } catch (error) {
            toast.error("Failed to load your events");
        } finally {
            setLoading(false);
        }
    }, []);
    // Join an event
    const joinEvent = async (eventId) => {
        try {
            await EventService.join(eventId);
            toast.success("Joined event!");
            await fetchAllEvents();
        } catch (error) {
            throw error;
        }
    };

    // Leave an event
    const leaveEvent = async (eventId) => {
        try {
            await EventService.leave(eventId);
            toast.info("Left event.");
            await fetchAllEvents();
        } catch (error) {
            throw error;
        }
    };

    // src/context/EventContext.jsx

    const deleteEvent = async (eventId) => {
        try {
            await EventService.delete(eventId);
            toast.warn("Event deleted.");

            // FIX: Update local state immediately so the card vanishes
            setEvents((prev) => prev.filter((e) => e._id !== eventId));
            setMyEvents((prev) => prev.filter((e) => e._id !== eventId));

        } catch (error) {
            toast.error("Failed to delete event");
            console.error(error);
        }
    };

    const getEventDetails = useCallback(async (eventId) => {
        setLoading(true);
        try {
            const res = await EventService.getById(eventId);
            return res.data?.data;
        } catch (error) {
            toast.error("Could not fetch event details");
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);


    const value = {
        events,
        myEvents,
        loading,
        fetchAllEvents,
        createEvent,
        joinEvent,
        leaveEvent,
        deleteEvent,
        fetchMyEvents,
        getEventDetails
    };

    return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};

export const useEvents = () => useContext(EventContext);