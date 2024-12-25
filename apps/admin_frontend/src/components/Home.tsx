import React, { useRef, useCallback } from "react";
import { useGetAllCoursesQuery } from "../services/queries";

const Home = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetAllCoursesQuery();

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
    <div className="bg-gray-100 p-4">
      <h1>Courses</h1>
      <ul>
        {data?.pages.map((page, pageIndex) =>
          page.courses.map((course, index) => {
            console.log(course);
            const isLast =
              pageIndex === data.pages.length - 1 &&
              index === page.courses.length - 1;
            return (
              <li
                key={course.id}
                ref={isLast ? lastCourseRef : null} // Attach ref to the last course
              >
                {course.name}
              </li>
            );
          })
        )}
      </ul>
      {isFetchingNextPage && <div>Loading more...</div>}
      {!hasNextPage && <div>No more courses</div>}
    </div>
  );
};

export default Home;
