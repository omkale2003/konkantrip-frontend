import { Outlet, NavLink, useNavigate } from 'react-router-dom';

export default function DashboardLayout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-800">

            {/* Sidebar matching the image exactly */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col z-20 shrink-0">
                <div className="px-6 py-6 border-b border-slate-100 mb-4">
                    <h2 className="text-lg font-bold tracking-tight text-[#226a5b]">KonkanTrip</h2>
                    <span className="text-[13px] text-slate-500 font-medium">Administrator</span>
                </div>

                <div className="px-6 mb-2">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Management</p>
                </div>
                <nav className="flex-1 px-4 space-y-1">
                    <NavLink
                        to="/admin/dashboard/owners"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-[#f0f9f6] text-[#226a5b]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`
                        }
                    >
                        <svg className="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        Property Owners
                    </NavLink>
                    <NavLink
                        to="/admin/dashboard/properties"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-[#f0f9f6] text-[#226a5b]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`
                        }
                    >
                        <svg className="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                        All Properties
                    </NavLink>
                    <NavLink
                        to="/admin/dashboard/pending"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-[#f0f9f6] text-[#226a5b]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`
                        }
                    >
                        <svg className="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Pending Approvals
                    </NavLink>
                    <NavLink
                        to="/admin/dashboard/master-data"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-[#f0f9f6] text-[#226a5b]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`
                        }
                    >
                        <svg className="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Master Data
                    </NavLink>
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors rounded-lg"
                    >
                        <svg className="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Log Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-hidden">

                {/* Top Header */}
                <header className="bg-white border-b border-slate-200 h-[72px] flex items-center justify-between px-8 z-10 shrink-0">
                    <div>
                        <h1 className="text-[15px] font-semibold text-slate-800">Admin Portal</h1>
                    </div>

                    <div className="flex items-center gap-5">
                        <button className="text-slate-400 hover:text-[#226a5b] transition-colors relative">
                            <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <div className="absolute top-0 right-0 w-2 h-2 bg-[#226a5b] border-2 border-white rounded-full"></div>
                        </button>
                        <div className="flex items-center gap-3 border-l border-slate-200 pl-5">
                            <div className="w-8 h-8 rounded-full bg-[#e3f2ed] text-[#226a5b] flex items-center justify-center font-bold text-xs">
                                SA
                            </div>
                            <div className="hidden md:flex flex-col text-right">
                                <span className="text-[13px] font-semibold text-slate-800 leading-tight">Super Admin</span>
                                <span className="text-[11px] text-slate-500">Administrator</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 md:p-10">
                    <div className="max-w-[1200px] mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
