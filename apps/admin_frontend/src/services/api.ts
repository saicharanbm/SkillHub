import axios from "axios";
import { signupSchemaType } from "../types";

const baseURL = "http://localhost:3000/api/v1";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Correct way to include cookies
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    //get the origoinal request
    const originalRequest = error.config;
    // Check for 401 status and specific error message
    if (
      error.response?.status === 401 &&
      (error.response?.data?.message === "Unauthorized: Token expired" ||
        error.response?.data?.message === "Unauthorized: No token provided") &&
      !originalRequest._retry // Ensure no infinite loops
    ) {
      originalRequest._retry = true;
    }
  }
);

export const userSignup = (data: signupSchemaType) => {
  return axiosInstance.post("/auth/signup", data);
};
