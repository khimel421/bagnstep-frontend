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

  return <DataTable columns={columns} data={data} />;
}
