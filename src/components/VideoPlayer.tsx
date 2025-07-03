import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  SkipBack,
  SkipForward
} from "lucide-react";
import Hls from "hls.js";

interface VideoPlayerProps {
  video: {
    id?: string;
    name: string;
    url: string;
    group: string;
    logo?: string;
  };
  onBack: () => void;
  playlist?: any;
  autoPlay?: boolean;
  controls?: boolean;
}

export const VideoPlayer = ({
  video,
  onBack,
  autoPlay = true,
  controls = false,
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Simulados
  const audioTracks = [
    { id: "default", name: "Português" },
    { id: "en", name: "English" },
    { id: "es", name: "Español" },
  ];
  const subtitleTracks = [
    { id: "off", name: "Desligado" },
    { id: "pt", name: "Português" },
    { id: "en", name: "English" },
    { id: "es", name: "Español" },
  ];

  // Setup HLS
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    // Evento para atualizar tempo e duração
    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => {
      setIsLoading(false);
      setError("");
    };
    const handleError = () => {
      setIsLoading(false);
      setError("Erro ao carregar o vídeo. Verifique a URL.");
      console.error("Erro no vídeo:", video.error);
    };

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);
    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("error", handleError);

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari pode tocar direto o HLS
      video.src = video.url;
    } else if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(video.url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (autoPlay) video.play();
      });
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          setError("Erro fatal no HLS.");
          hls?.destroy();
        }
      });
    } else {
      setError("HLS não suportado neste navegador.");
    }

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("error", handleError);
      hls?.destroy();
    };
  }, [video.url, autoPlay]);

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (isPlaying) {
        video.pause();
      } else {
        await video.play();
      }
      setIsPlaying(!isPlaying);
    } catch {
      setError("Erro ao tentar reproduzir o vídeo.");
    }
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    const vol = value[0];
    video.volume = vol;
    setVolume(vol);
    setIsMuted(vol === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = volume || 1;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(duration, Math.max(0, video.currentTime + seconds));
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-background/90 backdrop-blur-sm p-4 flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-foreground hover:text-primary">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-foreground truncate">{video.name}</h1>
          <p className="text-sm text-muted-foreground">{video.group}</p>
        </div>
      </div>

      {/* Video Container */}
      <div className="flex-1 relative bg-black">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Carregando...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="text-white text-center">
              <p className="mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Tentar novamente
              </Button>
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onClick={togglePlay}
          controls={false}
          preload="metadata"
          crossOrigin="anonymous"
        />

        {/* Controls Overlay */}
        {showControls && !isLoading && !error && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 flex flex-col justify-between p-6">
            {/* Controls Top */}
            <div className="flex justify-end space-x-2">
              <Select value={"default"} onValueChange={() => {}}>
                <SelectTrigger className="w-32 bg-black/50 text-white border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {audioTracks.map((track) => (
                    <SelectItem key={track.id} value={track.id}>
                      {track.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={"off"} onValueChange={() => {}}>
                <SelectTrigger className="w-32 bg-black/50 text-white border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {subtitleTracks.map((track) => (
                    <SelectItem key={track.id} value={track.id}>
                      {track.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Center Play Button */}
            <div className="flex justify-center">
              <Button size="lg" variant="ghost" onClick={togglePlay} className="w-16 h-16 rounded-full bg-black/50 hover:bg-black/70 text-white">
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
              </Button>
            </div>

            {/* Bottom Controls */}
            <div className="space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <Slider value={[currentTime]} max={duration || 100} step={1} onValueChange={handleSeek} className="w-full" />
                <div className="flex justify-between text-sm text-white/80">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button size="sm" variant="ghost" onClick={() => skip(-10)} className="text-white hover:text-primary">
                    <SkipBack className="w-5 h-5" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={togglePlay} className="text-white hover:text-primary">
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => skip(10)} className="text-white hover:text-primary">
                    <SkipForward className="w-5 h-5" />
                  </Button>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Volume Control */}
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="ghost" onClick={toggleMute} className="text-white hover:text-primary">
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </Button>
                    <Slider value={[isMuted ? 0 : volume]} max={1} step={0.1} onValueChange={handleVolumeChange} className="w-20" />
                  </div>
                  <Button size="sm" variant="ghost" onClick={toggleFullscreen} className="text-white hover:text-primary">
                    <Maximize className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Video Info */}
      <div className="bg-background/90 backdrop-blur-sm p-4">
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">{video.name}</h2>
                <p className="text-muted-foreground">Categoria: {video.group}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Áudio: {audioTracks[0].name} | Legenda: {subtitleTracks[0].name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">URL: {video.url}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
