import { Product } from "@/types/product";
import { useQuery } from "@tanstack/react-query";


const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch("http://localhost:5000/api/admin/products");
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
};

export const useProducts = () => {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
};