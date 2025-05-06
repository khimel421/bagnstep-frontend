"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import DotsLoader from "@/components/DotsLoader";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/types";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/products`);
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product", err);
    }
  };

  if (loading) {
    return (
      <div className="mt-24 flex flex-col gap-6 justify-center items-center">
              <DotsLoader />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="mt-24 flex flex-col gap-8 justify-center items-center">
        <h1 className="text-center text-xl font-semibold">No Product available</h1>
        <Link href={"/admin/addProduct"}>
          <Button variant={"custom"}>Add product <Plus /></Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 z-0 mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
        {products.map((product: Product) => (
          <Card key={product.id} className="p-4">
            <div className="flex justify-center">
              {product.images ? (
                (() => {
                  try {
                    const imagesArray: string[] = Array.isArray(product.images)
                      ? product.images
                      : JSON.parse(product.images);
                    return imagesArray.length > 0 ? (
                      <Image
                        src={imagesArray[0]}
                        width={200}
                        height={200}
                        alt={product.name}
                        className="w-24 h-24 object-cover rounded"
                      />
                    ) : (
                      <span>No Image</span>
                    );
                  } catch {
                    console.error("Error parsing images:", product.images);
                    return <span>Invalid Image Data</span>;
                  }
                })()
              ) : (
                <span>No Image</span>
              )}
            </div>

            <CardContent className="mt-4">
              <h3 className="text-lg font-semibold text-center">{product.productCode}</h3>
              <p className="text-gray-600 text-center">Price: ${product.price}</p>

              <div className="mt-2 overflow-hidden">
                <h4 className="text-lg font-medium text-center">Stock:</h4>
                {Array.isArray(product.sizes) && product.sizes.length > 0 ? (
                  <Table className="mt-2 border overflow-hidden">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-center">Size</TableHead>
                        <TableHead className="text-center">Stock</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {product.sizes.map((size: { size: string; stock: number }) => (
                        <TableRow key={size.size}>
                          <TableCell className="text-center">{size.size}</TableCell>
                          <TableCell className="text-center">{size.stock} in stock</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <span className="block text-center mt-2">No Size Data</span>
                )}
              </div>
            </CardContent>

            <div className="flex justify-center lg:justify-end items-center gap-4 mt-4">
              <Link href={`/admin/manageProduct/${product.id}`}>
                <Button className="flex items-center gap-2 py-2 px-3 rounded-lg">
                  <Pencil size={16} /> Update
                </Button>
              </Link>
              <AlertDialog>
                <AlertDialogTrigger>
                  <div className="flex items-center gap-2 bg-red-500 text-white py-2 px-3 rounded-lg">
                    <Trash2 size={16} /> Remove
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your product.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button
                      variant="destructive"
                      onClick={() => deleteProduct(product.id)}
                    >
                      <Trash2 size={16} /> Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
