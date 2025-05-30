import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_URL } from "../config";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/* 
  Hook to fetch all products
*/

export const useGetProduct = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProductAPI(),
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5,
    onSuccess: (res) => {
      console.log("Products data:", res);
    }, 
  });
};

const getProductAPI = async () => {
  try {
    const res = await api.get("/api/products");

    return res.data;
  } catch (error) {
    console.error("Products Error:", error);
    throw new Error("Failed to fetch products!");
  }
};

export const useGetProductById = (id) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductByIdAPI(id),
    enabled: !!id,
    retry: false,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5,
  });
};

const getProductByIdAPI = async (id) => {
  console.log("Attempting to fetch product with id: ", id);

  if (!id) {
    throw new Error("Product ID is required");
  }

  try {
    const response = await fetch(`${BASE_URL}/api/products/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error fetching product with id: " + id);
    }

    const res = await response.json();

    return res.data;
  } catch (error) {
    console.error("Product Error:", error);
    throw new Error("Failed to fetch product!");
  }
};