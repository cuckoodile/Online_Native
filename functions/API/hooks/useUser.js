import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../config";

export default function useUser(id, token) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserAPI(id, token),
    onSuccess: (data) => {
      console.log("User data fetched successfully:", data);
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    enabled: !!id,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: false,
  });
}

const getUserAPI = async (id, token) => {
  console.log("Attempt to fetch user id: ", id, "token: ", token);

  try {
    const response = await fetch(`${BASE_URL}/api/users/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      },
    });

    if (!response.ok) {
      throw new Error("Error fetching user id: " + id);
    }

    const res = await response.json();

    console.log("Fetched success in user id: ", id);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw error;
  }
};
