
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tv, Film, Monitor, Settings } from "lucide-react";
import { LoadM3U } from "@/components/LoadM3U";
import { TVChannels } from "@/components/TVChannels";
import { Movies } from "@/components/Movies";
import { Series } from "@/components/Series";
import { VideoPlayer } from "@/components/VideoPlayer";
import { SettingsPanel } from "@/components/SettingsPanel";

const Index = () => {
  const [playlist, setPlaylist] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  const handlePlaylistLoad = (playlistData) => {
    setPlaylist(playlistData);
    console.log("Playlist carregada:", playlistData);
  };

  const handleVideoSelect = (video) => {
    setCurrentVideo(video);
    console.log("Vídeo selecionado:", video);
  };

  const handleBackToList = () => {
    setCurrentVideo(null);
  };

  if (!playlist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
        <LoadM3U onPlaylistLoad={handlePlaylistLoad} />
      </div>
    );
  }

  if (currentVideo) {
    return (
      <VideoPlayer 
        video={currentVideo} 
        onBack={handleBackToList}
        playlist={playlist}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Tv className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">IPTV Player</h1>
              <p className="text-sm text-muted-foreground">Sua experiência de streaming</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {showSettings && (
          <div className="mb-6 animate-fade-in">
            <SettingsPanel onClose={() => setShowSettings(false)} />
          </div>
        )}

        {/* Main Content */}
        <Tabs defaultValue="tv" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-secondary/50 backdrop-blur-sm">
            <TabsTrigger value="tv" className="flex items-center space-x-2">
              <Tv className="w-4 h-4" />
              <span>TV ao Vivo</span>
            </TabsTrigger>
            <TabsTrigger value="movies" className="flex items-center space-x-2">
              <Film className="w-4 h-4" />
              <span>Filmes</span>
            </TabsTrigger>
            <TabsTrigger value="series" className="flex items-center space-x-2">
              <Monitor className="w-4 h-4" />
              <span>Séries</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tv" className="animate-fade-in">
            <TVChannels 
              channels={playlist.channels || []} 
              onChannelSelect={handleVideoSelect}
            />
          </TabsContent>

          <TabsContent value="movies" className="animate-fade-in">
            <Movies 
              movies={playlist.movies || []} 
              onMovieSelect={handleVideoSelect}
            />
          </TabsContent>

          <TabsContent value="series" className="animate-fade-in">
            <Series 
              series={playlist.series || []} 
              onSeriesSelect={handleVideoSelect}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
