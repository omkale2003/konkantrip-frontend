import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DynamicFormModal from './DynamicFormModal';

// Note: Replace with your environment config or axios instance
const API_BASE_URL = 'http://localhost:3000/api/v1/admin/crud';

const DynamicDataTable = ({ tableName, columns, title, primaryKeyField }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);

    // Get Auth token securely based on your existing structure
    const getAuthHeaders = () => {
        // Assuming admin token is saved in localStorage or cookie, adapt as needed
        const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken') || '';
        return { Authorization: `Bearer ${token}` };
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/${tableName}?page=${page}&limit=10`, {
                headers: getAuthHeaders(),
                withCredentials: true // Based on typical CORS setup
            });
            setData(response.data.data || []);
            setTotalPages(response.data.pagination?.totalPages || 1);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch data:', err);
            setError(err.response?.data?.message || 'Failed to connect to backend.');
            setData([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (tableName) {
            fetchData();
        }
    }, [tableName, page]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;
        try {
            await axios.delete(`${API_BASE_URL}/${tableName}/${id}`, { headers: getAuthHeaders(), withCredentials: true });
            fetchData(); // refresh list
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete record.");
        }
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (editingRecord) {
                // Update
                const id = editingRecord[primaryKeyField];
                await axios.put(`${API_BASE_URL}/${tableName}/${id}`, formData, { headers: getAuthHeaders(), withCredentials: true });
            } else {
                // Create
                await axios.post(`${API_BASE_URL}/${tableName}`, formData, { headers: getAuthHeaders(), withCredentials: true });
            }
            setIsModalOpen(false);
            setEditingRecord(null);
            fetchData(); // refresh list
        } catch (err) {
            alert(err.response?.data?.message || "Failed to save record.");
        }
    };

    const openCreateModal = () => {
        setEditingRecord(null);
        setIsModalOpen(true);
    };

    const openEditModal = (record) => {
        setEditingRecord(record);
        setIsModalOpen(true);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage configuration for {tableName}</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    <span>Add New</span>
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-50 text-red-600 border-b border-red-100">
                    <p className="flex items-center"><svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg> {error}</p>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                            {columns.map(col => (
                                <th key={col.key} className="px-6 py-4 font-semibold">{col.label}</th>
                            ))}
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700 text-sm">
                        {loading ? (
                            <tr><td colSpan={columns.length + 1} className="px-6 py-8 text-center text-gray-400">Loading data...</td></tr>
                        ) : data.length === 0 ? (
                            <tr><td colSpan={columns.length + 1} className="px-6 py-8 text-center text-gray-400">No records found.</td></tr>
                        ) : (
                            data.map((row) => (
                                <tr key={row[primaryKeyField]} className="hover:bg-blue-50/30 transition-colors">
                                    {columns.map(col => (
                                        <td key={col.key} className="px-6 py-4">
                                            {typeof row[col.key] === 'boolean' || col.type === 'boolean' ? (
                                                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${row[col.key] ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                    {row[col.key] ? 'Active' : 'Inactive'}
                                                </span>
                                            ) : row[col.key]}
                                        </td>
                                    ))}
                                    <td className="px-6 py-4 text-right space-x-3">
                                        <button onClick={() => openEditModal(row)} className="text-blue-600 hover:text-blue-800 font-medium transition-colors">Edit</button>
                                        <button onClick={() => handleDelete(row[primaryKeyField])} className="text-red-600 hover:text-red-800 font-medium transition-colors">Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
                    <div className="space-x-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 disabled:opacity-50 hover:bg-gray-100 transition-colors"
                        >
                            Previous
                        </button>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                            className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 disabled:opacity-50 hover:bg-gray-100 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Modal */}
            <DynamicFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={editingRecord}
                columns={columns}
                title={editingRecord ? `Edit Record` : `Add New Record`}
            />
        </div>
    );
};

export default DynamicDataTable;
