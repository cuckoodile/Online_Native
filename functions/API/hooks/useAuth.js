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

/* 
  Hook to log in user
*/

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

/* 
  Hook to log out user
*/

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token) => postLogout(token),
    onSuccess: (res) => {
      console.log("Invalidate query: ", res.data.id);
      queryClient.invalidateQueries(["user", res.data.id]);
    },
  });
};

const postLogout = async (token) => {
  console.log("Logout token", token);

  try {
    const res = await api.post("/api/logout", null, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    console.log("Logout response:", res.data);

    return res.data;
  } catch (error) {
    console.error("Logout Error:", error);
    throw new Error("Failed to logout!");
  }
};