import { useEffect, useRef, useState } from "react";
import {
  Bell,
  CheckCheck,
  ChevronDown,
  Info,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";

import useAuth from "../../../features/auth/hooks/useAuth.js";
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
    message: "Your property owner account is verified and active on KonkanTrip™.",
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
  const { user, isEmployee, roleName, logout } = useAuth();

  const firstName = user?.first_name || "Owner";
  const lastName = user?.last_name || "";
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "O";
  const displayName = `${firstName} ${lastName}`.trim() || user?.email || "Owner";

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState("");

  const notifDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const toggleNotifDropdown = () => {
    setIsNotifOpen((prev) => !prev);
    setIsProfileOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileOpen((prev) => !prev);
    setIsNotifOpen(false);
  };

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
      if (
        notifDropdownRef.current &&
        !notifDropdownRef.current.contains(event.target)
      ) {
        setIsNotifOpen(false);
      }
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-20 shrink-0 flex h-18 items-center justify-between border-b border-slate-100 bg-white/95 px-4 backdrop-blur-md sm:px-6">
      {/* Left: Mobile Menu Trigger & Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global Search Bar matching reference */}
        <div className="relative flex items-center w-full max-w-sm sm:max-w-md">
          <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search anything..."
            className="w-full rounded-xl border border-slate-200/80 bg-slate-50/60 py-2 pl-10 pr-14 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
          />
          <div className="absolute right-3 flex items-center pointer-events-none">
            <kbd className="flex items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 shadow-2xs">
              ⌘ K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-3">
        {/* Notification Dropdown Container */}
        <div className="relative" ref={notifDropdownRef}>
          <button
            type="button"
            onClick={toggleNotifDropdown}
            className={[
              "relative rounded-xl p-2.5 transition-colors",
              isNotifOpen
                ? "bg-emerald-50 text-emerald-700"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-700",
            ].join(" ")}
            aria-label="Notifications"
            aria-expanded={isNotifOpen}
          >
            <Bell className="h-5 w-5 text-slate-600" />

            {unreadCount > 0 && (
              <span className="absolute 1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl sm:w-96">
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

              <div className="mt-3 max-h-80 divide-y divide-slate-50 overflow-y-auto">
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
                        "group cursor-pointer py-3 transition hover:bg-slate-50/80 px-2 rounded-xl",
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
            </div>
          )}
        </div>

        {/* Profile Dropdown Container */}
        <div className="relative" ref={profileDropdownRef}>
          <button
            type="button"
            onClick={toggleProfileDropdown}
            className="flex items-center gap-2.5 rounded-xl p-1.5 transition hover:bg-slate-50"
            aria-expanded={isProfileOpen}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800 shadow-2xs ring-2 ring-emerald-50">
              {initials ? initials : <User className="h-4 w-4" />}
            </div>

            <div className="hidden text-left sm:block">
              <p className="m-0 text-xs font-semibold text-slate-900 leading-tight">
                {displayName}
              </p>
              <p className="m-0 text-[11px] text-slate-500">
                {roleName || (isEmployee ? "Staff Member" : "Property Owner")}
              </p>
            </div>

            <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 sm:block" />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl">
              <div className="border-b border-slate-100 px-3 py-2.5">
                <p className="text-xs font-bold text-slate-900">{displayName}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
              </div>

              <div className="py-1">
                <Link
                  to={ROUTES.OWNER_PROFILE}
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                >
                  <User className="h-4 w-4 text-slate-400" />
                  <span>My Profile</span>
                </Link>

                <Link
                  to={ROUTES.OWNER_SETTINGS}
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                >
                  <ShieldCheck className="h-4 w-4 text-slate-400" />
                  <span>Account Settings</span>
                </Link>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="h-4 w-4 text-red-500" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default OwnerHeader;