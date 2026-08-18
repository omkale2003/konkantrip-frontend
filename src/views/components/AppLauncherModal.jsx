import { useState, useRef, useEffect } from 'react';
import { Grid, Building2, Waves, Home, Store, Search, ExternalLink, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AppLauncherModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    const apps = [
        {
            id: 'global',
            name: 'Global Overview',
            description: 'Platform metrics and daily summary statistics',
            icon: Activity,
            path: '/admin/dashboard',
            active: true
        },
        {
            id: 'properties',
            name: 'Properties Center',
            description: 'Manage hosts, reviews, and global property inventory',
            icon: Building2,
            path: '/admin/dashboard/owners',
            active: true
        },
        {
            id: 'watersports',
            name: 'WaterSports',
            description: 'Scuba, jet ski, and aquatic activity vendors',
            icon: Waves,
            path: '#',
            active: false
        },
        {
            id: 'homestays',
            name: 'Homestays',
            description: 'Manage verified local homestays and cottages',
            icon: Home,
            path: '#',
            active: false
        },
        {
            id: 'vendorhub',
            name: 'Vendor Hub',
            description: 'B2B portal, shop analytics, and local vendor payouts',
            icon: Store,
            path: '#',
            active: false
        }
    ];

    const filteredApps = apps.filter(app =>
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                className={`p-2 rounded-lg transition-colors flex items-center justify-center
                    ${isOpen ? 'bg-[var(--color-konkan-100)] text-[var(--color-konkan-700)]' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}
                `}
                aria-label="App Launcher"
                title="App Launcher"
            >
                <Grid className="w-[22px] h-[22px]" />
            </button>

            {isOpen && (
                <div className="absolute top-12 left-0 w-[420px] bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden transform origin-top-left flex flex-col">
                    <div className="p-4 border-b border-slate-100 bg-slate-50">
                        <h3 className="text-sm font-bold text-slate-800 mb-3">App Launcher</h3>
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search apps and items..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-konkan-500)] focus:border-transparent transition-all"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="p-4 max-h-[400px] overflow-y-auto">
                        <div className="grid grid-cols-2 gap-3">
                            {filteredApps.map(app => (
                                <Link
                                    key={app.id}
                                    to={app.active ? app.path : '#'}
                                    onClick={() => app.active && setIsOpen(false)}
                                    className={`relative p-4 rounded-xl border flex flex-col items-start gap-2 transition-all group
                                        ${app.active
                                            ? 'border-slate-200 hover:border-[var(--color-konkan-500)] hover:shadow-md bg-white hover:-translate-y-0.5'
                                            : 'border-slate-100 bg-slate-50/50 cursor-not-allowed opacity-75'
                                        }`}
                                >
                                    <div className={`p-2.5 rounded-lg
                                        ${app.active ? 'bg-[var(--color-konkan-50)] text-[var(--color-konkan-700)]' : 'bg-slate-200 text-slate-500'}
                                    `}>
                                        <app.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                                            {app.name}
                                            {app.active && <ExternalLink className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                        </h4>
                                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                            {app.description}
                                        </p>
                                    </div>
                                    {!app.active && (
                                        <span className="absolute top-3 right-3 text-[10px] font-bold tracking-wider text-slate-400 bg-slate-200 px-2 py-0.5 rounded uppercase">
                                            Soon
                                        </span>
                                    )}
                                </Link>
                            ))}

                            {filteredApps.length === 0 && (
                                <div className="col-span-2 py-8 text-center">
                                    <p className="text-sm font-medium text-slate-500">No matching apps found</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-slate-50 p-3 border-t border-slate-100 text-center">
                        <button className="text-[13px] font-semibold text-[var(--color-konkan-700)] hover:text-[var(--color-konkan-800)]">
                            View All Items
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
