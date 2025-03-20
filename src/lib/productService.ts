"use client"

import axios from "axios";

export const fetchProducts = async () => {
  const { data } = await axios.get("/api/products");
  return data;
};

export const addProduct = async (product) => {
  const { data } = await axios.post("/api/products", product);
  return data;
};
