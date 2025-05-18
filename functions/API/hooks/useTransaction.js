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
  Hook to fetch all transaction that matches the user id
*/

export const useGetTransaction = () => {
  const user = useSelector((state) => state.auth.user) ?? null;

  return useQuery({
    queryKey: ["transactions", user?.id],
    queryFn: () => getTransactionAPI(user),
    enabled: !!user,
    onSuccess: (res) => {
      console.log("Transactions data:", res.data);
    },
    staleTime: 1000 * 60 * 5,
  });
};

const getTransactionAPI = async (user) => {
  if (!user || !user.token) {
    throw new Error("User is not authenticated");
  }

  console.log("Fetching transactions with user: ", user);

  try {
    const res = await api.get("/api/transactions", null, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Transactions Error:", error);
    throw new Error("Failed to fetch transactions!");
  }
};