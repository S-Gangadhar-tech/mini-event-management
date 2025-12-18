import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    FaPlus,
    FaCalendarDays,
    FaCalendarCheck,
    FaUserGear,
    FaArrowRight
} from 'react-icons/fa6';

const Dashboard = () => {
    const { user } = useAuth();

    const navCards = [
        {
            title: "Create New Event",
            description: "Launch a new gathering. Set your time, location, and description.",
            path: "/dashboard/create",
            icon: FaPlus,
            color: "bg-blue-600",
            shadow: "shadow-blue-100",
            btnText: "Start Creating"
        },
        {
            title: "Browse All Events",
            description: "Explore the full directory of events happening in your community.",
            path: "/dashboard/events",
            icon: FaCalendarDays,
            color: "bg-green-600",
            shadow: "shadow-green-100",
            btnText: "View All"
        },
        {
            title: "My Hosted Events",
            description: "Manage the events you've created. Edit details or track attendees.",
            path: "/dashboard/my-events",
            icon: FaUserGear,
            color: "bg-purple-600",
            shadow: "shadow-purple-100",
            btnText: "Manage Mine"
        },
        {
            title: "Upcoming Joinings",
            description: "Check the status of events you have joined as an attendee.",
            path: "/dashboard/upcoming",
            icon: FaCalendarCheck,
            color: "bg-orange-600",
            shadow: "shadow-orange-100",
            btnText: "Check Schedule"
        }
    ];

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto">
            {/* Header Section */}
            <header className="mb-10">
                <h1 className="text-3xl font-black text-gray-900 sm:text-4xl">
                    Control <span className="text-blue-600">Center</span>
                </h1>
                <p className="mt-2 text-gray-500 font-medium">
                    Welcome back, {user?.name}. Select a module to begin managing your event ecosystem.
                </p>
            </header>

            {/* Navigation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {navCards.map((card, index) => (
                    <Link
                        key={index}
                        to={card.path}
                        className="group bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col justify-between"
                    >
                        <div>
                            <div className={`w-14 h-14 rounded-2xl ${card.color} ${card.shadow} flex items-center justify-center text-white mb-6 group-hover:rotate-6 transition-transform`}>
                                <card.icon size={26} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">{card.title}</h2>
                            <p className="text-gray-500 leading-relaxed mb-8">
                                {card.description}
                            </p>
                        </div>

                        <div className="flex items-center text-sm font-bold text-blue-600 group-hover:translate-x-2 transition-transform">
                            {card.btnText} <FaArrowRight className="ml-2" />
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Stats / Session Footer */}
            <div className="mt-12 bg-gray-900 rounded-[2.5rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-sm font-bold">{user?.email}</p>
                        <p className="text-xs text-gray-400">Authenticated via Secure Cookie</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="text-center px-4 border-r border-gray-700">
                        <p className="text-xl font-bold">{user?.createdEvents?.length || 0}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">Events Created</p>
                    </div>
                    <div className="text-center px-4">
                        <p className="text-xl font-bold">Active</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">Status</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;