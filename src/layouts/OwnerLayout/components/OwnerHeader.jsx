import { useEffect, useRef, useState } from "react";
import {
  Bell,
  CheckCheck,
  Info,
  Menu,
  ShieldCheck,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";

import storageService from "../../../services/storage.service.js";
import { ROUTES } from "../../../constants/routes.js";

const DEFAULT_NOTIFICATIONS = [
  {
    id: 1,
    title: "Property Setup Active",
    message: "Your property basic details and policies have been saved successfully.",
    time: "10 mins ago",
    unread: true,
    type: "info",
  },
  {
    id: 2,
    title: "Account Verified",
    message: "Your property owner account is verified and active on KonkanTrip.",
    time: "2 hours ago",
    unread: true,
    type: "success",
  },
  {
    id: 3,
    title: "Complete Property Photos",
    message: "Upload high-quality photos for better guest engagement.",
    time: "1 day ago",
    unread: true,
    type: "alert",
  },
];

function OwnerHeader({ onMenuClick }) {
  const owner = storageService.getOwner();

  const firstName = owner?.first_name || "Owner";
  const lastName = owner?.last_name || "";
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "O";

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-20 shrink-0 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="lg:hidden">
          <p className="m-0 text-base font-bold text-konkan-700">
            KonkanTrip
          </p>
        </div>

        <div className="hidden lg:block">
          <p className="m-0 text-sm font-medium text-slate-900">
            Property Owner Portal
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Notification Dropdown Container */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={toggleDropdown}
            className={[
              "relative rounded-lg p-2 transition-colors",
              isOpen
                ? "bg-emerald-50 text-emerald-700"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-700",
            ].join(" ")}
            aria-label="Notifications"
            aria-expanded={isOpen}
          >
            <Bell className="h-5 w-5" />

            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown Panel */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-4 shadow-xl sm:w-96">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    Notifications
                  </h3>

                  {unreadCount > 0 && (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                      {unreadCount} new
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 transition hover:text-emerald-800"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notification Items */}
              <div className="mt-3 max-h-80 divide-y divide-slate-100 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="py-6 text-center text-xs text-slate-500">
                    No notifications
                  </p>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => markAsRead(item.id)}
                      className={[
                        "group cursor-pointer py-3 transition hover:bg-slate-50/80 px-2 rounded-lg",
                        item.unread ? "bg-emerald-50/30" : "",
                      ].join(" ")}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                          {item.type === "success" ? (
                            <ShieldCheck className="h-4 w-4" />
                          ) : (
                            <Info className="h-4 w-4" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <p
                              className={[
                                "text-xs font-semibold leading-snug",
                                item.unread ? "text-slate-900 font-bold" : "text-slate-700",
                              ].join(" ")}
                            >
                              {item.title}
                            </p>

                            <span className="text-[10px] text-slate-400">
                              {item.time}
                            </span>
                          </div>

                          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                            {item.message}
                          </p>
                        </div>

                        {item.unread && (
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-600" />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="mt-3 border-t border-slate-100 pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-medium text-slate-500 hover:text-slate-800"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="hidden h-8 w-px bg-slate-200 sm:block" />

        {/* Profile Link */}
        <Link
          to={ROUTES.OWNER_PROFILE}
          className="flex items-center gap-3 rounded-lg p-1.5 transition hover:bg-slate-100"
          title="View Profile"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-konkan-100 text-sm font-semibold text-konkan-700">
            {initials ? initials : <User className="h-4 w-4" />}
          </div>

          <div className="hidden text-left sm:block">
            <p className="m-0 text-sm font-medium text-slate-800">
              {firstName} {lastName}
            </p>

            <p className="m-0 text-xs text-slate-500">
              Property Owner
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}

export default OwnerHeader;