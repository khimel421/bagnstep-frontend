"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NotificationBar from "@/components/NotificationBar";
import { useOrderCounts, useTopProducts, useTotalSales } from "@/hooks/useState";
import TopSellingProducts from "@/components/stats/TopProducts";

export default function AdminDashboardPage() {
  const { data: totalSales, isLoading: loadingSales } = useTotalSales();
  const { data: orderCounts, isLoading: loadingOrders } = useOrderCounts();


  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (!token) {
      router.push("/admin/login");
    }
  }, [router]);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Total Sales */}
        <Card className="shadow rounded-xl text-center md:text-left p-8">
          <CardHeader>
            <CardTitle>Total Sales This Month</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-green-600">
            ৳ {Number(totalSales).toLocaleString('en-BD')}
          </CardContent>
        </Card>

        {/* Orders Today */}
        <Card className="shadow rounded-xl p-2  text-center md:text-left">
          <CardHeader>
            <CardTitle>Orders Today</CardTitle>
          </CardHeader>
          <CardContent className="text-4xl font-bold text-blue-600">
            {orderCounts?.today ?? "-"}
          </CardContent>
        </Card>

        {/* Orders This Week */}
        <Card className="shadow rounded-xl  p-2   text-center md:text-left">
          <CardHeader>
            <CardTitle>This Week</CardTitle>
          </CardHeader>
          <CardContent className="text-4xl font-bold text-blue-600">
            {orderCounts?.week ?? "-"}
          </CardContent>
        </Card>

        {/* Orders This Month */}
        <Card className="shadow rounded-xl  p-2   text-center md:text-left">
          <CardHeader>
            <CardTitle>This Month</CardTitle>
          </CardHeader>
          <CardContent className="text-4xl font-bold text-blue-600">
            {orderCounts?.month ?? "-"}
          </CardContent>
        </Card>
      </div>

      {/* Pending Orders */}
      <div className="mt-8">
        <Card
          className="cursor-pointer shadow rounded-xl  p-2  hover:bg-gray-50 transition  text-center md:text-left"
          onClick={() => router.push("/admin/orders")}
        >
          <CardHeader>
            <CardTitle>Pending Orders</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold">
            <NotificationBar />
          </CardContent>
        </Card>
      </div>
      <TopSellingProducts />
      
    </div>
  );
}
