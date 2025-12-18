import React from 'react';
import { NavLink } from 'react-router-dom';

const NavItem = ({ to, icon: Icon, children }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) => `
                flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${isActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}
            `}
        >
            {Icon && <Icon className="mr-2" size={18} />}
            {children}
        </NavLink>
    );
};

export default NavItem;