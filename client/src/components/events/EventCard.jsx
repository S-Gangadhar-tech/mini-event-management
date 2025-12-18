import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEvents } from '../../context/EventContext';
import {
    FaLocationDot,
    FaUsers,
    FaCalendarDays,
    FaCheck,
    FaArrowRightFromBracket
} from 'react-icons/fa6';

const EventCard = ({ event }) => {
    const { user } = useAuth();
    const { joinEvent, leaveEvent } = useEvents();

    const isOwner = user?._id === event.ownerId?._id;
    const isJoined = event.usersJoined?.includes(user?._id);

    return (
        <div className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
            {/* Image Section */}
            <div className="relative h-52 overflow-hidden bg-gray-200">
                <img
                    src={event.ImageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>

                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-md z-10 ${event.status === 'Upcoming' ? 'bg-green-500' : 'bg-orange-500'
                    }`}>
                    {event.status}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 truncate mb-3">{event.title}</h3>

                <div className="space-y-3 mb-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <FaLocationDot className="text-blue-500" />
                        <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaCalendarDays className="text-blue-500" />
                        {new Date(event.eventDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2">
                        <FaUsers className="text-blue-500" />
                        {event.usersJoined?.length} / {event.capacity} Members
                    </div>
                </div>

                <div className="mt-auto border-t pt-4 flex items-center justify-between">
                    <div className="flex flex-col max-w-[35%]">
                        <span className="text-[10px] text-gray-400 uppercase font-bold">Organizer</span>
                        <span className="text-sm font-bold text-gray-700 truncate">{event.ownerId?.name || 'User'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        {isOwner ? (
                            /* State 1: Owner Badge */
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 italic">
                                My Event
                            </span>
                        ) : isJoined ? (
                            /* State 2: Member Badge AND Separate Leave Button */
                            <>
                                <span className="flex items-center gap-1 text-[11px] font-bold text-green-600 bg-green-50 px-3 py-2 rounded-xl border border-green-100">
                                    <FaCheck /> Member
                                </span>
                                <button
                                    onClick={() => leaveEvent(event._id)}
                                    title="Leave Event"
                                    className="p-2.5 text-red-500 bg-red-50 rounded-xl border border-red-100 hover:bg-red-500 hover:text-white transition-all duration-200 active:scale-90"
                                >
                                    <FaArrowRightFromBracket size={14} />
                                </button>
                            </>
                        ) : (
                            /* State 3: Join Button */
                            <button
                                onClick={() => joinEvent(event._id)}
                                className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition active:scale-95 shadow-lg shadow-blue-100"
                            >
                                Join Now
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventCard;