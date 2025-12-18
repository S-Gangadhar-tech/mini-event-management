import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../../context/EventContext';
import { FaPenToSquare, FaTrashCan, FaLocationDot, FaCalendarDays } from 'react-icons/fa6';

const MyEventCard = ({ event }) => {
    const navigate = useNavigate();
    const { deleteEvent } = useEvents();

    const handleDelete = async () => {
        if (window.confirm("Permanent Action: Delete this event?")) {
            // This calls the context, which calls EventService.delete(event._id)
            await deleteEvent(event._id);
        }
    };

    return (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="relative h-40">
                <img src={event.ImageUrl} alt="" className="w-full h-full object-cover" />
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-bold text-lg mb-4">{event.title}</h3>

                {/* Action Buttons */}
                <div className="mt-auto flex gap-2">
                    <button
                        // Navigates to the Edit page, passing ID in URL
                        onClick={() => navigate(`/dashboard/edit/${event._id}`)}
                        className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all"
                    >
                        <FaPenToSquare size={14} /> Edit
                    </button>

                    <button
                        onClick={handleDelete}
                        className="flex-1 py-2 bg-red-50 text-red-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all"
                    >
                        <FaTrashCan size={14} /> Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MyEventCard;