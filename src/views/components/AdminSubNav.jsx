import { Link, useLocation } from 'react-router-dom';

export default function AdminSubNav() {
    const location = useLocation();

    // Contextual links for "Properties Center" App
    const navLinks = [
        {
            name: "Hosts Hub",
            path: "/admin/dashboard/owners",
            matchRegex: /^\/admin\/dashboard(\/owners.*)?$/
        },
        {
            name: "Global Inventory",
            path: "/admin/dashboard/properties",
            matchRegex: /^\/admin\/dashboard\/properties.*$/
        },
        {
            name: "Pending Approvals",
            path: "/admin/dashboard/pending",
            matchRegex: /^\/admin\/dashboard\/pending.*$/
        },
        {
            name: "Master Data Config",
            path: "/admin/dashboard/master-data",
            matchRegex: /^\/admin\/dashboard\/master-data.*$/
        },
        {
            name: "System Settings",
            path: "/admin/dashboard/settings",
            matchRegex: /^\/admin\/dashboard\/settings.*$/
        }
    ];

    const isLinkActive = (link) => {
        // Simple case: exact match or regex match
        if (link.matchRegex) {
            // Note: because /admin/dashboard maps to owners by default (index: true),
            // we configure the regex for Hosts Hub to accept it.
            if (location.pathname === '/admin/dashboard' && link.path === '/admin/dashboard/owners') {
                return false; // Don't highlight hosts hub if on global dashboard anymore
            }
            return link.matchRegex.test(location.pathname);
        }
        return location.pathname === link.path;
    };

    if (location.pathname === '/admin/dashboard') {
        return null;
    }

    return (
        <div className="bg-white border-b border-slate-200 shrink-0 shadow-sm relative z-10 w-full overflow-x-auto scroller-hide">
            <nav className="flex space-x-1 px-4 sm:px-6 w-max min-w-full">
                {navLinks.map((link) => {
                    const active = isLinkActive(link);
                    return (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`whitespace-nowrap px-4 py-3 text-sm font-semibold transition-all relative
                                ${active
                                    ? 'text-[var(--color-konkan-700)]'
                                    : 'text-slate-600 hover:text-slate-900 bg-transparent hover:bg-slate-50'
                                }
                            `}
                        >
                            {link.name}
                            {/* Salesforce style active tab indicator */}
                            {active && (
                                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[var(--color-konkan-700)] rounded-t-sm shadow-sm" />
                            )}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
