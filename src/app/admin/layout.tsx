import Sidebar from "@/components/Sidebar";
import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar for Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1  ml-64 p-6">
        {children}  {/* This will render admin-specific pages */}
      </div>
    </div>
  );
}
