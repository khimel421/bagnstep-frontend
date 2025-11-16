import { useState, useEffect } from "react";
import axios from "axios";
import { Order } from "@/types/types";



export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);


  // Fetch all orders
  const fetchOrders = async (params?: {
    page?: number;
    pageSize?: number;
    status?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    try {
      setLoading(true);




      const query = new URLSearchParams({

        page: String(params?.page || 1),
        pageSize: String(params?.pageSize || 10),
        ...(params?.status ? { status: params.status } : {}),
        ...(params?.search ? { search: params.search } : {}),
        ...(params?.startDate ? { startDate: params.startDate } : {}),
        ...(params?.endDate ? { endDate: params.endDate } : {}),
      });

      console.log(query)

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/orders?${query.toString()}`
      );

      setOrders(response.data.orders);
      setTotalPages(response.data.totalPages || 1);
    } catch (err: any) {
      setError(err.message || "Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };


  // Auto refetch every 30 minutes
  // Fetch when page changes immediately
  useEffect(() => {
    fetchOrders({ page, pageSize });
  }, [page, pageSize]);


  // Create a new order
  const createOrder = async (newOrder: Partial<Order>) => {
    try {
      setLoading(true);
      const response = await axios.post<Order>(`${process.env.NEXT_PUBLIC_API_URL}/orders`, newOrder);
      setOrders((prev) => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      setError(err.message || "Failed to create order.");
    } finally {
      setLoading(false);
    }
  };

  // Update an existing order
  const updateOrder = async (id: string, updatedFields: Partial<Order>) => {
    try {
      setLoading(true);
      const response = await axios.put<Order>(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, updatedFields);
      setOrders((prev) =>
        prev.map((order) => (order.id === id ? response.data : order))
      );
      return response.data;
    } catch (err: any) {
      setError(err.message || "Failed to update order.");
    } finally {
      setLoading(false);
    }
  };

  // Get a single order by ID
  const getOrderById = async (id: string): Promise<Order | null> => {
    try {
      setLoading(true);
      const response = await axios.get<Order>(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`);
      return response.data;
    } catch (err: any) {
      setError(err.message || "Failed to fetch order.");
      return null;
    } finally {
      setLoading(false);
    }
  };


  // Delete an order
  const deleteOrder = async (id: string) => {
    try {
      setLoading(true);
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`);
      setOrders((prev) => prev.filter((order) => order.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete order.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders on first render
  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    fetchOrders,
    createOrder,
    updateOrder,
    getOrderById,
    deleteOrder,
    setOrders,
  };

};
