import { useMutation } from "@tanstack/react-query";
import { signupSchemaType, loginSchemaType, createSectionType } from "../types";
import {
  axiosInstance,
  userLogin,
  userSignup,
  getSignedCourseThumbnailUrl,
  uploadToS3,
  createCourse,
  createSection,
  getSignedContentUrl,
  addContentToSection,
} from "./api";
import axios from "axios";
import { queryClient } from "../main";

export const useSignupMutation = () => {
  return useMutation({
    mutationFn: async (data: signupSchemaType) => {
      try {
        const response = await userSignup(data);
        return response.data.message;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          // Throw the server's error message
          throw error.response.data?.message || "An unknown error occurred";
        }
        // For non-Axios errors
        throw "An unexpected error occurred";
      }
    },
  });
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (data: loginSchemaType) => {
      try {
        const response = await userLogin(data);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          // Throw the server's error message
          throw error.response.data?.message || "An unknown error occurred";
        }
        // For non-Axios errors
        throw "An unexpected error occurred";
      }
    },
    onSuccess: (data: { token: string }) => {
      const { token } = data;
      console.log("login successful");
      // add the access token to axios instance headers
      axiosInstance.defaults.headers.authorization = `Bearer ${token}`;
      //refresh the user data to update the global state

      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
    },
  });
};

export const useCreateCourseMutation = () => {
  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      price: number;
      thumbnail: File;
    }) => {
      try {
        const { thumbnail, title, description, price } = data;
        const { size: thumbnailSize, type: thumbnailType } = thumbnail;
        const response = await getSignedCourseThumbnailUrl({
          thumbnailType,
          thumbnailSize,
        });
        console.log(response.data);
        await uploadToS3(response.data, thumbnail);

        const courseResponse = await createCourse({
          title,
          description,
          price,
          thumbnailUrl: response.data.destination,
        });
        return courseResponse.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          // Throw the server's error message
          throw error.response.data?.message || "An unknown error occurred";
        }
        // For non-Axios errors
        throw "An unexpected error occurred";
      }
    },
  });
};
export const useCreateCourseSectionMutation = () => {
  return useMutation({
    mutationFn: async (data: createSectionType) => {
      try {
        const response = await createSection(data);
        return response.data.message;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          // Throw the server's error message
          throw error.response.data.message || "An unknown error occurred";
        }
        // For non-Axios errors
        throw "An unexpected error occurred";
      }
    },
  });
};

//upload content mutation
export const useUploadContentMutation = () => {
  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      courseId: string;
      sectionId: string;
      content: File;
      thumbnail: File;
    }) => {
      try {
        const { content, title, description, courseId, sectionId, thumbnail } =
          data;
        const { size: contentSize, type: contentType } = content;
        const { size: thumbnailSize, type: thumbnailType } = data.thumbnail;

        const response = await getSignedContentUrl(
          { title, contentType, contentSize, thumbnailType, thumbnailSize },
          courseId,
          sectionId
        );
        console.log(response.data);
        await uploadToS3(response.data.contentSignedUrl, content);
        await uploadToS3(response.data.thumbnailSignedUrl, thumbnail);

        const courseResponse = await addContentToSection(
          {
            title,
            description,
            sectionId,
            contentUrl: response.data.contentSignedUrl.destination,
            thumbnailUrl: response.data.thumbnailSignedUrl.destination,
          },
          courseId
        );
        return courseResponse.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          // Throw the server's error message
          throw error.response.data?.message || "An unknown error occurred";
        }
        // For non-Axios errors
        throw "An unexpected error occurred";
      }
    },
  });
};

export const useLogoutMutation = () => {};
