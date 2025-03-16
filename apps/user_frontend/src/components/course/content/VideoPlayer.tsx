import ShimmerVideoPlayer from "../../shimmer/ShimmerVideoPlayer";

function VideoPlayer() {
  return (
    <div className="w-full min-h-[calc(100vh-4rem)]  py-4 flex flex-wrap">
      <div className="w-full pt-8">
        <ShimmerVideoPlayer />
      </div>
    </div>
  );
}

export default VideoPlayer;
