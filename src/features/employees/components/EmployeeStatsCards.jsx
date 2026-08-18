import { Users, UserCheck, Shield, Building2 } from "lucide-react";

function EmployeeStatsCards({ employees = [], roles = [], properties = [] }) {
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status === "Active").length;
  const totalRoles = roles.length;
  const assignedPropertiesCount = new Set(
    employees.flatMap((e) => (e.assigned_properties || []).map((p) => p.property_id))
  ).size;

  const stats = [
    {
      title: "Total Staff",
      value: totalEmployees,
      icon: Users,
      color: "text-emerald-700 bg-emerald-50 border-emerald-100",
      description: "Total registered workforce",
    },
    {
      title: "Active Staff",
      value: activeEmployees,
      icon: UserCheck,
      color: "text-konkan-700 bg-konkan-50 border-konkan-100",
      description: `${totalEmployees - activeEmployees} inactive / on leave`,
    },
    {
      title: "Assigned Properties",
      value: `${assignedPropertiesCount} / ${properties.length}`,
      icon: Building2,
      color: "text-teal-700 bg-teal-50 border-teal-100",
      description: "Properties with active staff",
    },
    {
      title: "Roles & Positions",
      value: totalRoles,
      icon: Shield,
      color: "text-indigo-700 bg-indigo-50 border-indigo-100",
      description: `${roles.filter((r) => r.is_system_role).length} System • ${roles.filter((r) => !r.is_system_role).length} Custom`,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.title}
            className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${stat.color}`}
            >
              <Icon className="h-6 w-6" />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {stat.title}
              </p>
              <p className="mt-0.5 text-2xl font-bold text-slate-900">
                {stat.value}
              </p>
              <p className="text-[11px] text-slate-500">{stat.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default EmployeeStatsCards;
