import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NavItem from './NavItem';
import { FaCalendarDays, FaHouse, FaTableColumns, FaArrowRightFromBracket } from 'react-icons/fa6';
import { MdAccountCircle } from 'react-icons/md';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    {/* Brand / Logo */}
                    <Link to="/" className="flex items-center space-x-2 text-blue-600">
                        <FaCalendarDays size={24} />
                        <span className="font-bold text-xl tracking-tight text-gray-800">Evently</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-4 items-center">
                        <NavItem to="/" icon={FaHouse}>Home</NavItem>
                        {user && (
                            <NavItem to="/dashboard" icon={FaTableColumns}>Dashboard</NavItem>
                        )}
                    </nav>

                    {/* Auth Section */}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2 border-l pl-4 border-gray-300">
                                    <MdAccountCircle className="text-gray-400" size={26} />
                                    <div className="hidden sm:flex flex-col">
                                        <span className="text-xs text-gray-400">Welcome,</span>
                                        <span className="text-sm font-bold text-gray-700 leading-none">{user.name}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={logout}
                                    className="text-gray-400 hover:text-red-500 p-2 rounded-full transition-colors"
                                    title="Logout"
                                >
                                    <FaArrowRightFromBracket size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link to="/login" className="text-gray-600 px-4 py-2 hover:text-gray-900 text-sm font-medium">
                                    Login
                                </Link>
                                <Link to="/signup" className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium shadow-sm transition">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;