import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../config";

export function useUser(id, token) {
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
        Authorization: `Bearer ${token}`,
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

export function usePatchUser() {
  return useMutation({
    mutationFn: ({ data, token, user_id }) =>
      patchUserAPI(token, data, user_id),
    mutationKey: ["user"],
    onSuccess: (res) => {
      console.log("User updated successfully:", res);
    },
    onError: (error) => {
      console.error("Error updating user:", error);
    },
  });
}

const patchUserAPI = async (token, data, user_id) => {
  if (!token || !data || !user_id) {
    console.error("Token, data, or user_id is missing");
    throw new Error("Token, data, or user_id is missing");
  }

  console.log(
    "Attempt to update user with token: ",
    token,
    "data: ",
    data,
    "user_id: ",
    user_id
  );

  try {
    const response = await fetch(`${BASE_URL}/api/users/${user_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Error updating user id: " + user_id);
    }

    const res = await response.json();
    console.log("User updated successfully:", res);
    return res.data;
  } catch (error) {
    console.error("Failed to update user data:", error);
    throw error;
  }
};

export function usePostUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => postUserAPI(data),
    mutationKey: ["user"],
    onSuccess: (res) => {
      queryClient.invalidateQueries(["user"]);
      console.log("User created successfully:", res);
    },
    onError: (error) => {
      console.error("Error creating user:", error);
    },
  });
}

const postUserAPI = async (data) => {
  if (!data) {
    console.error("Data is missing");
    throw new Error("Data is missing");
  }

  console.log("Attempt to create user with data: ", data);

  try {
    const response = await fetch(`${BASE_URL}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Error creating user");
    }

    const res = await response.json();
    console.log("User created successfully:", res);
    return res.data;
  } catch (error) {
    console.error("Failed to create user:", error);
    throw error;
  }
};
