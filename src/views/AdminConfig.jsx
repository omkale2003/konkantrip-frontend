import { useState, useEffect } from 'react';
import api from '../api/axios';
import Loader from '../components/Loader';
import { Save, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminConfig() {
    const [configs, setConfigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        fetchConfigs();
    }, []);

    const fetchConfigs = async () => {
        try {
            const response = await api.get('/admin/dashboard/settings/configs');
            if (response.data && response.data.data) {
                // Parse config_value correctly if it's stored as JSON string
                const parsedConfigs = response.data.data.map(c => ({
                    ...c,
                    // Note: If backend sends it as parsed JSON from varchar, this handles it. 
                    // If it's stored as JSON column, axios auto parses it.
                    config_value: typeof c.config_value === 'string' ? c.config_value.replace(/^"|"$/g, '') : c.config_value
                }));
                setConfigs(parsedConfigs);
            }
        } catch (error) {
            console.error('Failed to fetch configs', error);
            setMessage({ text: 'Failed to load configurations.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleConfigChange = (key, newValue) => {
        setConfigs(prev => prev.map(c => c.config_key === key ? { ...c, config_value: newValue } : c));
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage({ text: '', type: '' });
        try {
            // Send back raw values, backend will stringify as needed
            await api.put('/admin/dashboard/settings/configs', { configs });
            setMessage({ text: 'Configurations updated successfully.', type: 'success' });
            setTimeout(() => setMessage({ text: '', type: '' }), 5000);
        } catch (error) {
            console.error('Failed to save configs', error);
            setMessage({ text: 'Failed to update configurations.', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Loader message="Loading configurations..." />;

    const imageConfigs = configs.filter(c => c.config_key.startsWith('property.image.'));
    const otherConfigs = configs.filter(c => !c.config_key.startsWith('property.image.'));

    return (
        <div className="space-y-6 pb-12">
            <div>
                <h2 className="text-[var(--color-konkan-700)] text-[13px] font-semibold mb-1">System Settings</h2>
                <h1 className="text-3xl font-bold text-slate-800">Global Configurations</h1>
                <p className="text-sm text-slate-500 mt-1.5">Manage system-wide parameters like image sizes, limits, and core paths.</p>
            </div>

            {message.text && (
                <div className={`p-4 rounded-lg flex items-center gap-3 text-sm font-semibold border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {message.text}
                </div>
            )}

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 max-w-4xl">
                <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-3">Property Image Settings</h3>

                <div className="space-y-6">
                    {imageConfigs.map((config) => (
                        <div key={config.config_id} className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6 items-center">
                            <div className="md:col-span-1">
                                <label className="block text-[13px] font-bold text-slate-700">{config.config_key}</label>
                                <p className="text-[11px] text-slate-500 mt-0.5">{config.description}</p>
                            </div>
                            <div className="md:col-span-2">
                                <input
                                    type="text"
                                    value={config.config_value || ''}
                                    onChange={(e) => handleConfigChange(config.config_key, e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                                />
                            </div>
                        </div>
                    ))}

                    {imageConfigs.length === 0 && (
                        <p className="text-sm text-slate-500 italic">No image configurations found.</p>
                    )}
                </div>

                {otherConfigs.length > 0 && (
                    <>
                        <h3 className="text-lg font-bold text-slate-800 mt-10 mb-6 border-b border-slate-100 pb-3">Other Settings</h3>
                        <div className="space-y-6">
                            {otherConfigs.map((config) => (
                                <div key={config.config_id} className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6 items-center">
                                    <div className="md:col-span-1">
                                        <label className="block text-[13px] font-bold text-slate-700">{config.config_key}</label>
                                        <p className="text-[11px] text-slate-500 mt-0.5">{config.description}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <input
                                            type="text"
                                            value={config.config_value || ''}
                                            onChange={(e) => handleConfigChange(config.config_key, e.target.value)}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 bg-[var(--color-konkan-700)] hover:bg-konkan-800 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </div>
        </div>
    );
}
