function CourseHeader({
  thumbnailUrl,
  title,
  description,
  price,
}: {
  thumbnailUrl: string;
  title: string;
  description: string;
  price: number;
}) {
  return (
    <div className="relative w-full h-[35vh] bg-slate-900 overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <img
        className="absolute inset-0 w-full h-full object-cover opacity-60"
        src={`https://transcoded-videos.saicharanbm.in/${thumbnailUrl}`}
        alt={title}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />

      {/* Content Container */}
      <div className="relative h-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-end h-full pb-8  break-words leading-3">
          <div className="space-y-2 md:space-y-4 max-w-3xl">
            {/* Title Section */}
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 text-sm font-medium text-blue-400 bg-blue-500/10 rounded-full backdrop-blur-sm">
                Course
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight line-clamp-2">
                {title}
              </h1>
            </div>

            {/* Description */}
            <p className="text-lg sm:text-xl text-slate-300 line-clamp-3 font-medium line-clamp-2">
              {description}
            </p>

            {/* Price */}
            <div className="flex items-center gap-2 pt-2">
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
