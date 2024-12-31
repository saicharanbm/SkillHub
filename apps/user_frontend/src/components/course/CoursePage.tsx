import { useGetCourseQuery } from "../../services/queries";
import { useParams } from "react-router-dom";
import CourseHeader from "./CourseHeader";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Spinner from "../shimmer/Spinner";
import SectionDropDown from "./section/SectionDropDown";
function CoursePage() {
  const { courseId } = useParams();
  console.log(courseId);
  const navigate = useNavigate();
  const {
    data: course,
    isLoading,
    error,
  } = useGetCourseQuery(courseId as string);

  if (isLoading) {
    return <Spinner text={"Loading course Content ..."} />;
  }
  if (error) {
    return <div className="text-red-500 ">Something went wrong ...</div>;
  }

  // 1) header with title, description and price
  return (
    <div className="w-full min-h-[calc(100vh-4rem)]  py-4 flex">
      {course && (
        <div className="flex-1 bg-[#1C1C1E] pb-10 rounded-md overflow-hidden">
          <CourseHeader
            title={course.title}
            description={course.description}
            price={course.price}
            creatorName={course.creator.fullName}
            thumbnailUrl={course.thumbnailUrl}
          />
          <div className="p-4 w-full flex justify-end ">
            <button
              onClick={() => {
                navigate(`/course/${courseId}/create-section`);
              }}
              className="bg-gradient-to-r from-gray-700 to-[#F89A28] px-5 py-3 text-white font-bold rounded-md hover:from-[#F89A28] hover:to-gray-700 flex items-center gap-2 text-base transition-transform transform hover:scale-105 duration-300"
            >
              <MdOutlineAddCircleOutline size={20} />
              Add Section
            </button>
          </div>
          {course.sections.length > 0 ? (
            course.sections.map(
              (section: { id: string; title: string; contents: [] }) => {
                return (
                  <SectionDropDown
                    key={section.id}
                    thumbnailUrl={course.thumbnailUrl}
                    {...section}
                  />
                );
              }
            )
          ) : (
            <div className="text-red-500 text-center">
              <p className="text-lg md:text-2xl">
                No sections found for this course
              </p>
              <p className="text-sm">Please add a section</p>
            </div>
          )}
          {/* {course} */}
        </div>
      )}
    </div>
  );
}

export default CoursePage;
