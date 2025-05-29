import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  Hook to fetch all cart that matches the user id
*/

export const useGetCart = () => {
  const user = useSelector((state) => state.auth.user) ?? null;

  return useQuery({
    queryKey: ["cart", user?.id],
    queryFn: () => getCartAPI(user),
    enabled: !!user,
    onSuccess: (res) => {
      console.log("Carts data:", res.data);
    },
    staleTime: 1000 * 60 * 5,
  });
};

const getCartAPI = async (user) => {
  if (!user || !user.token) {
    throw new Error("User is not authenticated");
  }

  console.log("Fetching carts with user:", user);

  try {
    const res = await api.get("/api/carts", {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("Carts Error:", error);
    throw new Error("Failed to fetch carts!");
  }
};

// Update cart item quantity API
const updateCartQuantityAPI = async ({ user, itemId, quantity }) => {
  if (!user || !user.token) {
    throw new Error("User is not authenticated");
  }
  try {
    const res = await api.patch(
      `/api/carts/${itemId}`,
      { quantity },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Update Cart Error:", error);
    throw new Error("Failed to update cart item!");
  }
};

// Custom hook for updating cart quantity
export const useUpdateCartQuantity = () => {
  const user = useSelector((state) => state.auth.user) ?? null;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, quantity }) => updateCartQuantityAPI({ user, itemId, quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries(["cart", user?.id]);
    },
  });
};