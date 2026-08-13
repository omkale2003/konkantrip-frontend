import { useState, useEffect } from 'react';
import api from '../api/axios';
import EditableSection from './EditableSection';

const PropertyFullDetailsView = ({ propertyId, onAction, hideActions }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Overview');

    const fetchData = () => {
        setLoading(true);
        api.get(`/admin/dashboard/properties/${propertyId}/fulldetails`)
            .then(res => setData(res.data.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchData();
    }, [propertyId]);

    if (loading) return <div className="p-8 text-center text-slate-500 animate-pulse bg-white border-t border-slate-100">Extracting entity tree ({propertyId})...</div>;
    if (!data) return <div className="p-8 text-center text-red-500">Failed to mount property records.</div>;

    const { property, location, rooms, policies, contacts, images, amenities, documents } = data;

    const tabs = [
        { name: 'Overview' },
        { name: 'Location' },
        { name: 'Contacts' },
        { name: 'Policies' },
        { name: 'Rooms', count: rooms?.length || 0 },
        { name: 'Amenities', count: amenities?.length || 0 },
        { name: 'Media', count: (images?.length || 0) + (documents?.length || 0) }
    ];

    return (
        <div className="bg-white border-t border-slate-100 cursor-default flex flex-col h-full min-h-[600px]" onClick={e => e.stopPropagation()}>

            {/* Header / Tabs */}
            <div className="px-6 pt-4 border-b border-slate-200 bg-slate-50 flex overflow-x-auto gap-4 scrollbar-hide">
                {tabs.map((tab) => (
                    <button
                        key={tab.name}
                        onClick={() => setActiveTab(tab.name)}
                        className={`flex items-center gap-2 pb-4 px-2 text-[13px] font-bold uppercase tracking-wider transition-colors border-b-2 whitespace-nowrap ${activeTab === tab.name
                                ? 'text-[#226a5b] border-[#226a5b]'
                                : 'text-slate-400 border-transparent hover:text-slate-600'
                            }`}
                    >
                        {tab.name}
                        {tab.count !== undefined && (
                            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === tab.name ? 'bg-[#226a5b] text-white' : 'bg-slate-200 text-slate-600'}`}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 overflow-y-auto bg-slate-50/30">
                {activeTab === 'Overview' && (
                    <div className="animate-fadeIn">
                        <EditableSection data={property} tableName="properties" primaryKeyField="property_id" onRefresh={fetchData} />
                    </div>
                )}

                {activeTab === 'Location' && (
                    <div className="animate-fadeIn">
                        <EditableSection data={location} tableName="property_locations" primaryKeyField="location_id" onRefresh={fetchData} />
                    </div>
                )}

                {activeTab === 'Contacts' && (
                    <div className="animate-fadeIn space-y-6">
                        {contacts && contacts.length > 0 ? contacts.map(c => (
                            <EditableSection key={c.contact_id} data={c} tableName="property_contacts" primaryKeyField="contact_id" onRefresh={fetchData} />
                        )) : <div className="p-8 text-center bg-white rounded-lg border border-slate-200 text-slate-400">No contacts mapped.</div>}
                    </div>
                )}

                {activeTab === 'Policies' && (
                    <div className="animate-fadeIn space-y-6">
                        {policies && policies.length > 0 ? policies.map(p => (
                            <EditableSection key={p.policy_id} data={p} tableName="property_policies" primaryKeyField="policy_id" onRefresh={fetchData} />
                        )) : <div className="p-8 text-center bg-white rounded-lg border border-slate-200 text-slate-400">No policy rules mapped.</div>}
                    </div>
                )}

                {activeTab === 'Rooms' && (
                    <div className="animate-fadeIn space-y-6">
                        <div className="text-[13px] text-slate-500 mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100 font-medium">To create new rooms, use the Master Data generic endpoints. This interface is for Deep Integrity Edits on existing nodes.</div>
                        {rooms && rooms.length > 0 ? rooms.map(r => (
                            <EditableSection key={r.room_id} data={r} tableName="rooms" primaryKeyField="room_id" onRefresh={fetchData} />
                        )) : <div className="p-8 text-center bg-white rounded-lg border border-slate-200 text-slate-400">No room inventory mapped.</div>}
                    </div>
                )}

                {activeTab === 'Amenities' && (
                    <div className="animate-fadeIn space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {amenities && amenities.length > 0 ? amenities.map(a => (
                                <EditableSection key={a.property_amenity_id} data={a} tableName="property_amenities" primaryKeyField={null} onRefresh={fetchData} />
                            )) : <div className="p-8 text-center bg-white rounded-lg border border-slate-200 text-slate-400 col-span-2">No amenities mapped.</div>}
                        </div>
                    </div>
                )}

                {activeTab === 'Media' && (
                    <div className="animate-fadeIn space-y-8">
                        <div>
                            <h4 className="font-bold text-[#226a5b] uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">Images Metadata ({images?.length || 0})</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {images?.map((img, idx) => (
                                    <EditableSection key={idx} data={img} tableName="property_images" primaryKeyField="img_id" onRefresh={fetchData} />
                                ))}
                                {images?.length === 0 && <span className="text-slate-400 italic text-[13px]">No records found.</span>}
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-[#226a5b] uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">Documents Vault ({documents?.length || 0})</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {documents?.map((doc, idx) => (
                                    <EditableSection key={idx} data={doc} tableName="property_documents" primaryKeyField="doc_id" onRefresh={fetchData} />
                                ))}
                                {documents?.length === 0 && <span className="text-slate-400 italic text-[13px]">No records found.</span>}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Global Actions Bar */}
            {!hideActions && (
                <div className="p-6 border-t border-slate-200 bg-white flex justify-end gap-3 shrink-0">
                    <button onClick={() => onAction(property.property_id, 'Rejected')} className="px-6 py-2.5 border border-slate-300 text-red-600 hover:bg-red-50 text-[13px] font-bold uppercase tracking-wider rounded-lg shadow-sm transition-colors cursor-pointer">Fail / Reject Property</button>
                    <button onClick={() => onAction(property.property_id, 'Approved')} className="px-6 py-2.5 bg-[#226a5b] hover:bg-[#1a5548] text-white text-[13px] font-bold uppercase tracking-wider rounded-lg shadow-sm transition-colors cursor-pointer">Verify & Approve Listing</button>
                </div>
            )}
        </div>
    );
};

export default PropertyFullDetailsView;
