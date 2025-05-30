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

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => postAddToCartAPI(data),
    onSuccess: (res) => {
      console.log("Item added to cart successfully:", res);
      queryClient.invalidateQueries(["carts"]);
    },
    retry: false,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5,
  });
};

const postAddToCartAPI = async (data) => {
  console.log("CART API DATA: ", data);

  try {
    const response = await fetch(`${BASE_URL}/api/carts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${data?.auth?.token}`,
      },
      body: JSON.stringify({
        user_id: data?.auth?.id,
        product_id: data?.product_id,
        quantity: data?.quantity,
      }),
    });

    if (!response.ok) {
      throw new Error("Error adding item to cart");
    }

    const res = await response.json();

    console.log("CART API DATA RESPONSE: ", res);
    return res.data;
  } catch (error) {
    console.error("Add to Cart Error:", error);
    throw new Error("Failed to add item to cart!");
  }
};

export const useDeleteCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => deleteCartItemAPI(data),
    onSuccess: (res) => {
      console.log("Item deleted from cart successfully:", res);
      queryClient.invalidateQueries(["carts"]);
    },
    retry: false,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5,
  });
}

const deleteCartItemAPI = async (data) => {
  console.log("CART API DATA: ", data);

  try {
    const response = await fetch(`${BASE_URL}/api/carts`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${data?.token}`,
      },
      body: JSON.stringify({
        ids: data?.cart_ids,
      }),
    });

    if (!response.ok) {
      throw new Error("Error deleting item from cart");
    }

    const res = await response.json();

    console.log("CART API DATA RESPONSE: ", res);
    return res.data;
  } catch (error) {
    console.error("Delete Cart Item Error:", error);
    throw new Error("Failed to delete item from cart!");
  }
};