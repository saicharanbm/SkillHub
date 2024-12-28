import { useGetCourseQuery } from "../../services/queries";
import { useParams } from "react-router-dom";
function CoursePage() {
  const { id } = useParams();
  const {
    data: course,
    isLoading,
    isFetching,
  } = useGetCourseQuery(id as string);

  // 1) header with title, description and price
  return (
    <div>
      <h1 className="text-3xl font-bold text-white">Course</h1>
      {isFetching && <p className="text-lg text-gray-400">Fetching...</p>}
      {isLoading && <p className="text-lg text-gray-400">Loading...</p>}
      {course && (
        <div>
          <h2 className="text-2xl font-bold text-white">{course.title}</h2>
          <p className="text-lg text-gray-400">{course.description}</p>
          <p className="text-lg text-gray-400">Price: {course.price}</p>
        </div>
      )}
    </div>
  );
}

export default CoursePage;
