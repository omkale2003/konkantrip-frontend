import { Link, useNavigate, useLocation } from "react-router-dom";
import AppLauncherModal from "./AppLauncherModal";
import AdminProfileDropdown from "./AdminProfileDropdown";

function AdminHeader() {
    const navigate = useNavigate();
    const location = useLocation();

    // Determine current app context
    let appContext = "Properties Center";
    if (location.pathname === '/admin/dashboard') {
        appContext = "Global Workspace";
    } else if (location.pathname.startsWith('/admin/dashboard')) {
        appContext = "Properties Center";
    }

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        navigate("/admin/login");
    };

    return (
        <header className="sticky top-0 z-20 shrink-0 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
            {/* Left */}
            <div className="flex items-center gap-4">
                <AppLauncherModal />

                <div className="flex items-center">
                    <Link to="/admin/dashboard" className="m-0 text-base font-extrabold text-[var(--color-konkan-700)] flex items-center gap-2 tracking-tight hover:text-[var(--color-konkan-800)] transition">
                        KonkanTrip
                    </Link>
                    <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-slate-300 mx-2"></span>
                    <span className="font-medium text-slate-800 tracking-normal">{appContext}</span>
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
                <AdminProfileDropdown onLogout={handleLogout} />
            </div>
        </header>
    );
}

export default AdminHeader;
