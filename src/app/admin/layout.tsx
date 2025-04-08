import AdminBottomNavbar from "@/components/AdminBottomNavbar";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import Link from "next/link";

import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen ">

      {/* Sidebar for Navigation */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="lg:hidden">
        <AdminBottomNavbar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1  lg:ml-64 p-6">
        <Link href={"/"}>
          <figure className="w-[30%] mx-auto mt-4"><Image src="/images/logo.png" alt="logo" /></figure>
        </Link>

        {children}  {/* This will render admin-specific pages */}
      </div>
    </div>
  );
}
