import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_URL } from "../config";

/* 
  Hook to fetch all cart that matches the user id
*/

export const useGetCart = (id, token) => {
  return useQuery({
    queryKey: ["carts"],
    queryFn: () => getCartAPI(id, token),
    onSuccess: (res) => {
      console.log("Carts data:", res);
    },
    enabled: !!id && !!token,
    retry: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 1000 * 60 * 5,
  });
};

const getCartAPI = async (id, token) => {
  if (!id || !token) {
    throw new Error("User is not authenticated");
  }

  try {
    const response = await fetch(`${BASE_URL}/api/carts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error fetching carts for user id: " + id);
    }

    const res = await response.json();
    return res.data;
  } catch (error) {
    console.error("Carts Error:", error);
    throw new Error("Failed to fetch carts!");
  }
};

// Update cart item quantity API
const updateCartQuantityAPI = async ({ token, itemId, quantity }) => {

  if (!token) {
    throw new Error("User is not authenticated");
  }

  try {
    const response = await fetch(`${BASE_URL}/api/carts/${itemId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) {
      throw new Error("Error updating cart item with id: " + itemId);
    }

    const res = await response.json();
    return res.data;
  } catch (error) {
    console.error("Update Cart Error:", error);
    throw new Error("Failed to update cart item!");
  }
};

// Custom hook for updating cart quantity
export const useUpdateCartQuantity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ token, itemId, quantity }) =>
      updateCartQuantityAPI({ token, itemId, quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries(["carts"]);
      console.log("Cart updated successfully");
    },
  });
};
