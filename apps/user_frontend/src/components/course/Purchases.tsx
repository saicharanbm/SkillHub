import useIsDesktop from "../../hooks/useIsDesktop";
import { useGetPurchasedCoursesQuery } from "../../services/queries";
import ShimmerCard from "../shimmer/ShimmerCard";
import CourseCard from "./CourseCard";

function Purchases() {
  const { data, isLoading } = useGetPurchasedCoursesQuery();
  const isDesktop = useIsDesktop();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: isDesktop ? 10 : 4 }).map((_, index) => (
          <ShimmerCard key={index} />
        ))}
      </div>
    );
  }

  // Ensure data exists and has valid content
  if (!data || !data.data?.length) {
    return <div className="w-full p-4 text-center">No courses found.</div>;
  }

  return (
    <div className="w-full p-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {data.data.map(({ course }) => {
          if (!course) {
            console.error("Invalid course data:", course);
            return null;
          }

          const { id, title, thumbnailUrl } = course;

          return <CourseCard key={id} course={{ id, title, thumbnailUrl }} />;
        })}
      </div>
    </div>
  );
}

export default Purchases;
