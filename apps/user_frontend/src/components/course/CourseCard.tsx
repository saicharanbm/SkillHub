import React from "react";
import { useNavigate } from "react-router-dom";

interface CourseCardProps {
  course: {
    id: string;
    thumbnailUrl: string;
    title: string;
    price?: number;
  };
  isLast?: boolean;
  lastCourseRef?: React.Ref<HTMLDivElement>;
}

const CourseCard = ({ course, isLast, lastCourseRef }: CourseCardProps) => {
  const navigate = useNavigate();
  return (
    <div
      className="bg-[#030712] text-white pb-4 overflow-hidden rounded-md flex flex-col gap-2 shadow-lg border-2 border-[#1C1C1E] cursor-pointer transition-transform duration-300 transform hover:scale-105"
      ref={isLast ? lastCourseRef : null}
      onClick={() => {
        navigate(`/course/${course.id}`);
      }}
    >
      <img
        className="w-full object-cover bg-white"
        style={{ aspectRatio: "1.77", display: "block" }}
        src={`https://transcoded-videos.saicharanbm.in/${course.thumbnailUrl}`}
        alt="Course Thumbnail"
      />
      <div className="px-4 overflow-hidden flex flex-col gap-1">
        <h1
          className="text-lg text-gray-300 font-semibold line-clamp-2 break-words leading-6"
          title={course.title}
        >
          {course.title}
        </h1>
        {course.price && (
          <p className="text-sm text-gray-400">
            Price: <span>₹ {course.price / 100}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
