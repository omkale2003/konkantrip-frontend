import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function OwnersList() {
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOwners();
    }, []);

    const fetchOwners = async () => {
        try {
            const response = await api.get('/admin/dashboard/owners');
            setOwners(response.data.data);
        } catch (error) {
            console.error('Failed to fetch owners', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500 animate-pulse">Loading Owners...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h2 className="text-[#226a5b] text-[13px] font-semibold mb-1">Host Management</h2>
                    <h1 className="text-3xl font-bold text-slate-800">Property Owners</h1>
                    <p className="text-sm text-slate-500 mt-1.5">View and manage registered property hosts.</p>
                </div>
                <div>
                    <button
                        onClick={fetchOwners}
                        className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 text-[13px] font-semibold transition-colors"
                    >
                        Refresh List
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-200 bg-slate-50/30">
                    <div className="relative">
                        <input type="text" placeholder="Search hosts..." className="pl-10 pr-4 py-2.5 w-full max-w-sm border border-slate-300 rounded-lg text-[13px] text-slate-800 focus:outline-none focus:border-[#226a5b] focus:ring-1 focus:ring-[#226a5b]" />
                        <svg className="w-4 h-4 text-slate-400 absolute left-4 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                </div>
                <div className="p-4 bg-slate-50/50 border-b border-slate-200">
                    <span className="text-[13px] text-slate-500 font-medium">{owners.length} hosts found</span>
                </div>
                <div className="divide-y divide-slate-100">
                    {owners.map((owner) => (
                        <div key={owner.p_owner_id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#fcfdfc] transition-colors">
                            <div className="flex-1">
                                <h3 className="text-[16px] font-bold text-slate-800">{owner.first_name} {owner.last_name}</h3>
                                <div className="flex items-center gap-3 mt-2 text-[13px] text-slate-500 font-medium">
                                    <span>Email: {owner.email}</span>
                                    <span className="text-slate-300">•</span>
                                    <span>Phone: {owner.phone}</span>
                                </div>
                            </div>

                            <div className="flex-shrink-0 mt-4 md:mt-0">
                                <button
                                    onClick={() => navigate(`/admin/dashboard/owners/${owner.p_owner_id}/properties`)}
                                    className="inline-flex items-center gap-2 px-5 py-2 bg-white hover:bg-[#f0f9f6] border border-slate-200 hover:border-[#226a5b]/30 text-[#226a5b] text-[13px] font-semibold rounded-lg shadow-sm transition-colors"
                                >
                                    Manage Inventory
                                </button>
                            </div>
                        </div>
                    ))}
                    {owners.length === 0 && (
                        <div className="p-12 text-center text-slate-500 text-sm">No owners found.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
