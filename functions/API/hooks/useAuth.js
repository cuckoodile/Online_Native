import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "../config";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => postLogin(data),
    onSuccess: (res) => {
      console.log("Invalidate query: ", res.data.id);
      queryClient.invalidateQueries(["user", res.data.id]);
    },
  });
};

const postLogin = async (data) => {
  console.log("Logging in with:", data);

  try {
    const res = await api.post("/api/login", data);
    console.log("Login response:", res.data);

    return res.data;
  } catch (error) {
    console.error("Login Error:", error);
    throw new Error("Failed to login!");
  }
};
