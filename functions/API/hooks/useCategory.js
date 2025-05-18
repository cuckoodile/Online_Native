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
  Hook to fetch all categories
*/

export const useGetCategory = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategoryAPI(),
    // refetchOnReconnect: true,
    // refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5,
    onSuccess: (res) => {
      console.log("Category data:", res.data);
    },
  });
};

const getCategoryAPI = async () => {
  try {
    const res = await api.get("/api/categories");

    return res.data;
  } catch (error) {
    console.error("Categories Error:", error);
    throw new Error("Failed to fetch categories!");
  }
};
