"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NotificationBar from "@/components/NotificationBar";

export default function AdminDashboardPage() {

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (!token) {
      router.push("/admin/login");
    }
  }, [router]);

  return (
    <div className="">
      <div className="flex-1">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Orders</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">1,245</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">$25,300</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sales Trends</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">📈 +12%</CardContent>
          </Card>
          <Card className="cursor-pointer" onClick={() => {router.push('/admin/orders')}}>
            <CardHeader>
              <CardTitle>New Orders</CardTitle>
            </CardHeader>
            <CardContent className="text-lg font-bold"><NotificationBar /></CardContent>
          </Card>


        </div>
      </div>
    </div>
  );
}
