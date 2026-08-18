import { useState, useRef, useEffect } from 'react';
import { ShieldCheck, LogOut, ChevronDown } from 'lucide-react';

export default function AdminProfileDropdown({ onLogout }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Get admin details from localStorage if available
    const adminUserStr = localStorage.getItem('adminUser');
    let adminUser = null;
    try {
        adminUser = adminUserStr ? JSON.parse(adminUserStr) : null;
    } catch (e) {
        console.error("Failed to parse admin user");
    }

    const displayName = adminUser?.name || "Super Admin";
    const role = adminUser?.role || "System Administrator";

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-3 rounded-lg p-1.5 transition-colors cursor-pointer hover:bg-slate-100 ${isOpen ? 'bg-slate-100' : ''}`}
                aria-label="Admin Profile"
            >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-konkan-100)] text-sm font-semibold text-[var(--color-konkan-700)] shadow-sm">
                    <ShieldCheck className="h-5 w-5" />
                </div>

                <div className="hidden text-left sm:block">
                    <p className="m-0 text-sm font-bold text-slate-800">
                        {displayName}
                    </p>
                    <p className="m-0 text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                        {role}
                    </p>
                </div>

                <div className="hidden sm:block text-slate-400">
                    <ChevronDown className="w-4 h-4" />
                </div>
            </button>

            {isOpen && (
                <div className="absolute right-0 top-14 w-64 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden transform origin-top-right">
                    <div className="p-4 border-b border-slate-100 bg-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-konkan-100)] text-[var(--color-konkan-700)]">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-800 leading-tight">{displayName}</h4>
                                <p className="text-xs text-slate-500 font-medium">{role}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-2">
                        <button
                            type="button"
                            onClick={() => {
                                setIsOpen(false);
                                onLogout && onLogout();
                            }}
                            className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                            <span className="flex items-center gap-2">
                                <LogOut className="h-4 w-4" />
                                Sign Out
                            </span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
