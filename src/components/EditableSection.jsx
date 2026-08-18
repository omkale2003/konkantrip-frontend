import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const EditableSection = ({ data, tableName, primaryKeyField, onRefresh }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (data && typeof data === 'object') {
            setFormData(data);
        }
    }, [data]);

    if (!data || Object.keys(data).length === 0) {
        return <div className="text-slate-500 italic p-4 bg-slate-50 rounded-lg text-sm">No data available in this section.</div>;
    }

    const uneditableKeys = [primaryKeyField, 'created_at', 'updated_at', 'deleted_at', 'password'];

    const handleSave = async () => {
        setIsSaving(true);
        setError('');
        try {
            const id = data[primaryKeyField];
            if (!id) throw new Error(`Primary Key "${primaryKeyField}" is missing on the data payload.`);

            await api.put(`/admin/crud/${tableName}/${id}`, formData);

            setIsEditing(false);
            if (onRefresh) onRefresh();
        } catch (err) {
            console.error('Failed to update', err);
            setError(err.response?.data?.message || 'Failed to save changes. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden mb-6">
            <div className="flex justify-between items-center bg-slate-50 border-b border-slate-200 px-6 py-4">
                <div>
                    <h3 className="font-bold text-slate-800 uppercase tracking-widest text-xs">Access: {tableName}</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Mapped PK: {primaryKeyField} | God-Mode Editor</p>
                </div>
                {tableName && primaryKeyField && (
                    <button
                        onClick={() => {
                            if (isEditing) setFormData(data); // Cancel
                            setIsEditing(!isEditing);
                        }}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors border ${isEditing
                            ? 'text-slate-600 border-slate-300 hover:bg-slate-100 bg-white'
                            : 'text-[var(--color-konkan-700)] border-[var(--color-konkan-700)] hover:bg-konkan-50 bg-white'
                            }`}
                    >
                        {isEditing ? 'Cancel Edit' : 'Enable Editing'}
                    </button>
                )}
            </div>

            {error && <div className="p-4 bg-red-50 text-red-600 text-sm font-medium border-b border-red-100">{error}</div>}

            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(data)
                        .filter(([key]) => {
                            if (key === primaryKeyField) return false;
                            const lowerKey = key.toLowerCase();
                            // Hide the literal 'id' or anything containing 'uuid' (like property_uuid)
                            if (lowerKey === 'id' || lowerKey.includes('uuid')) return false;
                            // Hide redundant parent relations from the deep-link editor
                            if (lowerKey === 'property_id' || lowerKey === 'p_owner_id' || lowerKey === 'owner_id') return false;
                            return true;
                        })
                        .map(([key, value]) => {
                            const isReadonly = uneditableKeys.includes(key);

                            return (
                                <div key={key} className="flex flex-col">
                                    <label className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-1.5 flex items-center gap-1.5">
                                        {key.replace(/_/g, ' ')}
                                        {isReadonly && <svg className="w-3 h-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
                                    </label>

                                    {isEditing && !isReadonly ? (
                                        typeof value === 'boolean' || value === 1 || value === 0 ? (
                                            <select
                                                value={formData[key] !== undefined ? formData[key] : (value || 0)}
                                                onChange={(e) => setFormData({ ...formData, [key]: Number(e.target.value) })}
                                                className="w-full text-sm border-slate-300 rounded-lg p-2.5 focus:border-[var(--color-konkan-700)] focus:ring focus:ring-[var(--color-konkan-700)] focus:ring-opacity-20 shadow-sm"
                                            >
                                                <option value={1}>True / Active (1)</option>
                                                <option value={0}>False / Inactive (0)</option>
                                            </select>
                                        ) : String(value).length > 80 ? (
                                            <textarea
                                                value={formData[key] === null ? '' : formData[key]}
                                                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                                                className="w-full text-sm border-slate-300 rounded-lg p-2.5 focus:border-[var(--color-konkan-700)] focus:ring focus:ring-[var(--color-konkan-700)] focus:ring-opacity-20 shadow-sm h-24 whitespace-pre-wrap"
                                            />
                                        ) : (
                                            <input
                                                type="text"
                                                value={formData[key] === null ? '' : formData[key]}
                                                onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                                                className="w-full text-sm border-slate-300 rounded-lg p-2.5 focus:border-[var(--color-konkan-700)] focus:ring focus:ring-[var(--color-konkan-700)] focus:ring-opacity-20 shadow-sm"
                                            />
                                        )
                                    ) : (
                                        <div className="text-sm bg-slate-50/50 p-2.5 rounded-lg border border-slate-100 text-slate-800 truncate" title={String(value)}>
                                            {value === null || value === '' ? (
                                                <span className="text-slate-400 italic">NULL</span>
                                            ) : typeof value === 'boolean' ? (
                                                <span className={`font-bold ${value ? 'text-green-600' : 'text-red-500'}`}>{value ? 'true' : 'false'}</span>
                                            ) : (
                                                String(value)
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                </div>

                {isEditing && (
                    <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100">
                        <button onClick={() => setIsEditing(false)} className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                            Discard
                        </button>
                        <button onClick={handleSave} disabled={isSaving} className="px-5 py-2.5 text-sm font-semibold text-white bg-[var(--color-konkan-700)] hover:bg-konkan-800 rounded-lg transition-colors flex items-center shadow-sm disabled:opacity-50">
                            {isSaving ? 'Processing Update...' : 'Commit Database Update'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditableSection;
