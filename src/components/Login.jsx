import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, Wallet } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(formData);
            navigate('/dashboard'); // Direct to dashboard on success
        } catch (err) {
            setError(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF3E1] p-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-[#F5E7C6]">
                <div className="text-center mb-8">
                    <div className="inline-flex bg-[#FA8112] text-[#FAF3E1] p-3 rounded-2xl shadow-lg mb-4">
                        <Wallet size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-[#222222]">Welcome Back</h1>
                    <p className="text-[#222222]/60">Login to manage your finances</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm font-medium text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-[#222222] mb-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-[#222222]/40" size={20} />
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#FA8112] focus:ring-2 focus:ring-[#FA8112]/20 transition-all"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#222222] mb-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-[#222222]/40" size={20} />
                            <input
                                type="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#FA8112] focus:ring-2 focus:ring-[#FA8112]/20 transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#FA8112] text-[#FAF3E1] py-3 rounded-xl font-bold hover:bg-[#e0720f] transition-all duration-200 shadow-md active:scale-95 flex items-center justify-center gap-2"
                    >
                        <LogIn size={20} /> Login
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-[#222222]/60">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-[#FA8112] font-bold hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
