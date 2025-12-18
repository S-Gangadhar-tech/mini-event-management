import { useEffect } from 'react';
import { useEvents } from '../context/EventContext';
import MyEventCard from '../components/events/MyEventCard';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaFolderOpen } from 'react-icons/fa6';
import BackButton from '../components/events/BackButton';

const MyEvents = () => {
    const navigate = useNavigate();
    const { myEvents, loading, fetchMyEvents } = useEvents();

    useEffect(() => {
        fetchMyEvents();
    }, [fetchMyEvents]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back Button */}
            <BackButton />

            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                        <FaFolderOpen className="text-purple-600" />
                        My Managed Events
                    </h1>
                    <p className="text-gray-500 mt-1">Manage and track events created by you.</p>
                </div>
                <button
                    onClick={() => navigate('/dashboard/create')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-100"
                >
                    <FaPlus /> Create New
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[40vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
                </div>
            ) : myEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {myEvents.map((event) => (
                        <MyEventCard key={event._id} event={event} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 text-lg font-medium mb-4">You haven't created any events yet.</p>
                    <button
                        onClick={() => navigate('/dashboard/create')}
                        className="text-blue-600 font-bold hover:underline"
                    >
                        Click here to create your first event
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyEvents;