import { useMutation, useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../config";

/* 
  Hook to fetch all transaction that matches the user id
*/

export const useGetTransaction = (token) => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: () => getTransactionAPI(token),
    enabled: !!token,
    onSuccess: (res) => {
      console.log("Transactions data:", res);
    },
    retry: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 1000 * 60 * 5,
  });
};

const getTransactionAPI = async (token) => {
  if (!token) {
    throw new Error("User is not authenticated");
  }

  console.log("Fetching transactions with token: ", token);

  try {
    const response = await fetch(`${BASE_URL}/api/transactions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if(!response.ok) {
      throw new Error("Error fetching transactions");
    }

    const res = await response.json();
    console.log("Fetched transactions successfully:", res);
    return res.data;
  } catch (error) {
    console.error("Transactions Error:", error);
    throw new Error("Failed to fetch transactions!");
  }
};

export const usePostTransaction = () => {
  return useMutation({
    mutationFn: (data, token) => postTransactionAPI(data, token),
    onSuccess: (res) => {
      console.log("Transaction posted successfully:", res);
    },
  });
};

const postTransactionAPI = async (data) => {
  console.log("Posting transaction with data: ", data?.data, " and token: ", data?.token);
  
  if (!data?.token) {
    throw new Error("User is not authenticated");
  }

  try {
    const response = await fetch(`${BASE_URL}/api/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${data?.token}`,
      },
      body: JSON.stringify(data?.data),
    });

    if (!response.ok) {
      throw new Error("Error posting transaction");
    }

    const res = await response.json();
    return res.data;
  } catch (error) {
    console.error("Post Transaction Error:", error);
    throw new Error("Failed to post transaction!");
  }
};