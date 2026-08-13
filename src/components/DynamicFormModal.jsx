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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {columns.filter(col => !col.primaryKey).map((col) => (
                        <div key={col.key}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{col.label}</label>
                            {col.type === 'boolean' ? (
                                <select
                                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    value={formData[col.key] === undefined ? (col.default || 0) : formData[col.key]}
                                    onChange={(e) => handleChange(col.key, Number(e.target.value))}
                                >
                                    <option value={1}>Yes / Active</option>
                                    <option value={0}>No / Inactive</option>
                                </select>
                            ) : (
                                <input
                                    autoFocus={col.autoFocus}
                                    type={col.type || 'text'}
                                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    value={formData[col.key] || ''}
                                    onChange={(e) => handleChange(col.key, e.target.value)}
                                    placeholder={`Enter ${col.label}`}
                                    required={col.required !== false}
                                />
                            )}
                        </div>
                    ))}

                    <div className="mt-6 flex justify-end space-x-3 pt-4 border-t border-gray-100">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-colors">Save Details</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DynamicFormModal;
