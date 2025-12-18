import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EventService from '../services/eventService';
import InfoCard from '../components/events/InfoCard';
import { FaArrowLeft, FaCalendarCheck } from 'react-icons/fa6';
import BackButton from '../components/events/BackButton';

const UpcomingEvents = () => {
    const navigate = useNavigate();
    const [upcoming, setUpcoming] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUpcoming = async () => {
            try {
                // Assuming you added getUpcoming: () => apiClient.get("/events/upcoming") to service
                const res = await EventService.getUpcoming();
                setUpcoming(res.data?.data || []);
            } catch (err) {
                console.error("Failed to fetch upcoming events");
            } finally {
                setLoading(false);
            }
        };
        fetchUpcoming();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back to Dashboard */}
            <BackButton />

            {/* Header */}
            <div className="mb-10">
                <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3 italic">
                    <FaCalendarCheck className="text-blue-600" />
                    Coming Soon
                </h1>
                <p className="text-gray-500 mt-2">Browse the schedule of events taking place in the future.</p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : upcoming.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {upcoming.map((event) => (
                        <InfoCard key={event._id} event={event} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-slate-100">
                    <p className="text-slate-400 font-medium text-lg">No future events scheduled yet.</p>
                </div>
            )}
        </div>
    );
};

export default UpcomingEvents;