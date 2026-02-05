import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children, isDashboard = false }) => {
    return (
        <div className="min-h-screen text-gray-900 font-sans flex font-inter">
            {isDashboard && <Sidebar />}

            <main className={`flex-1 transition-all duration-300 ${isDashboard ? 'lg:ml-64' : ''}`}>
                <div className={`w-full mx-auto px-4 sm:px-6 lg:px-6 py-6 ${isDashboard ? 'pt-20 lg:pt-6' : ''}`}>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
