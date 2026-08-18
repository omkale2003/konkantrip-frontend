import React, { useState, useEffect } from 'react';

const DynamicFormModal = ({ isOpen, onClose, onSubmit, initialData, columns, title }) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (isOpen) {
            setFormData(initialData || {});
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-sm transition-opacity">
            <div className="bg-white w-full max-w-md h-full shadow-2xl animate-slideInRight flex flex-col border-l border-slate-200">
                <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center shrink-0">
                    <h2 className="text-[17px] font-extrabold text-slate-800 tracking-tight uppercase">{title}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-200 cursor-pointer">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {columns.filter(col => !col.primaryKey).map((col) => (
                        <div key={col.key}>
                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">{col.label}</label>
                            {col.type === 'boolean' ? (
                                <select
                                    className="w-full text-sm border-slate-300 rounded-lg p-2.5 focus:border-[var(--color-konkan-700)] focus:ring focus:ring-[var(--color-konkan-700)] focus:ring-opacity-20 shadow-sm transition-all"
                                    value={formData[col.key] === undefined ? (col.default || 0) : formData[col.key]}
                                    onChange={(e) => handleChange(col.key, Number(e.target.value))}
                                >
                                    <option value={1}>Yes / Active (1)</option>
                                    <option value={0}>No / Inactive (0)</option>
                                </select>
                            ) : (
                                <input
                                    autoFocus={col.autoFocus}
                                    type={col.type || 'text'}
                                    className="w-full text-sm border-slate-300 rounded-lg p-2.5 focus:border-[var(--color-konkan-700)] focus:ring focus:ring-[var(--color-konkan-700)] focus:ring-opacity-20 shadow-sm transition-all"
                                    value={formData[col.key] === null ? '' : formData[col.key]}
                                    onChange={(e) => handleChange(col.key, e.target.value)}
                                    placeholder={`Enter ${col.label.toLowerCase()}`}
                                    required={col.required !== false}
                                />
                            )}
                        </div>
                    ))}
                </form>

                <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 shrink-0">
                    <button type="button" onClick={onClose} className="px-5 py-2.5 text-[13px] font-bold uppercase tracking-wider text-slate-600 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg shadow-sm transition-colors cursor-pointer">Discard</button>
                    <button type="submit" className="px-5 py-2.5 text-[13px] font-bold uppercase tracking-wider bg-[var(--color-konkan-700)] hover:bg-konkan-800 text-white rounded-lg shadow-sm transition-colors cursor-pointer">Commit Record</button>
                </div>
            </div>
        </div>
    );
};

export default DynamicFormModal;
