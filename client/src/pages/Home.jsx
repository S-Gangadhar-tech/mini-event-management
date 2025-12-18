import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    FaCalendarCheck, FaUsers, FaShieldHalved,
    FaChartLine, FaBell, FaGear, FaArrowRight
} from 'react-icons/fa6';

const Home = () => {
    const { user } = useAuth();

    const features = [
        {
            id: 1,
            title: "Event Management",
            description: "As an authenticated user, you can create, edit, and delete your own community events.",
            icon: FaCalendarCheck,
            color: "text-blue-600",
            bg: "bg-blue-100"
        },
        {
            id: 2,
            title: "Community Interaction",
            description: "Join events created by others or leave them if your plans change.",
            icon: FaUsers,
            color: "text-green-600",
            bg: "bg-green-100"
        },
        {
            id: 3,
            title: "Secure Cookies",
            description: "Experience top-tier security with HTTP-only cookie-based authentication.",
            icon: FaShieldHalved,
            color: "text-purple-600",
            bg: "bg-purple-100"
        }
    ];

    return (
        <div className="space-y-16 py-10">
            {/* Hero Section */}
            <section className="text-center max-w-4xl mx-auto px-4">
                <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight sm:text-6xl">
                    Connect, Manage, and <span className="text-blue-600">Celebrate.</span>
                </h1>
                <p className="mt-6 text-xl text-gray-500 leading-8">
                    The most secure and intuitive platform for community event management.
                    Built with React, Tailwind, and industry-standard security.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    {user ? (
                        <Link to="/dashboard" className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center">
                            Go to Dashboard <FaArrowRight className="ml-2" />
                        </Link>
                    ) : (
                        <>
                            <Link to="/signup" className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
                                Get Started
                            </Link>
                            <Link to="/login" className="text-gray-900 font-bold hover:text-blue-600 transition-colors">
                                Sign In <span aria-hidden="true">→</span>
                            </Link>
                        </>
                    )}
                </div>
            </section>

            {/* Application Features / Capabilities */}
            <section>
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900">What you can perform</h2>
                    <p className="text-gray-500 mt-2">Explore the core features of the Evently ecosystem.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                    {features.map((feature) => (
                        <div key={feature.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className={`inline-flex items-center justify-center p-3 rounded-2xl ${feature.bg} ${feature.color} mb-5`}>
                                <feature.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Logged In User Insight */}
            {user && (
                <section className="bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white mx-4 overflow-hidden relative">
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div>
                            <span className="text-blue-400 font-bold text-sm tracking-widest uppercase">Member Profile</span>
                            <h2 className="text-3xl font-bold mt-2">Logged in as {user.name}</h2>
                            <p className="text-slate-400 mt-4 max-w-md">
                                You are currently authenticated via secure cookies. You have full access to create events and join community gatherings.
                            </p>
                        </div>
                        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 min-w-[280px]">
                            <div className="flex justify-between mb-4 border-b border-slate-700 pb-2">
                                <span className="text-slate-400 text-sm">Email</span>
                                <span className="text-sm font-medium">{user.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400 text-sm">Member Since</span>
                                <span className="text-sm font-medium">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Decorative Background Element */}
                    <div className="absolute -bottom-24 -right-24 h-64 w-64 bg-blue-600 rounded-full blur-[100px] opacity-20"></div>
                </section>
            )}
        </div>
    );
};

export default Home;