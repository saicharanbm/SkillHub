import { useRef, useCallback, useEffect, useState } from "react";
import { useGetAllCoursesQuery } from "../services/queries";
import ShimmerCard from "./shimmer/ShimmerCard";
import CourseCard from "./course/CourseCard";

const Home = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetAllCoursesQuery();
  const [shimmerCount, setShimmerCount] = useState(4);

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

  useEffect(() => {
    const calculateShimmerCount = () => {
      const gridElement = document.querySelector(".grid");
      if (gridElement) {
        const gridStyles = window.getComputedStyle(gridElement);
        const gridGap = parseFloat(gridStyles.gap || "0");
        const gridTemplateColumns = gridStyles.getPropertyValue(
          "grid-template-columns"
        );
        const cardsPerRow = gridTemplateColumns.split(" ").length;
        const cardHeight = 250;
        const visibleHeight = window.innerHeight;
        const rowsVisible = Math.ceil(visibleHeight / (cardHeight + gridGap));
        const totalVisibleCards = cardsPerRow * rowsVisible;

        console.log("Rows visible:", rowsVisible);
        console.log("Cards per row:", cardsPerRow);
        console.log("Total cards visible:", totalVisibleCards);

        setShimmerCount(totalVisibleCards);
      }
    };

    calculateShimmerCount();
    window.addEventListener("resize", calculateShimmerCount);
    return () => {
      window.removeEventListener("resize", calculateShimmerCount);
    };
  }, []);

  return (
    <div className="p-4">
      {/* <h1>Courses</h1> */}
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
              const isLast =
                pageIndex === data.pages.length - 1 &&
                index === page.courses.length - 1;
              return (
                <CourseCard
                  key={course.id}
                  course={course}
                  isLast={index === courses.length - 1}
                  lastCourseRef={lastCourseRef}
                />
              );
            }
          )
        )}
        {(isFetchingNextPage || isLoading) &&
          Array.from({ length: shimmerCount }).map((_, index) => (
            <ShimmerCard key={index} />
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
