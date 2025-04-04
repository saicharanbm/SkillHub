import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchUserData, getAllCourses, getCourse } from "./api";

export const useAuthQuery = () => {
  return useQuery({
    queryKey: ["auth", "user"],
    queryFn: async () => {
      const response = await fetchUserData();
      return response.data;
    },
    retry: false,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useGetAllCoursesQuery = () => {
  return useInfiniteQuery({
    queryKey: ["courses"],
    queryFn: getAllCourses,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
};

export const useGetCourseQuery = (id: string) => {
  return useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      const response = await getCourse(id);
      return response.data;
    },
  });
};
