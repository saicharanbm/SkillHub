import React, { useRef, useCallback, useEffect } from "react";
import { useGetAllCoursesQuery } from "../services/queries";

const ShimmerCard = () => (
  <div className=" text-white p-4 rounded-md flex flex-col gap-2 shadow-lg animate-pulse">
    <div className="w-full h-48 bg-gray-400 rounded-md"></div>
    <div className="h-6 bg-gray-400 rounded-md mt-2"></div>
    <div className="h-4 bg-gray-400 rounded-md mt-2"></div>
  </div>
);

const Home = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetAllCoursesQuery();

  useEffect(() => {
    console.log("Fetched data:", data);
  }, [data]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastCourseRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          console.log("Fetching next page...");
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  return (
    <div className="p-4">
      <h1>Courses</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {data?.pages.map((page, pageIndex) =>
          page.courses.map(
            (
              course: {
                id: number;
                title: string;
                description: string;
                price: number;
                thumbnailUrl: string;
              },
              index: number
            ) => {
              console.log("Rendering course:", course);
              const isLast =
                pageIndex === data.pages.length - 1 &&
                index === page.courses.length - 1;
              return (
                <div
                  className="bg-[#1C1C1E] text-white p-4 rounded-md flex flex-col gap-2 shadow-lg"
                  key={course.id}
                  ref={isLast ? lastCourseRef : null}
                >
                  <img
                    className="w-full object-cover rounded-md bg-white"
                    style={{ aspectRatio: "1.77", display: "block" }}
                    src={`https://transcoded-videos.saicharanbm.in/${course.thumbnailUrl}`}
                    alt="Course Thumbnail"
                  />
                  <h1 className="text-lg font-semibold">{course.title}</h1>
                  <p>Price: {course.price}₹</p>
                </div>
              );
            }
          )
        )}
        {(isFetchingNextPage || isLoading) &&
          Array.from({ length: 4 }).map((_, index) => (
            <ShimmerCard key={`shimmer-${index}`} />
          ))}
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
