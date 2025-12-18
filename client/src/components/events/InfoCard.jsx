import React from 'react';
import { FaLocationDot, FaCalendarDays, FaUsers } from 'react-icons/fa6';

const InfoCard = ({ event }) => {
    return (
        <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm flex flex-col h-full">
            {/* Image Header with Status */}
            <div className="relative h-48 overflow-hidden bg-gray-200">
                <img
                    src={event.ImageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-600 text-white shadow-md">
                    {event.status}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-3 truncate">{event.title}</h3>

                <div className="space-y-3 text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-2">
                        <FaLocationDot className="text-blue-500" /> {event.location}
                    </div>
                    <div className="flex items-center gap-2">
                        <FaCalendarDays className="text-blue-500" />
                        {new Date(event.eventDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2">
                        <FaUsers className="text-blue-500" /> {event.usersJoined?.length} Attendees
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Host</span>
                        <span className="text-sm font-bold text-gray-700">{event.ownerId?.name || 'Community'}</span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">View Only</span>
                </div>
            </div>
        </div>
    );
};

export default InfoCard;