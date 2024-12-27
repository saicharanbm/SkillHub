import { useRef, useCallback, useEffect, useState } from "react";
import { useGetAllCoursesQuery } from "../services/queries";

const ShimmerCard = () => (
  <div className=" text-white p-4 rounded-md flex flex-col gap-2 shadow-lg animate-pulse">
    <div className="w-full h-48 bg-[#3F3F3F] rounded-md"></div>
    <div className="h-6 bg-[#3F3F3F] rounded-md mt-2"></div>
    <div className="h-4 bg-[#3F3F3F] rounded-md mt-2"></div>
  </div>
);

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
                <div
                  className="bg-[#030712] text-white pb-4 overflow-hidden rounded-md flex flex-col gap-2 shadow-lg border-2 border-[#1F2937] cursor-pointer"
                  key={course.id}
                  ref={isLast ? lastCourseRef : null}
                >
                  <img
                    className="w-full object-cover  bg-white"
                    style={{ aspectRatio: "1.77", display: "block" }}
                    src={`https://transcoded-videos.saicharanbm.in/${course.thumbnailUrl}`}
                    alt="Course Thumbnail"
                  />
                  <h1 className="text-lg  font-semibold" title={course.title}>
                    {course.title}{" "}
                  </h1>
                  <p>Price: ₹ {course.price / 100}</p>
                </div>
              );
            }
          )
        )}
        {(isFetchingNextPage || isLoading) &&
          Array.from({ length: shimmerCount }).map((_, index) => (
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
