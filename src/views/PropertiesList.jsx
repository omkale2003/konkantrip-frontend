import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

import PropertyFullDetailsView from '../components/PropertyFullDetailsView';
import Loader from '../components/Loader';

export default function PropertiesList() {
    const { ownerId } = useParams();
    const [properties, setProperties] = useState([]);
    const [owner, setOwner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedPropertyId, setExpandedPropertyId] = useState(null);

    useEffect(() => {
        fetchData();
    }, [ownerId]);

    const fetchData = async () => {
        try {
            const [propsRes, ownerRes] = await Promise.all([
                api.get(`/admin/dashboard/owners/${ownerId}/properties`),
                api.get(`/admin/dashboard/owners/${ownerId}`)
            ]);
            setProperties(propsRes.data.data);
            setOwner(ownerRes.data.data);
        } catch (error) {
            console.error('Failed to fetch', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader message="Fetching owner portfolio..." />;

    return (
        <div className="space-y-6">
            <div className="mb-2">
                <Link to="/admin/dashboard/owners" className="text-[13px] font-semibold text-[var(--color-konkan-700)] hover:underline flex items-center gap-1 w-max">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Owners
                </Link>
            </div>

            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h2 className="text-[var(--color-konkan-700)] text-[13px] font-semibold mb-1">Property Inventory</h2>
                    <h1 className="text-3xl font-bold text-slate-800">Owner #{ownerId} Portfolio</h1>
                    <p className="text-sm text-slate-500 mt-1.5">View properties mapped to this host and manage details.</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-start">
                {/* Left Column: Properties */}
                <div className="flex-1 w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 bg-slate-50/50 border-b border-slate-200 flex justify-between items-center">
                        <span className="text-[13px] text-slate-500 font-medium">{properties.length} properties deployed</span>
                    </div>

                    <div className="divide-y divide-slate-100 bg-slate-50/20">
                        {properties.map((property) => {
                            const isExpanded = expandedPropertyId === property.property_id;

                            return (
                                <div key={property.property_id} className={`transition-colors flex flex-col ${isExpanded ? 'bg-slate-50/20' : 'hover:bg-slate-50/50'}`}>
                                    <div className="p-6 cursor-pointer" onClick={() => setExpandedPropertyId(isExpanded ? null : property.property_id)}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-[17px] font-bold text-slate-800">{property.property_name}</h3>
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide border ${property.property_status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    property.property_status === 'Pending' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                                                        'bg-red-50 text-red-600 border-red-200'
                                                    }`}>
                                                    {property.property_status}
                                                </span>
                                            </div>
                                            <svg className={`w-5 h-5 text-slate-400 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        </div>

                                        <div className="flex items-center gap-3 text-[13px] text-slate-500 font-medium">
                                            <span>{property.property_type}</span>
                                            <span className="text-slate-300">•</span>
                                            <span>{property.property_category}</span>
                                            <span className="text-slate-300">•</span>
                                            <span>{property.total_rooms} Rooms</span>
                                        </div>
                                    </div>

                                    {/* Expanded Property Details */}
                                    {isExpanded && (
                                        <PropertyFullDetailsView
                                            propertyId={property.property_id}
                                            hideActions={true}
                                        />
                                    )}
                                </div>
                            );
                        })}

                        {properties.length === 0 && (
                            <div className="p-12 text-center text-slate-500 text-sm bg-white">No related properties found for this owner.</div>
                        )}
                    </div>
                </div>

                {/* Right Column: Host Profile */}
                <div className="w-full lg:w-[320px] shrink-0 bg-white rounded-xl border border-slate-200 shadow-sm sticky top-6">
                    <div className="p-6 border-b border-slate-100 flex flex-col items-center">
                        <div className="w-20 h-20 bg-konkan-50 text-[var(--color-konkan-700)] rounded-full flex items-center justify-center text-3xl font-bold mb-4 shadow-inner">
                            {owner?.first_name?.charAt(0)}{owner?.last_name?.charAt(0)}
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">{owner?.first_name} {owner?.last_name}</h3>
                        <span className="inline-flex px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[11px] font-bold uppercase tracking-wide mt-2">Verified Host</span>
                    </div>
                    <div className="p-6 space-y-5">
                        <div>
                            <span className="block text-[11px] font-bold text-slate-400 tracking-wide uppercase mb-1">Email Address</span>
                            <span className="text-[14px] font-medium text-slate-800 break-all">{owner?.email}</span>
                        </div>
                        <div>
                            <span className="block text-[11px] font-bold text-slate-400 tracking-wide uppercase mb-1">Phone Number</span>
                            <span className="text-[14px] font-medium text-slate-800">{owner?.phone || "N/A"}</span>
                        </div>
                        <div>
                            <span className="block text-[11px] font-bold text-slate-400 tracking-wide uppercase mb-1">Registered On</span>
                            <span className="text-[14px] font-medium text-slate-800">{new Date(owner?.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
