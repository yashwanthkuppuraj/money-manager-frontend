import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PieChart, Settings, User, LogOut, Wallet } from 'lucide-react';

const DashboardNavbar = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="glass sticky top-4 z-40 mx-4 sm:mx-6 lg:mx-8 rounded-2xl mb-8 px-4 py-3">
            <div className="flex justify-between items-center">

                {/* Brand */}
                <Link to="/dashboard" className="flex items-center space-x-2 text-gray-900 hover:opacity-80 transition-opacity">
                    <div className="bg-gradient-to-tr from-blue-600 to-purple-600 text-white p-2 rounded-lg shadow-lg">
                        <Wallet size={20} />
                    </div>
                    <span className="font-bold text-lg tracking-tight hidden sm:block">Money Manager</span>
                </Link>

                {/* Links (Desktop) */}
                <div className="hidden md:flex items-center space-x-1 bg-gray-100/50 p-1 rounded-xl">
                    <NavLink to="/dashboard" icon={<LayoutDashboard size={18} />} label="Overview" active={isActive('/dashboard')} />
                    <NavLink to="/dashboard/analytics" icon={<PieChart size={18} />} label="Analytics" active={isActive('/dashboard/analytics')} />
                    <NavLink to="/dashboard/settings" icon={<Settings size={18} />} label="Settings" active={isActive('/dashboard/settings')} />
                </div>

                {/* Profile */}
                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center space-x-2 focus:outline-none"
                    >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 p-0.5 shadow-md hover:shadow-lg transition-shadow">
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                <User size={20} className="text-gray-700" />
                            </div>
                        </div>
                        <div className="hidden sm:block text-left">
                            <p className="text-sm font-bold text-gray-900 leading-none">Alex Doe</p>
                            <p className="text-xs text-gray-500">Pro Member</p>
                        </div>
                    </button>

                    {/* Dropdown */}
                    {isProfileOpen && (
                        <div className="absolute right-0 top-12 w-48 bg-white/90 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 py-2 animate-in fade-in slide-in-from-top-2">
                            <div className="px-4 py-2 border-b border-gray-100">
                                <p className="text-sm font-medium text-gray-900">Signed in as</p>
                                <p className="text-xs text-gray-500 truncate">alex@example.com</p>
                            </div>
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                                <User size={16} /> <span>Profile</span>
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                                <Settings size={16} /> <span>Settings</span>
                            </button>
                            <div className="border-t border-gray-100 mt-1 pt-1">
                                <Link to="/" className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2">
                                    <LogOut size={16} /> <span>Sign Out</span>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

const NavLink = ({ to, icon, label, active }) => (
    <Link
        to={to}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${active
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
            }`}
    >
        {icon}
        <span>{label}</span>
    </Link>
);

export default DashboardNavbar;
