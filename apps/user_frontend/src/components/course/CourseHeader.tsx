import { Link } from "react-router-dom";
function CourseHeader({
  thumbnailUrl,
  title,
  description,
  creatorName,
  price,
}: {
  thumbnailUrl: string;
  title: string;
  description: string;
  creatorName: string;

  price: number;
}) {
  return (
    <div className="relative w-full min-h-56 md:min-h-60 lg:min-h-64 py-8 bg-slate-900 overflow-hidden">
      <img
        className="absolute inset-0 w-full h-full object-cover opacity-60"
        src={`https://transcoded-videos.saicharanbm.in/${thumbnailUrl}`}
        alt={title}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />

      <div className="relative h-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-end h-full pb-8  break-words leading-3">
          <div className=" space-y-2  md:space-y-3 max-w-3xl">
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 text-sm font-medium text-blue-400 bg-blue-500/10 rounded-full backdrop-blur-sm">
                Course
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight line-clamp-1">
                {title}
              </h1>
            </div>

            <p className="text-lg sm:text-xl text-slate-300 font-medium line-clamp-1">
              {description}
            </p>

            <div className=" flex gap-2 items-center">
              <span className="text-slate-400">by:</span>

              <Link
                to={"/"}
                className="text-xl font-bold text-green-400 underline hover:text-green-600"
              >
                {creatorName}{" "}
              </Link>
            </div>

            <div className="flex items-center gap-2 ">
              <span className="text-slate-400">Price:</span>
              <span className="text-2xl font-bold text-green-400">
                ₹ {(price / 100).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseHeader;
