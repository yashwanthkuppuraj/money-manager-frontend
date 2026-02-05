import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Save, Check, Settings as SettingsIcon } from 'lucide-react';
import axios from 'axios';

const Settings = () => {
    const { user, updateUserSettings } = useAuth();
    const [settings, setSettings] = useState({
        defaultTransactionType: 'expense',
        weekStartDay: 'Monday',
        confirmBeforeTransfer: true
    });
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user && user.settings) {
            setSettings(user.settings);
        } else {
            // Fallback if user object doesn't have settings immediately (though context should handle it)
            // We can fetch it or just wait. For now, let's rely on context or fetch.
            fetchSettings();
        }
    }, [user]);

    const fetchSettings = async () => {
        try {
            // We can assume the API call matches the context, but asking the API is safer for fresh data
            // However, to reuse context logic, we might just want to use what's in 'user'
            // Since 'updateUserSettings' will update the context, let's trust 'user.settings'
            // If 'user' is null, we do nothing.
            if (user && user.token) {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const res = await axios.get('http://localhost:5000/api/settings', config);
                setSettings(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch settings", error);
        }
    };

    const handleChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage('');
        try {
            await updateUserSettings(settings);
            setMessage('Settings saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Failed to save settings.');
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex items-center space-x-4 mb-8">
                <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                    <SettingsIcon className="text-[#FA8112]" size={28} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-[#222222]">Settings</h1>
                    <p className="text-[#222222]/60">Customize your Money Manager experience</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-[#222222]/5 overflow-hidden">
                <div className="p-8 space-y-8">
                    {/* Default Transaction Type */}
                    <section className="space-y-4">
                        <label className="block text-lg font-bold text-[#222222]">Default Transaction Type</label>
                        <p className="text-[#222222]/60 text-sm">Choose which tab opens by default when adding a transaction.</p>
                        <div className="flex gap-4">
                            {['income', 'expense', 'transfer'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => handleChange('defaultTransactionType', type)}
                                    className={`px-6 py-3 rounded-xl font-medium capitalize transition-all ${settings.defaultTransactionType === type
                                            ? 'bg-[#FA8112] text-[#FAF3E1] shadow-md'
                                            : 'bg-gray-50 text-[#222222]/60 hover:bg-gray-100'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </section>

                    <div className="h-px bg-gray-100"></div>

                    {/* Week Start Day */}
                    <section className="space-y-4">
                        <label className="block text-lg font-bold text-[#222222]">Week Start Day</label>
                        <p className="text-[#222222]/60 text-sm">Select the day your week starts for analytics calculations.</p>
                        <select
                            value={settings.weekStartDay}
                            onChange={(e) => handleChange('weekStartDay', e.target.value)}
                            className="w-full max-w-xs px-4 py-3 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#FA8112]/20 outline-none transition-all"
                        >
                            <option value="Monday">Monday</option>
                            <option value="Sunday">Sunday</option>
                        </select>
                    </section>

                    <div className="h-px bg-gray-100"></div>

                    {/* Transfer Confirmation */}
                    <section className="flex items-center justify-between">
                        <div>
                            <label className="block text-lg font-bold text-[#222222]">Transfer Confirmation</label>
                            <p className="text-[#222222]/60 text-sm">Show a confirmation popup before submitting transfers.</p>
                        </div>
                        <button
                            onClick={() => handleChange('confirmBeforeTransfer', !settings.confirmBeforeTransfer)}
                            className={`relative w-14 h-8 rounded-full transition-colors duration-200 ease-in-out ${settings.confirmBeforeTransfer ? 'bg-[#FA8112]' : 'bg-gray-200'
                                }`}
                        >
                            <span
                                className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-transform duration-200 ease-in-out shadow-sm ${settings.confirmBeforeTransfer ? 'translate-x-6' : 'translate-x-0'
                                    }`}
                            />
                        </button>
                    </section>
                </div>

                <div className="bg-gray-50 px-8 py-6 border-t border-gray-100 flex items-center justify-between">
                    {message && (
                        <div className="flex items-center text-green-600 font-medium">
                            <Check size={18} className="mr-2" />
                            {message}
                        </div>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="ml-auto px-8 py-3 bg-[#222222] text-[#FAF3E1] rounded-xl font-bold hover:bg-black transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
