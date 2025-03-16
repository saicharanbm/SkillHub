import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

interface VideoSource {
  label: string;
  src: string;
}

function VideoPlayer() {
  const sources: VideoSource[] = [
    {
      label: "1080p",
      src: "https://transcoded-videos.saicharanbm.in/course/admin/cm53kt0bb0000lhmrmfb9k540/cm543vkao0007lh7pb9lmry8p/cm5jtrlr60001lh8kp7h3kti9/cm87uc2f00001lhboe1lux1us/video/transcoded/1080p.m3u8",
    },
    {
      label: "720p",
      src: "https://transcoded-videos.saicharanbm.in/course/admin/cm53kt0bb0000lhmrmfb9k540/cm543vkao0007lh7pb9lmry8p/cm5jtrlr60001lh8kp7h3kti9/cm87uc2f00001lhboe1lux1us/video/transcoded/720p.m3u8",
    },
    {
      label: "360p",
      src: "https://transcoded-videos.saicharanbm.in/course/admin/cm53kt0bb0000lhmrmfb9k540/cm543vkao0007lh7pb9lmry8p/cm5jtrlr60001lh8kp7h3kti9/cm87uc2f00001lhboe1lux1us/video/transcoded/360p.m3u8",
    },
  ];

  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsInstance = useRef<Hls | null>(null);
  const [currentSource, setCurrentSource] = useState(sources[0]);
  const [currentQuality, setCurrentQuality] = useState<string>("Auto");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (hlsInstance.current) {
      hlsInstance.current.destroy(); // Clean previous instance
    }

    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsInstance.current = hls;
      hls.loadSource(currentSource.src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        hls.currentLevel = -1; // Enable auto quality
        setCurrentQuality("Auto");
        video.play().catch((err) => console.error("Autoplay failed", err));
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        const quality =
          data.level === -1 ? "Auto" : `${hls.levels[data.level].height}p`;
        setCurrentQuality(quality);
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = currentSource.src;
      video.load();
    }
  }, [currentSource]);

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-gray-900 rounded-lg shadow-md">
      {/* Video Player */}
      <video
        ref={videoRef}
        controls
        className="w-full h-auto rounded-md bg-black shadow-lg"
      />

      {/* Quality Selector */}
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="text-white text-sm">
          <strong>Current Quality:</strong> {currentQuality}
        </div>
        <div className="flex items-center mt-2 sm:mt-0">
          <label className="mr-2 text-white text-sm">Quality:</label>
          <select
            className="p-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
            value={currentSource.src}
            onChange={(e) =>
              setCurrentSource(
                sources.find((src) => src.src === e.target.value) || sources[0]
              )
            }
          >
            <option value="auto">Auto</option>
            {sources.map((source) => (
              <option key={source.label} value={source.src}>
                {source.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;
