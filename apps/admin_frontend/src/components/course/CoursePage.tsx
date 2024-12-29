import { useState } from "react";
import { useGetCourseQuery } from "../../services/queries";
import { useParams } from "react-router-dom";
import CourseHeader from "./CourseHeader";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
function CoursePage() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

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
              className="bg-gradient-to-r from-gray-700 to-[#F89A28] px-5 py-3 text-white font-bold rounded-md hover:from-[#F89A28] hover:to-gray-700 flex items-center gap-2 text-base transition-transform transform hover:scale-105 duration-300"
            >
              <MdOutlineAddCircleOutline size={20} />
              Add Section
            </button>
          </div>
          <div className="section-container w-full p-4 md:px-8 lg:px-12">
            {/* Section Header */}
            <div
              className={`section w-full h-14 bg-gradient-to-r from-gray-700 to-gray-800/90 ${
                isOpen ? "rounded-t-lg" : "rounded-lg"
              } flex items-center justify-between cursor-pointer px-6 transition-all duration-300 shadow-md hover:shadow-lg border border-gray-600`}
              onClick={toggleDropdown}
            >
              <span className="text-white font-semibold text-lg">
                Section Header
              </span>
              <span
                className={`text-white transform transition-transform duration-300 ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
              >
                ▼
              </span>
            </div>

            {/* Dropdown Content */}
            {isOpen && (
              <div className="dropdown-content bg-gray-900 rounded-b-lg p-6 shadow-lg border-t border-gray-700">
                <div className="w-full flex justify-end mb-4">
                  <button className="bg-gradient-to-r from-gray-700 to-[#F89A28] px-5 py-2 text-white font-medium rounded-md hover:from-[#F89A28] hover:to-gray-700 flex items-center gap-2 text-base transition-transform transform hover:scale-105 duration-300">
                    <span>Add Content</span>
                  </button>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  This is the dropdown content. You can add anything here!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CoursePage;
