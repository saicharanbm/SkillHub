import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import ContentContainer from "./ContentContainer";
function SectionDropDown({
  id,
  title,
  contents,
}: {
  id: string;
  thumbnailUrl: string;
  title: string;
  contents: [];
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
              onClick={() =>
                navigate(`/course/${courseId}/section/${id}/upload-content`)
              }
              className="bg-gradient-to-r from-gray-700 to-[#F89A28] px-5 py-2 text-white font-medium rounded-md hover:from-[#F89A28] hover:to-gray-700 flex items-center gap-2 text-base transition-transform transform hover:scale-105 duration-300"
            >
              <span>Add Content</span>
            </button>
          </div>
          {contents.length > 0 ? (
            <div className="conten-container w-full flex flex-col gap-4">
              {contents.map(
                (content: {
                  id: string;
                  title: string;
                  description: string;
                  thumbnailUrl: string;
                }) => (
                  <ContentContainer key={content.id} {...content} />
                )
              )}
            </div>
          ) : (
            <div className="text-red-500 text-center border-dashed border-2 border-gray-700 rounded-md p-4">
              <p className="text-lg md:text-2xl">
                No Contents found for this Section
              </p>
              <p className="text-sm">Please add some contents</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SectionDropDown;
