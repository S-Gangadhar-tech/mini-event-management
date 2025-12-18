import { useEffect } from 'react';
import { useEvents } from '../context/EventContext';
import EventCard from '../components/events/EventCard.jsx';
import { FaCalendarCheck, FaArrowLeft } from 'react-icons/fa6'; // Added FaArrowLeft
import BackButton from '../components/events/BackButton.jsx';

const AllEvents = () => {
    const { events, loading, fetchAllEvents } = useEvents();

    useEffect(() => {
        fetchAllEvents();
    }, [fetchAllEvents]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Unified Back Button Area */}
            <BackButton />

            {loading ? (
                /* Loading State */
                <div className="flex flex-col items-center justify-center min-h-[50vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-500 font-medium">Fetching live events...</p>
                </div>
            ) : (
                /* Data State */
                <>
                    {/* Header Section */}
                    <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                                <FaCalendarCheck className="text-blue-600" />
                                All Events Online
                            </h1>
                            <p className="text-gray-500 mt-1">Discover and join events happening in your community.</p>
                        </div>
                        <div className="bg-blue-50 px-4 py-2 rounded-full border border-blue-100 text-blue-700 text-sm font-bold w-fit">
                            {events.length} Events Available
                        </div>
                    </div>

                    {/* Grid Section */}
                    {events.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {events.map((event) => (
                                <EventCard key={event._id} event={event} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                            <p className="text-gray-400 text-lg font-medium">No events found at the moment.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AllEvents;