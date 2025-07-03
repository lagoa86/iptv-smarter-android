
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
}

export const VideoPlayer = ({ video, onBack, playlist }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedAudioTrack, setSelectedAudioTrack] = useState("default");
  const [selectedSubtitle, setSelectedSubtitle] = useState("off");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Audio tracks simulados
  const audioTracks = [
    { id: "default", name: "Português" },
    { id: "en", name: "English" },
    { id: "es", name: "Español" }
  ];

  // Legendas simuladas
  const subtitleTracks = [
    { id: "off", name: "Desligado" },
    { id: "pt", name: "Português" },
    { id: "en", name: "English" },
    { id: "es", name: "Español" }
  ];

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const updateTime = () => setCurrentTime(videoElement.currentTime);
    const updateDuration = () => {
      if (videoElement.duration && !isNaN(videoElement.duration)) {
        setDuration(videoElement.duration);
      }
    };
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => {
      setIsLoading(false);
      setError("");
    };
    const handleError = () => {
      setIsLoading(false);
      setError("Erro ao carregar o vídeo. Verifique se a URL está correta.");
      console.error("Erro no vídeo:", videoElement.error);
    };

    videoElement.addEventListener('timeupdate', updateTime);
    videoElement.addEventListener('loadedmetadata', updateDuration);
    videoElement.addEventListener('loadstart', handleLoadStart);
    videoElement.addEventListener('canplay', handleCanPlay);
    videoElement.addEventListener('error', handleError);

    // Tentar carregar o vídeo
    videoElement.load();

    return () => {
      videoElement.removeEventListener('timeupdate', updateTime);
      videoElement.removeEventListener('loadedmetadata', updateDuration);
      videoElement.removeEventListener('loadstart', handleLoadStart);
      videoElement.removeEventListener('canplay', handleCanPlay);
      videoElement.removeEventListener('error', handleError);
    };
  }, [video.url]);

  const togglePlay = async () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    try {
      if (isPlaying) {
        videoElement.pause();
      } else {
        await videoElement.play();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error("Erro ao reproduzir:", error);
      setError("Erro ao reproduzir o vídeo.");
    }
  };

  const handleSeek = (value: number[]) => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    videoElement.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    const newVolume = value[0];
    videoElement.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    if (isMuted) {
      videoElement.volume = volume;
      setIsMuted(false);
    } else {
      videoElement.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (videoRef.current?.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const skip = (seconds: number) => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    videoElement.currentTime = Math.max(0, Math.min(duration, videoElement.currentTime + seconds));
  };

  console.log("Reproduzindo vídeo:", video.name, "URL:", video.url);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-background/90 backdrop-blur-sm p-4 flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-foreground hover:text-primary"
        >
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
          src={video.url}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onClick={togglePlay}
          controls={false}
          preload="metadata"
          crossOrigin="anonymous"
        />

        {/* Video Controls Overlay */}
        {showControls && !isLoading && !error && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 flex flex-col justify-between p-6">
            {/* Top Controls */}
            <div className="flex justify-end space-x-2">
              <Select value={selectedAudioTrack} onValueChange={setSelectedAudioTrack}>
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

              <Select value={selectedSubtitle} onValueChange={setSelectedSubtitle}>
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
              <Button
                size="lg"
                variant="ghost"
                onClick={togglePlay}
                className="w-16 h-16 rounded-full bg-black/50 hover:bg-black/70 text-white"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8 ml-1" />
                )}
              </Button>
            </div>

            {/* Bottom Controls */}
            <div className="space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <Slider
                  value={[currentTime]}
                  max={duration || 100}
                  step={1}
                  onValueChange={handleSeek}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-white/80">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => skip(-10)}
                    className="text-white hover:text-primary"
                  >
                    <SkipBack className="w-5 h-5" />
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={togglePlay}
                    className="text-white hover:text-primary"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => skip(10)}
                    className="text-white hover:text-primary"
                  >
                    <SkipForward className="w-5 h-5" />
                  </Button>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Volume Control */}
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={toggleMute}
                      className="text-white hover:text-primary"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </Button>
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      max={1}
                      step={0.1}
                      onValueChange={handleVolumeChange}
                      className="w-20"
                    />
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={toggleFullscreen}
                    className="text-white hover:text-primary"
                  >
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
                  Áudio: {audioTracks.find(t => t.id === selectedAudioTrack)?.name} | 
                  Legenda: {subtitleTracks.find(t => t.id === selectedSubtitle)?.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  URL: {video.url}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
