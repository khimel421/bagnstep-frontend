"use client";

import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { format } from "date-fns";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Order } from "@/types/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

export const getOrderStatusColor = (status: Order["status"]) => {
  const colorMap = {
    pending: "bg-yellow-100 text-yellow-700",
    shipped: "bg-blue-100 text-blue-700",
    delivered: "bg-green-100 text-green-700",
    cancel: "bg-red-100 text-red-700",
  };
  return colorMap[status as keyof typeof colorMap] || "bg-gray-100 text-gray-700";
};

// ✅ Move hook into valid components
function ViewItemsButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  return (
    <Button
      size="sm"
      onClick={() => router.push(`/admin/orders/${orderId}`)}
    >
      View Items
    </Button>
  );
}

function StatusSelector({
  order,
  refreshOrders,
}: {
  order: Order;
  refreshOrders: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Badge className={getOrderStatusColor(order.status)}>
        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
      </Badge>

      <Select
        defaultValue={order.status}
        onValueChange={async (value) => {
          try {
            await axios.put(
              `${process.env.NEXT_PUBLIC_API_URL}/orders/${order.id}/status`,
              { status: value }
            );
            toast.success("Order status updated");
            refreshOrders();
          } catch (error) {
            console.error(error);
            toast.error("Failed to update status");
          }
        }}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="shipped">Shipped</SelectItem>
          <SelectItem value="delivered">Delivered</SelectItem>
          <SelectItem value="cancel">Cancel</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export const columns = (
  refreshOrders: () => void
): ColumnDef<Order>[] => [
  {
    accessorKey: "id",
    header: "Order ID",
  },
  {
    accessorKey: "customer.name",
    header: "Customer",
    cell: ({ row }) => <span>{row.original.customer?.name || "N/A"}</span>,
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: ({ row }) => (
      <span>৳ {parseFloat(String(row.original.totalAmount)).toFixed(2)}</span>
    ),
  },
  {
    header: "Items",
    cell: ({ row }) => <ViewItemsButton orderId={row.original.id} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusSelector order={row.original} refreshOrders={refreshOrders} />
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <span>{format(new Date(row.original.createdAt), "PPP")}</span>
    ),
  },
];
