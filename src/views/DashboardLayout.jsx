import { Outlet } from 'react-router-dom';
import AdminHeader from './components/AdminHeader.jsx';
import AdminSubNav from './components/AdminSubNav.jsx';

export default function DashboardLayout() {
    return (
        <div className="flex flex-col h-screen overflow-hidden bg-slate-50 font-sans">
            <AdminHeader />
            <AdminSubNav />
            <main className="flex-1 overflow-auto bg-[#f3f4f6] p-4 sm:p-6 lg:p-8 border-t border-slate-200">
                <div className="mx-auto w-full max-w-[1600px] bg-transparent">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
