import { useState, useEffect } from 'react';
import api from '../api/axios';

import PropertyFullDetailsView from '../components/PropertyFullDetailsView';

export default function PendingApprovals() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedPropertyId, setExpandedPropertyId] = useState(null);

    useEffect(() => {
        fetchPending();
    }, []);

    const fetchPending = async () => {
        try {
            const response = await api.get('/admin/dashboard/properties/pending');
            setProperties(response.data.data);
        } catch (error) {
            console.error('Failed to fetch properties', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApproval = async (propertyId, actionStatus) => {
        if (!window.confirm(`Are you sure you want to review this as ${actionStatus}?`)) return;
        try {
            await api.put(`/admin/dashboard/properties/${propertyId}/approve`, { status: actionStatus });
            fetchPending();
            setExpandedPropertyId(null);
        } catch (err) {
            alert('Failed to update property status');
            console.error(err);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500 animate-pulse">Building Queue...</div>;

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h2 className="text-[#226a5b] text-[13px] font-semibold mb-1">Approval Queue</h2>
                    <h1 className="text-3xl font-bold text-slate-800">Pending Properties</h1>
                    <p className="text-sm text-slate-500 mt-1.5">Review property forms thoroughly against platform guidelines.</p>
                </div>
                <div>
                    <button onClick={fetchPending} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 text-[13px] font-semibold transition-colors shadow-sm">
                        Refresh Queue
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50/50 border-b border-slate-200">
                    <span className="text-[13px] font-medium text-slate-500">{properties.length} properties awaiting full review</span>
                </div>

                <div className="divide-y divide-slate-100">
                    {properties.map((property) => {
                        const isExpanded = expandedPropertyId === property.property_id;

                        return (
                            <div key={property.property_id} className={`transition-colors flex flex-col ${isExpanded ? 'bg-slate-50/20' : 'hover:bg-slate-50/50'}`}>
                                {/* Header (always visible) */}
                                <div
                                    className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer"
                                    onClick={() => setExpandedPropertyId(isExpanded ? null : property.property_id)}
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-[17px] font-bold text-slate-800">{property.property_name}</h3>
                                            <span className="inline-flex px-2 py-0.5 rounded bg-orange-50 text-orange-700 border border-orange-200 text-[10px] font-bold tracking-wide uppercase">Action Required</span>
                                        </div>

                                        <div className="flex items-center gap-3 mt-2 text-[13px] text-slate-500 font-medium">
                                            <span>Type: {property.property_type}</span>
                                            <span className="text-slate-300">•</span>
                                            <span>Category: {property.property_category}</span>
                                            <span className="text-slate-300">•</span>
                                            <span>Owner Tracking ID: #{property.p_owner_id}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-[#226a5b] font-medium text-sm">
                                        {isExpanded ? 'Close Form' : 'Deep Integrity Scan'}
                                        <svg className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <PropertyFullDetailsView
                                        propertyId={property.property_id}
                                        onAction={handleApproval}
                                        hideActions={false}
                                    />
                                )}
                            </div>
                        );
                    })}

                    {properties.length === 0 && (
                        <div className="p-16 text-center text-slate-500 text-[13px]">No properties pending review.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
