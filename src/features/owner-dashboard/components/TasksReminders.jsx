import { Link } from "react-router-dom";
import { CheckSquare, CheckCircle2 } from "lucide-react";
import { ROUTES } from "../../../constants/routes.js";

function getDueBadge(due) {
  if (due.includes("2")) {
    return "bg-red-50 text-red-600 border-red-100";
  }
  if (due.includes("3")) {
    return "bg-amber-50 text-amber-700 border-amber-100";
  }
  return "bg-blue-50 text-blue-700 border-blue-100";
}

export function TasksReminders({ properties = [], isLoading = false }) {
  // Derive real actionable tasks based on property completion and verification
  const dynamicTasks = [];

  for (const property of properties) {
    if (!property.is_verified || property.property_status === "Draft") {
      dynamicTasks.push({
        id: `verify-${property.property_id}`,
        title: "Complete property verification",
        propertyName: property.property_name,
        due: "Due in 2 days",
        link: `/owner/properties/${property.property_id}`,
      });
    }

    if (!property.cover_image && !property.cdn_url) {
      dynamicTasks.push({
        id: `photos-${property.property_id}`,
        title: "Add more photos",
        propertyName: property.property_name,
        due: "Due in 3 days",
        link: `/owner/properties/${property.property_id}`,
      });
    }

    if (!property.property_type || !property.property_category) {
      dynamicTasks.push({
        id: `amenities-${property.property_id}`,
        title: "Update property amenities",
        propertyName: property.property_name,
        due: "Due in 5 days",
        link: `/owner/properties/${property.property_id}`,
      });
    }
  }

  const tasksToDisplay = dynamicTasks.slice(0, 3);

  return (
    <div className="rounded-2xl border border-slate-100/80 bg-white p-6 shadow-xs transition hover:shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Tasks & Reminders
          </h2>
        </div>

        <Link
          to={ROUTES.OWNER_PROPERTIES}
          className="inline-flex items-center justify-center rounded-xl border border-emerald-600 bg-white px-4 py-2 text-xs font-bold text-emerald-700 shadow-2xs hover:bg-emerald-50 transition"
        >
          View All Tasks
        </Link>
      </div>

      {/* Task Items */}
      <div className="mt-5">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="flex items-center justify-between rounded-xl border border-slate-100 p-3.5 animate-pulse bg-slate-50/50"
              >
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded bg-slate-200" />
                  <div className="space-y-1">
                    <div className="h-3 w-28 bg-slate-200 rounded" />
                    <div className="h-2.5 w-20 bg-slate-200 rounded" />
                  </div>
                </div>
                <div className="h-5 w-16 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        ) : tasksToDisplay.length === 0 ? (
          <div className="flex items-center justify-center py-6 text-center">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>No tasks or reminders available. All properties are up to date!</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tasksToDisplay.map((task) => (
              <Link
                key={task.id}
                to={task.link}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-100/90 bg-slate-50/30 p-3.5 hover:bg-slate-50/80 hover:border-slate-200 transition group"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <CheckSquare className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate group-hover:text-emerald-700 transition">
                      {task.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-400 truncate">
                      {task.propertyName}
                    </p>
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-bold ${getDueBadge(
                    task.due
                  )}`}
                >
                  {task.due}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TasksReminders;
