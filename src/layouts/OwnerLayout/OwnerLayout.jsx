import { useState } from "react";
import { Outlet } from "react-router-dom";

import OwnerSidebar from "./components/OwnerSidebar.jsx";
import OwnerHeader from "./components/OwnerHeader.jsx";
import MobileSidebar from "./components/MobileSidebar.jsx";

function OwnerLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] =
    useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      <OwnerSidebar />

      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        <OwnerHeader
          onMenuClick={() => setIsMobileSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-[1440px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default OwnerLayout;