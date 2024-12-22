import axios from "axios";
import { loginSchemaType, signupSchemaType } from "../types";
import { queryClient } from "../main";

const baseURL = "http://localhost:3000/api/v1";

export const axiosInstance = axios.create({
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
      try {
        // Attempt to refresh the token
        const refreshResponse = await axiosInstance.post("/auth/get-token");

        const newAccessToken = refreshResponse.data.message.token;

        // Set new access token in headers for the future requests
        axiosInstance.defaults.headers.Authorization = `Bearer ${newAccessToken}`;

        // Set new access token in headers to the original request
        //even though we have set the toakes in the global axios instance it is important to add it to the original request
        //because Global Defaults Do Not Affect Already Prepared Requests
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry the original request with the new token
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        // Clear cached user data if refresh fails
        queryClient.setQueryData(["auth", "user"], null);

        throw refreshError; // Re-throw the error to notify the caller
      }
    }
    // Reject any other errors
    return Promise.reject(error);
  }
);

export const userSignup = (data: signupSchemaType) => {
  return axiosInstance.post("/auth/admin/signup", data);
};

export const userLogin = (data: loginSchemaType) => {
  return axiosInstance.post("/auth/admin/signup", data);
};
export const fetchUserData = () => {
  return axiosInstance.get("/auth/admin/user");
};
