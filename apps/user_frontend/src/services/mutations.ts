import { useMutation } from "@tanstack/react-query";
import { signupSchemaType, loginSchemaType } from "../types";
import { axiosInstance, userLogin, userSignup, userLogout } from "./api";
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

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: async () => {
      try {
        const response = await userLogout();
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
    onSuccess: () => {
      //clear the query cache
      queryClient.clear();
      //clear the axios instance auth headers
      axiosInstance.defaults.headers.authorization = "";
    },
  });
};
