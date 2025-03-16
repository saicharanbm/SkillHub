import { useLocation, useNavigate } from "react-router-dom";

function ContentContainer({
  thumbnailUrl,
  contentId,
  title,
  description,
  isPurchased = false,
  sectionId,
}: {
  sectionId: string;
  contentId: string;
  thumbnailUrl: string;
  title: string;
  description: string;
  isPurchased: boolean;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div
      className={`content w-full p-4 grid grid-cols-[30%,70%]  gap-4   border-dashed border-2 border-gray-700 rounded-md ${isPurchased && "cursor-pointer"}`}
      onClick={() => {
        if (isPurchased)
          navigate(
            `${location.pathname}${location.pathname.endsWith("/") ? "" : "/"}${sectionId}/${contentId}`
          );
      }}
    >
      <img
        src={`https://transcoded-videos.saicharanbm.in/${thumbnailUrl}`}
        alt=""
        className=" h-24 sm:h-32 md:h-40 rounded-md"
      />
      <div className="w-full h-full flex flex-col gap-3 break-words leading-3">
        <h1 className="text-gray-200 text-lg md:text-xl xl:text-2xl leading-relaxed line-clamp-2">
          {title}
        </h1>
        <p className="text-gray-400 text-sm  leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  );
}

export default ContentContainer;
