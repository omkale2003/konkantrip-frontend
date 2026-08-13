import { useState, useEffect } from 'react';
import api from '../api/axios';
import PropertyFullDetailsView from '../components/PropertyFullDetailsView';

export default function AllPropertiesList() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedPropertyId, setExpandedPropertyId] = useState(null);

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/dashboard/properties');
            setProperties(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch properties', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h2 className="text-[#226a5b] text-[13px] font-semibold mb-1">Platform Inventory</h2>
                    <h1 className="text-3xl font-bold text-slate-800">All Properties</h1>
                    <p className="text-sm text-slate-500 mt-1.5">View and manage all properties listed across the entire platform.</p>
                </div>
                <div>
                    <button onClick={fetchProperties} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 text-[13px] font-semibold transition-colors shadow-sm">
                        Refresh Database
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50/50 border-b border-slate-200 flex justify-between items-center">
                    <span className="text-[13px] text-slate-500 font-medium">Showing {properties.length} properties</span>
                </div>

                <div className="divide-y divide-slate-100 bg-slate-50/20">
                    {loading ? (
                        <div className="p-12 text-center text-slate-500 text-sm bg-white animate-pulse">Running data fetch...</div>
                    ) : properties.map((property) => {
                        const isExpanded = expandedPropertyId === property.property_id;

                        return (
                            <div key={property.property_id} className={`transition-colors flex flex-col ${isExpanded ? 'bg-slate-50/20' : 'hover:bg-slate-50/50'}`}>
                                <div className="p-6 cursor-pointer" onClick={() => setExpandedPropertyId(isExpanded ? null : property.property_id)}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-[17px] font-bold text-slate-800">{property.property_name}</h3>
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide border ${property.property_status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' :
                                                property.property_status === 'Pending' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                                                    property.property_status === 'Rejected' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                                                        'bg-slate-100 text-slate-600 border-slate-200'
                                                }`}>
                                                {property.property_status}
                                            </span>
                                        </div>
                                        <svg className={`w-5 h-5 text-slate-400 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </div>

                                    <div className="flex items-center gap-3 text-[13px] text-slate-500 font-medium">
                                        <span>Tracking ID #{property.property_id}</span>
                                        <span className="text-slate-300">•</span>
                                        <span>Type: {property.property_type || 'Unknown'}</span>
                                        <span className="text-slate-300">•</span>
                                        <span>Owner ID: #{property.p_owner_id}</span>
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

                    {!loading && properties.length === 0 && (
                        <div className="p-12 text-center text-slate-500 text-sm bg-white">No properties found in the directory.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
