import { useGetCourseQuery } from "../../services/queries";
import { useParams } from "react-router-dom";
import CourseHeader from "./CourseHeader";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
function CoursePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: course } = useGetCourseQuery(id as string);

  // 1) header with title, description and price
  return (
    <div className="w-full min-h-[100vh-4rem] py-4">
      {course && (
        <div className="w-full  bg-[#1C1C1E] rounded-md overflow-hidden">
          <CourseHeader
            title={course.title}
            description={course.description}
            price={course.price}
            thumbnailUrl={course.thumbnailUrl}
          />
          <div className="p-4 w-full flex justify-end ">
            <button
              onClick={() => {
                navigate(`/course/${id}/create-section`);
              }}
              className="bg-[#F89A28] px-4 py-2 text-[#1C1C1E] font-semibold rounded-sm hover:opacity-70 flex  items-center gap-2 text-lg  justify-center cursor-pointer"
            >
              <MdOutlineAddCircleOutline />
              Add Section
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CoursePage;
