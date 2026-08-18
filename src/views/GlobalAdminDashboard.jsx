import { useState, useEffect } from 'react';
import { Building2, FileCheck, Users, Activity, TrendingUp } from 'lucide-react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';

export default function GlobalAdminDashboard() {
    const [stats, setStats] = useState({
        totalProperties: 0,
        pendingApprovals: 0,
        totalHosts: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/admin/dashboard/stats');
                if (response.data?.success) {
                    setStats(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch global stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const metricCards = [
        {
            title: "Total Properties",
            value: stats.totalProperties,
            icon: Building2,
            color: "text-blue-600",
            bg: "bg-blue-50",
            border: "border-blue-200",
            link: "/admin/dashboard/properties"
        },
        {
            title: "Pending Approvals",
            value: stats.pendingApprovals,
            icon: FileCheck,
            color: "text-amber-600",
            bg: "bg-amber-50",
            border: "border-amber-200",
            link: "/admin/dashboard/pending"
        },
        {
            title: "Registered Hosts",
            value: stats.totalHosts,
            icon: Users,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            border: "border-emerald-200",
            link: "/admin/dashboard/owners"
        }
    ];

    if (loading) {
        return <Loader message="Aggregating ecosystem metrics..." />;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-8">
                <div>
                    <h2 className="text-[var(--color-konkan-700)] text-[13px] font-extrabold uppercase tracking-widest mb-1">KonkanTrip Admin</h2>
                    <h1 className="text-3xl font-bold text-slate-800">Global Overview</h1>
                    <p className="text-sm text-slate-500 mt-2">Welcome back. Here is the latest performance data across the ecosystem.</p>
                </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {metricCards.map((card, idx) => (
                    <Link
                        key={idx}
                        to={card.link}
                        className={`bg-white rounded-xl shadow-sm border ${card.border} p-6 flex items-start justify-between hover:shadow-md transition-shadow group`}
                    >
                        <div>
                            <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wide mb-2">{card.title}</p>
                            <h3 className="text-4xl font-extrabold text-slate-800 tracking-tight">{card.value}</h3>
                            <div className="flex items-center gap-1.5 mt-4 text-xs font-semibold text-emerald-600 bg-emerald-50 w-max px-2 py-0.5 rounded-full">
                                <TrendingUp className="w-3 h-3" />
                                <span>Realtime</span>
                            </div>
                        </div>
                        <div className={`p-4 rounded-xl ${card.bg} group-hover:scale-105 transition-transform`}>
                            <card.icon className={`w-8 h-8 ${card.color}`} />
                        </div>
                    </Link>
                ))}
            </div>

            {/* Additional Info Cards Placeholder similar to Salesforce Home page */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-[400px]">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="text-[14px] font-bold text-slate-800 flex items-center gap-2">
                            Recent Platform Activity
                        </h3>
                    </div>
                    <div className="flex items-center justify-center h-[calc(100%-53px)] text-slate-400 text-sm italic bg-slate-50/20">
                        Activity graph coming soon
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-[400px]">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="text-[14px] font-bold text-slate-800 flex items-center gap-2">
                            Quick Links
                        </h3>
                    </div>
                    <div className="p-6">
                        <p className="text-sm text-slate-500">Access major modules via the top-left App Launcher.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
