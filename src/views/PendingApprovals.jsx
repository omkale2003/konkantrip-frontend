import { useState, useEffect } from 'react';
import api from '../api/axios';
import { ImageIcon } from 'lucide-react';
import Loader from '../components/Loader';

import ReviewStep from '../features/properties/components/property-wizard/steps/ReviewStep.jsx';

export default function PendingApprovals() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedPropertyId, setExpandedPropertyId] = useState(null);
    const [rejectModal, setRejectModal] = useState({ open: false, propertyId: null, reason: '' });

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

    const handleApproval = async (propertyId, actionStatus, remarks = '') => {
        if (actionStatus === 'Approved' && !window.confirm(`Are you sure you want to review this as ${actionStatus}?`)) return;
        try {
            await api.put(`/admin/dashboard/properties/${propertyId}/approve`, { status: actionStatus, remarks });
            fetchPending();
            setExpandedPropertyId(null);
            if (actionStatus === 'Rejected') {
                setRejectModal({ open: false, propertyId: null, reason: '' });
            }
        } catch (err) {
            alert('Failed to update property status');
            console.error(err);
        }
    };

    if (loading) return <Loader message="Compiling approval queue..." />;

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h2 className="text-[var(--color-konkan-700)] text-[13px] font-semibold mb-1">Approval Queue</h2>
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
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 flex-1">
                                        <div className="w-24 h-24 sm:w-20 sm:h-20 shrink-0 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                                            {property.cover_image || property.cdn_url ? (
                                                <img src={property.cover_image || property.cdn_url} alt={property.property_name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                                                    <ImageIcon className="w-6 h-6 mb-1 opacity-50" />
                                                    <span className="text-[9px] font-semibold uppercase">No Image</span>
                                                </div>
                                            )}
                                        </div>
                                        <div>
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
                                    </div>

                                    <div className="flex items-center gap-4 text-[var(--color-konkan-700)] font-medium text-sm">
                                        {isExpanded ? 'Close Form' : 'Deep Integrity Scan'}
                                        <svg className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="p-6 bg-white border-t border-slate-100 mt-2 rounded-b-xl">
                                        <ReviewStep
                                            propertyId={property.property_id}
                                            basicDetails={property}
                                            isAdminView={true}
                                            onApprove={() => handleApproval(property.property_id, "Approved")}
                                            onReject={() => setRejectModal({ open: true, propertyId: property.property_id, reason: '' })}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {properties.length === 0 && (
                        <div className="p-16 text-center text-slate-500 text-[13px]">No properties pending review.</div>
                    )}
                </div>
            </div>

            {rejectModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Reject Property</h3>
                        <p className="text-sm text-slate-500 mb-4">Please provide a reason for rejecting this property listing. This will be sent to the owner.</p>
                        <textarea
                            value={rejectModal.reason}
                            onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
                            className="w-full h-32 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none"
                            placeholder="Enter detailed rejection reason..."
                        ></textarea>
                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={() => setRejectModal({ open: false, propertyId: null, reason: '' })} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">Cancel</button>
                            <button
                                onClick={() => handleApproval(rejectModal.propertyId, "Rejected", rejectModal.reason)}
                                disabled={!rejectModal.reason.trim()}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold disabled:opacity-50 transition-colors"
                            >Confirm Rejection</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
