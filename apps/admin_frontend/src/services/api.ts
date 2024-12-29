import axios from "axios";
import {
  loginSchemaType,
  signupSchemaType,
  getCourseThumbnailUrlSchemaType,
  createCourseSchemaType,
  createSectionType,
} from "../types";
import { queryClient } from "../main";

const baseURL = "http://localhost:3000/api/v1/admin";

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
  return axiosInstance.get("/user");
};
export const createCourse = (data: createCourseSchemaType) => {
  return axiosInstance.post("/course", data);
};

export const getSignedCourseThumbnailUrl = (
  data: getCourseThumbnailUrlSchemaType
) => {
  return axiosInstance.post("/course/signed-thumbnail-url", data);
};
export const getCourse = async (id: string) => {
  return axiosInstance.get(`/course/${id}`);
};

//Create new section to a course

export const createSection = async (data: createSectionType) => {
  return axiosInstance.post(`/course/${data.courseId}/section`, data);
};

interface S3Response {
  url: string;
  fields: { [key: string]: string };
}

export async function uploadToS3(response: S3Response, file: File) {
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

//get all courses
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
