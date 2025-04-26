"use client";
import { useEffect, useState } from "react";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { getCustomers } from "@/lib/api";


export default function CustomerPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getCustomers().then(setData).catch(console.error);
  }, []);

  return <div className="mt-10">
    <h1 className="text-2xl font-bold py-2">Customer History</h1>
    <DataTable columns={columns} data={data} />
  </div>;
}
