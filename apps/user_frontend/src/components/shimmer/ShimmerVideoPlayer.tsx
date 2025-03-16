const ShimmerVideoPlayer = () => {
  return (
    <div className="p-4 md:p-6  w-full bg-slate-400 rounded-md flex flex-col gap-3 shadow-lg animate-pulse">
      {/* Video Placeholder */}
      <div className="w-full h-72 md:h-80 lg:h-96 bg-[#3F3F3F] rounded-md"></div>

      {/* Controls Placeholder */}
      <div className="flex items-center gap-3 mt-2">
        <div className="w-10 h-10  bg-[#3F3F3F] rounded-full"></div>
        <div className="flex-1 h-4 bg-[#3F3F3F] rounded-md"></div>
        <div className="w-20 h-8 bg-[#3F3F3F] rounded-md"></div>
      </div>
    </div>
  );
};

export default ShimmerVideoPlayer;
