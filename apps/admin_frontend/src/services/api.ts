import axios from "axios";
import {
  loginSchemaType,
  signupSchemaType,
  getCourseAvatarUrlSchemaType,
} from "../types";
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

        const refreshResponse = await refreshAxios.post("/admin/get-token");
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
  return axiosInstance.post("/admin/signup", data);
};

export const userLogin = (data: loginSchemaType) => {
  return axiosInstance.post("/admin/signin", data);
};
export const fetchUserData = () => {
  return axiosInstance.get("/admin/user");
};

export const getSignedAvatarUrl = (data: getCourseAvatarUrlSchemaType) => {
  return axiosInstance.post("/admin/course/signed-avatar-url", data);
};

export async function uploadToS3(response: any, file: File): Promise<void> {
  const { url, fields } = response;

  // Create a FormData object
  const formData = new FormData();

  // Append all fields from the response
  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, value as string);
  });

  // Append the file to be uploaded
  formData.append("file", file);

  // Send the form data to S3
  try {
    const s3Response = await axios.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (s3Response.status === 204) {
      console.log("File uploaded successfully");
    } else {
      console.error(
        "Failed to upload file:",
        s3Response.status,
        s3Response.data
      );
    }
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}
