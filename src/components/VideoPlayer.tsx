import { useEffect, useRef } from "react";
import Hls from "hls.js";

interface VideoPlayerProps {
  src: string;
  autoPlay?: boolean;
  controls?: boolean;
}

export const VideoPlayer = ({ src, autoPlay = true, controls = true }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    let hls: Hls | null = null;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    } else if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
    } else {
      console.error("HLS não suportado neste navegador");
    }

    return () => {
      hls?.destroy();
    };
  }, [src]);

  return (
    <div className="w-full h-full bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        autoPlay={autoPlay}
        controls={controls}
        className="w-full h-full"
      />
    </div>
  );
};
