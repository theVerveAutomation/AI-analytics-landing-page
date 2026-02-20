"use client";

import { useState } from "react";
import MobileHeader from "@/components/MobileHeader";
import Sidebar from "@/components/SideBar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Mobile Header */}
      <MobileHeader setSidebarOpen={setSidebarOpen} />

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        // openEmployees={openEmployees}
        // setOpenEmployees={setOpenEmployees}
      />

      {/* Main content */}
      <main className="flex-1 flex overflow-auto pt-16 lg:pt-0 lg:pl-[17%]">
        {children}
      </main>
    </div>
  );
}
