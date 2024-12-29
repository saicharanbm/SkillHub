import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
function SectionDropDown({
  thumbnailUrl,
  title,
}: {
  thumbnailUrl: string;
  title: string;
}) {
  const { courseId } = useParams();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const navigate = useNavigate();
  return (
    <div className="section-container w-full px-4 py-2 md:px-8 lg:px-12">
      {/* Section Header */}
      <div
        className={`section w-full h-14 bg-gradient-to-r from-gray-700 to-gray-800/90 ${
          isOpen ? "rounded-t-lg" : "rounded-lg"
        } flex items-center justify-between cursor-pointer px-6 transition-all duration-300 shadow-md hover:shadow-lg border border-gray-600`}
        onClick={toggleDropdown}
      >
        <span className="text-white font-semibold text-lg">{title}</span>
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
            <button
              onClick={() => navigate(`/course/${courseId}/create-content`)}
              className="bg-gradient-to-r from-gray-700 to-[#F89A28] px-5 py-2 text-white font-medium rounded-md hover:from-[#F89A28] hover:to-gray-700 flex items-center gap-2 text-base transition-transform transform hover:scale-105 duration-300"
            >
              <span>Add Content</span>
            </button>
          </div>
          <div className="conten-container w-full flex flex-col gap-4">
            <div className="content w-full p-4 grid grid-cols-[30%,70%]  gap-4   border-dashed border-2 border-gray-700 rounded-md">
              <img
                src={`https://transcoded-videos.saicharanbm.in/${thumbnailUrl}`}
                alt=""
                className=" h-24 sm:h-32 md:h-40 rounded-md"
              />
              <div className="w-full h-full flex flex-col gap-3 break-words leading-3">
                <h1 className="text-gray-200 text-lg md:text-xl xl:text-2xl leading-relaxed line-clamp-2">
                  This is the dropdown content. You can add anything here!
                </h1>
                <p className="text-gray-400 text-sm  leading-relaxed line-clamp-2">
                  This is the dropdown content. You can add anything here!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SectionDropDown;
