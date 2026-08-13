import React, { useState } from 'react';
import DynamicDataTable from '../components/DynamicDataTable';

// Central setup that dictates how each lookup table behaves
const TableConfigs = {
    languages: {
        title: "Languages",
        tableName: "languages",
        primaryKeyField: "language_id",
        columns: [
            { key: 'language_id', label: 'ID', primaryKey: true },
            { key: 'language_name', label: 'Language Name', autoFocus: true },
            { key: 'language_code', label: 'Code (e.g. EN)' },
            { key: 'is_active', label: 'Status', type: 'boolean', default: 1 }
        ]
    },
    amenities: {
        title: "Amenities",
        tableName: "amenities",
        primaryKeyField: "amenity_id",
        columns: [
            { key: 'amenity_id', label: 'ID', primaryKey: true },
            { key: 'amenity_category_id', label: 'Category ID', type: 'number' },
            { key: 'amenity_name', label: 'Name', autoFocus: true },
            { key: 'status', label: 'Status', type: 'boolean', default: 1 }
        ]
    },
    contact_types: {
        title: "Contact Types",
        tableName: "contact_types",
        primaryKeyField: "contact_type_id",
        columns: [
            { key: 'contact_type_id', label: 'ID', primaryKey: true },
            { key: 'contact_type_name', label: 'Contact Type Name', autoFocus: true },
            { key: 'status', label: 'Status', type: 'boolean', default: 1 }
        ]
    },
    tags: {
        title: "Tags",
        tableName: "tags",
        primaryKeyField: "tag_id",
        columns: [
            { key: 'tag_id', label: 'ID', primaryKey: true },
            { key: 'tag_name', label: 'Tag Name', autoFocus: true },
            { key: 'tag_slug', label: 'Slug' },
            { key: 'status', label: 'Status', type: 'boolean', default: 1 }
        ]
    },
    document_types: {
        title: "Document Types",
        tableName: "document_types",
        primaryKeyField: "document_type_id",
        columns: [
            { key: 'document_type_id', label: 'ID', primaryKey: true },
            { key: 'document_name', label: 'Document Name', autoFocus: true },
            { key: 'document_slug', label: 'Slug' },
            { key: 'is_mandatory', label: 'Mandatory', type: 'boolean', default: 0 },
            { key: 'is_active', label: 'Status', type: 'boolean', default: 1 }
        ]
    }
    // You can add all 30+ tables here following this structure!
};

const MasterDataConfig = () => {
    const [activeTab, setActiveTab] = useState('languages');

    const activeConfig = TableConfigs[activeTab];

    return (
        <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Master Data Configuration</h1>
                    <p className="text-gray-500 mt-2">Manage all system lookups, options, and global variables.</p>
                </div>

                {/* Sub-layout: Sidebar + Main Content */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Navigation Sidebar */}
                    <div className="w-full lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 space-y-1 sticky top-6">
                            {Object.keys(TableConfigs).map((key) => (
                                <button
                                    key={key}
                                    onClick={() => setActiveTab(key)}
                                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === key
                                            ? 'bg-blue-50 text-blue-700 shadow-sm'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    {TableConfigs[key].title}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="flex-1 w-full overflow-hidden">
                        {activeConfig ? (
                            <DynamicDataTable
                                tableName={activeConfig.tableName}
                                columns={activeConfig.columns}
                                title={activeConfig.title}
                                primaryKeyField={activeConfig.primaryKeyField}
                            />
                        ) : (
                            <div className="text-gray-400 p-10 text-center bg-white rounded-xl border border-gray-100">
                                Select a configuration category from the sidebar.
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MasterDataConfig;
