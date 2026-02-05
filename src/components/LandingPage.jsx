import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PieChart, ShieldCheck, TrendingUp, Wallet } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="relative min-h-screen font-sans selection:bg-[#FA8112]/30">
            {/* Background Image & Overlay */}
            <div className="fixed inset-0 -z-10">
                <img
                    src="/landing-bg.jpg"
                    alt="Money Management Background"
                    className="w-full h-full object-cover"
                />
                {/* Overlay to ensure text readability - using theme cream color with opacity */}
                <div className="absolute inset-0 bg-[#FAF3E1]/90 backdrop-blur-[2px]"></div>
            </div>

            <div className="relative flex flex-col min-h-screen">
                {/* Navbar */}
                <nav className="max-w-7xl mx-auto w-full px-6 py-6 flex justify-between items-center glass m-6 rounded-2xl">
                    <div className="flex items-center space-x-2">
                        <div className="bg-[#FA8112] text-[#FAF3E1] p-2 rounded-xl shadow-lg">
                            <Wallet size={24} />
                        </div>
                        <span className="text-xl font-bold text-[#222222] tracking-tight">Money Manager</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link to="/login" className="text-[#222222] font-medium hover:text-[#FA8112] transition-colors">Login</Link>
                        <Link
                            to="/signup"
                            className="bg-[#FA8112] hover:bg-[#e0720f] text-[#FAF3E1] px-5 py-2.5 rounded-full font-medium transition-all hover:shadow-lg active:scale-95"
                        >
                            Sign Up
                        </Link>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="flex-1 flex flex-col justify-center items-center text-center px-4 py-20 lg:py-32 relative overflow-hidden">
                    {/* Abstract Background Blobs - Warm (Keep them for subtle effect on top of overlay) */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#F5E7C6] rounded-full blur-3xl opacity-50 -z-10 animate-pulse"></div>

                    <div className="max-w-3xl space-y-8">
                        <div className="inline-block px-4 py-1.5 bg-[#F5E7C6] text-[#222222] font-semibold text-sm rounded-full border border-[#FA8112]/20">
                            🚀 Smart Financial Management
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold text-[#222222] leading-tight tracking-tight">
                            Master your money <br />
                            <span className="text-[#FA8112]">
                                with confidence.
                            </span>
                        </h1>
                        <p className="text-xl text-[#222222]/80 max-w-2xl mx-auto leading-relaxed">
                            Track income, manage expenses, and gain insights into your spending habits.
                            Simple, secure, and entirely on your device.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <Link
                                to="/dashboard"
                                className="flex justify-center items-center w-full sm:w-auto px-8 py-4 bg-[#FA8112] hover:bg-[#e0720f] text-[#FAF3E1] text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                            >
                                Launch Dashboard <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="py-24 px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-900">Why choose Money Manager?</h2>
                            <p className="text-gray-500 mt-4">Everything you need to stay on top of your finances.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <FeatureCard
                                icon={<TrendingUp size={32} />}
                                title="Expense Tracking"
                                desc="Monitor your daily spending with ease. Categorize transactions and see where your money goes."
                                color="bg-[#FAF3E1] text-[#FA8112]"
                            />
                            <FeatureCard
                                icon={<PieChart size={32} />}
                                title="Visual Analytics"
                                desc="Get clear insights with intuitive charts and summaries. Weekly, monthly, and yearly views."
                                color="bg-[#FAF3E1] text-[#FA8112]"
                            />
                            <FeatureCard
                                icon={<ShieldCheck size={32} />}
                                title="100% Private"
                                desc="Your data stays on your device. No external servers, no tracking, just pure privacy."
                                color="bg-[#FAF3E1] text-[#FA8112]"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="glass border-t border-[#F5E7C6] py-12 px-6 mt-auto mx-4 mb-4 rounded-2xl">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                        <div className="mb-4 md:mb-0">
                            <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                                <Wallet size={20} className="text-[#FA8112]" />
                                <span className="font-bold text-[#222222]">Money Manager</span>
                            </div>
                            <p className="text-sm text-[#222222]/70">© 2026 Money Manager. All rights reserved.</p>
                        </div>
                        <div className="flex space-x-6 text-sm text-[#222222]/70 font-medium">
                            <a href="#" className="hover:text-[#FA8112] transition-colors">Privacy</a>
                            <a href="#" className="hover:text-[#FA8112] transition-colors">Terms</a>
                            <a href="#" className="hover:text-[#FA8112] transition-colors">Contact</a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc, color }) => (
    <div className="glass p-8 rounded-2xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        <div className={`p-4 ${color} rounded-2xl w-fit mb-6 shadow-sm`}>
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{desc}</p>
    </div>
);

export default LandingPage;
