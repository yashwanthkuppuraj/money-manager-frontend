import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, PieChart, Settings, User, LogOut, Wallet, Menu, X } from 'lucide-react';

const Sidebar = () => {
    const { user } = useAuth(); // Get user from context
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    const toggleSidebar = () => setIsOpen(!isOpen);

    const NavItem = ({ to, icon, label }) => (
        <Link
            to={to}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive(to)
                ? 'bg-[#FA8112]/10 text-[#FA8112] shadow-sm font-semibold'
                : 'text-[#222222]/60 hover:bg-[#F5E7C6]/50 hover:text-[#222222]'
                }`}
        >
            <div className={`p-2 rounded-lg transition-colors ${isActive(to) ? 'bg-[#FA8112] text-[#FAF3E1]' : 'bg-transparent group-hover:bg-[#F5E7C6]'}`}>
                {icon}
            </div>
            <span className="text-sm">{label}</span>
        </Link>
    );

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#FAF3E1] rounded-lg shadow-md text-[#222222]"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar Container */}
            <aside className={`
                fixed top-0 left-0 h-full w-64 glass border-r border-[#222222]/5 z-40 flex flex-col justify-between py-6 px-4
                transition-transform duration-300 ease-in-out lg:translate-x-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Logo */}
                <div className="flex items-center space-x-3 px-2 mb-10">
                    <div className="bg-[#FA8112] text-[#FAF3E1] p-2.5 rounded-xl shadow-lg">
                        <Wallet size={24} />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-[#222222]">Money<span className="text-[#FA8112]">M</span></span>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 space-y-2">
                    <NavItem to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
                    <NavItem to="/dashboard/budget-planner" icon={<Wallet size={20} />} label="Budget Planner" />
                    <NavItem to="/dashboard/analytics" icon={<PieChart size={20} />} label="Analytics" />
                    <NavItem to="/dashboard/settings" icon={<Settings size={20} />} label="Settings" />
                </nav>

                {/* Profile / Bottom Section */}
                <div className="pt-6 border-t border-[#222222]/10">
                    <div className="flex items-center space-x-3 p-3 bg-[#F5E7C6]/40 rounded-xl mb-4 border border-[#222222]/5">
                        <div className="w-10 h-10 rounded-full bg-[#FA8112] p-0.5">
                            <div className="w-full h-full rounded-full bg-[#FAF3E1] flex items-center justify-center">
                                <User size={20} className="text-[#222222]" />
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-[#222222] truncate">{user?.name || 'User'}</p>
                            <p className="text-xs text-[#222222]/60 truncate" title={user?.email}>{user?.email || 'Guest'}</p>
                        </div>
                    </div>
                    <Link
                        to="/"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </Link>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
