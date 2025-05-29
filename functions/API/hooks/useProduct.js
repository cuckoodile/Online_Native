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
