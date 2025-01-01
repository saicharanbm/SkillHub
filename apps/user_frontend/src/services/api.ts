import axios from "axios";
import { loginSchemaType, signupSchemaType } from "../types";
import { queryClient } from "../main";

export const baseURL = "http://localhost:3000/api/v1/user";

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Correct way to include cookies
});

axiosInstance.interceptors.response.use(
  (response) => response, // Return response for successful requests
  async (error) => {
    const originalRequest = error.config;
    console.log(error.response?.data);

    // Check for 401 status and specific error message
    if (
      error.response?.status === 401 &&
      (error.response?.data?.message === "Unauthorized: Token expired" ||
        error.response?.data?.message === "Unauthorized: No token provided") &&
      !originalRequest._retry // Ensure no infinite loops
    ) {
      console.log("Token expired. Attempting refresh...");
      //if the original fails again we and directly return the error.
      originalRequest._retry = true;

      try {
        const refreshAxios = axios.create({
          baseURL: axiosInstance.defaults.baseURL,
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        const refreshResponse = await refreshAxios.post("/get-token");
        console.log(refreshResponse.data);
        const newAccessToken = refreshResponse.data.token;

        // Update global axios instance and the original request with the new token
        axiosInstance.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest); // Retry original request
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        // Clear cached user data and redirect to login
        queryClient.setQueryData(["auth", "user"], null);
        throw refreshError; // Re-throw to propagate the error
      }
    }

    // Reject other errors
    return Promise.reject(error);
  }
);

export const userSignup = (data: signupSchemaType) => {
  return axiosInstance.post("/signup", data);
};

export const userLogin = (data: loginSchemaType) => {
  return axiosInstance.post("/signin", data);
};
export const fetchUserData = () => {
  return axiosInstance.get("/user-data");
};

export const userLogout = async () => {
  return axiosInstance.post("/signout");
};
export const getAllCourses = async ({ pageParam }: { pageParam: number }) => {
  try {
    const response = await axiosInstance.get(
      `/course?limit=10&cursor=${pageParam}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
};
export const getCourse = async (id: string) => {
  return axiosInstance.get(`/course/${id}`);
};

export const createRazorPayOrder = async (id: string) => {
  return axiosInstance.post(`/course/${id}/create-order`);
};
