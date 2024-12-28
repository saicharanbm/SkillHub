import { useRef, useCallback } from "react";
import { useGetAllCoursesQuery } from "../services/queries";
import ShimmerCard from "./shimmer/ShimmerCard";
import CourseCard from "./course/CourseCard";
import useIsDesktop from "../hooks/useIsDesktop";

const Home = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetAllCoursesQuery();
  const isDesktop = useIsDesktop();

  const observer = useRef<IntersectionObserver | null>(null);
  const lastCourseRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  return (
    <div className="w-full p-4">
      {/* <h1>Courses</h1> */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {data?.pages.map((page, pageIndex) =>
          page.courses.map(
            (
              course: {
                id: string;
                title: string;
                description: string;
                price: number;
                thumbnailUrl: string;
              },
              index: number
            ) => {
              const isLast =
                pageIndex === data.pages.length - 1 &&
                index === page.courses.length - 1;
              return (
                <CourseCard
                  key={course.id}
                  course={course}
                  isLast={isLast}
                  lastCourseRef={lastCourseRef}
                />
              );
            }
          )
        )}
        {(isFetchingNextPage || isLoading) &&
          Array.from({ length: parseInt(`${isDesktop ? 10 : 4}`, 10) }).map(
            (_, index) => <ShimmerCard key={index} />
          )}
      </div>
      {!isLoading && !hasNextPage && (
        <div className="text-center text-lg text-white pt-3">
          No more courses to load
        </div>
      )}
    </div>
  );
};

export default Home;
