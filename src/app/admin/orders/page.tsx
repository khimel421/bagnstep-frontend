"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Order } from "@/types/types";

import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { DataTable } from "./data-table";


export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [totalOrders, setTotalOrders] = useState(0);

  const totalPages = Math.ceil(totalOrders / pageSize);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        params: { page, pageSize },
      });
      setOrders(res.data.orders);
      setTotalOrders(res.data.total);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]); // Add dependencies here
  
  useEffect(() => {
    fetchOrders();
  }, [page, fetchOrders]); // Now stable

  return (
    <div className="lg:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Order Management</h2>
        <Button onClick={fetchOrders} disabled={loading}>
          {loading && <RotateCcw  className="mr-2 h-4 w-4 animate-spin" />}
          Refresh
        </Button>
      </div>

      <DataTable columns={columns(fetchOrders)} data={orders} />

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <Button
          variant="outline"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
