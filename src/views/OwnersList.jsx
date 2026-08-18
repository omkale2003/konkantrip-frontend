import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Loader from '../components/Loader';

const maskEmail = (email) => {
    if (!email) return '';
    const parts = email.split('@');
    if (parts.length !== 2) return email;
    const [name, domain] = parts;
    if (name.length <= 2) return `${name[0]}*@${domain}`;
    return `${name.substring(0, 2)}***@${domain}`; // Using *** instead of dynamic length for cleaner UI
};

const maskPhone = (phone) => {
    if (!phone) return '';
    const str = String(phone).trim();
    if (str.length <= 4) return str;
    return `+** ******${str.substring(str.length - 4)}`;
};

export default function OwnersList() {
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const debounceFn = setTimeout(() => {
            fetchOwners();
        }, 500);
        return () => clearTimeout(debounceFn);
    }, [searchQuery]);

    const fetchOwners = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/dashboard/owners', {
                params: { search: searchQuery }
            });
            setOwners(response.data.data);
        } catch (error) {
            console.error('Failed to fetch owners', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader message="Fetching registered hosts..." />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h2 className="text-[var(--color-konkan-700)] text-[13px] font-semibold mb-1">Host Management</h2>
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
                        <input
                            type="text"
                            placeholder="Search hosts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2.5 w-full max-w-sm border border-slate-300 rounded-lg text-[13px] text-slate-800 focus:outline-none focus:border-[var(--color-konkan-700)] focus:ring-1 focus:ring-[var(--color-konkan-700)]"
                        />
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
                                    <span>Email: {maskEmail(owner.email)}</span>
                                    <span className="text-slate-300">•</span>
                                    <span>Phone: {maskPhone(owner.phone)}</span>
                                </div>
                            </div>

                            <div className="flex-shrink-0 mt-4 md:mt-0">
                                <button
                                    onClick={() => navigate(`/admin/dashboard/owners/${owner.p_owner_id}/properties`)}
                                    className="inline-flex items-center gap-2 px-5 py-2 bg-white hover:bg-konkan-50 border border-slate-200 hover:border-[var(--color-konkan-700)]/30 text-[var(--color-konkan-700)] text-[13px] font-semibold rounded-lg shadow-sm transition-colors"
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
