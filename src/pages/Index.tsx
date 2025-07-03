
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Tv, Film, Monitor, Settings, Calendar } from "lucide-react";
import { IPTVLogin } from "@/components/IPTVLogin";
import { LoadM3U } from "@/components/LoadM3U";
import { TVChannels } from "@/components/TVChannels";
import { Movies } from "@/components/Movies";
import { Series } from "@/components/Series";
import { VideoPlayer } from "@/components/VideoPlayer";
import { SettingsPanel } from "@/components/SettingsPanel";
import { EPGGuide } from "@/components/EPGGuide";

interface IPTVCredentials {
  username: string;
  password: string;
  server: string;
  port: string;
}

const Index = () => {
  const [authMode, setAuthMode] = useState<'login' | 'm3u' | 'authenticated'>('login');
  const [credentials, setCredentials] = useState<IPTVCredentials | null>(null);
  const [playlist, setPlaylist] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showEPG, setShowEPG] = useState(false);

  const handleIPTVLogin = async (creds: IPTVCredentials) => {
    setCredentials(creds);
    
    // Simular carregamento de playlist via credenciais IPTV
    // Em um app real, isso faria uma requisição para a API do provedor IPTV
    const mockPlaylist = {
      channels: [
        {
          id: '1',
          name: 'Globo HD',
          group: 'Abertos',
          url: `http://${creds.server}:${creds.port}/live/${creds.username}/${creds.password}/1.ts`,
          logo: 'https://upload.wikimedia.org/wikipedia/commons/8/81/Logotipo_da_Globo.png'
        },
        {
          id: '2',
          name: 'SBT HD',
          group: 'Abertos',
          url: `http://${creds.server}:${creds.port}/live/${creds.username}/${creds.password}/2.ts`,
          logo: 'https://upload.wikimedia.org/wikipedia/commons/4/41/SBT_logo_2014.svg'
        }
      ],
      movies: [],
      series: []
    };
    
    setPlaylist(mockPlaylist);
    setAuthMode('authenticated');
  };

  const handleSkipLogin = () => {
    setAuthMode('m3u');
  };

  const handlePlaylistLoad = (playlistData) => {
    setPlaylist(playlistData);
    setAuthMode('authenticated');
    console.log("Playlist carregada:", playlistData);
  };

  const handleVideoSelect = (video) => {
    setCurrentVideo(video);
    console.log("Vídeo selecionado:", video);
  };

  const handleBackToList = () => {
    setCurrentVideo(null);
  };

  const handleEPGClose = () => {
    setShowEPG(false);
  };

  // Tela de login IPTV
  if (authMode === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
        <IPTVLogin 
          onLogin={handleIPTVLogin}
          onSkip={handleSkipLogin}
        />
      </div>
    );
  }

  // Tela de carregamento M3U
  if (authMode === 'm3u') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
        <LoadM3U onPlaylistLoad={handlePlaylistLoad} />
      </div>
    );
  }

  // Player de vídeo
  if (currentVideo) {
    return (
      <VideoPlayer 
        video={currentVideo} 
        onBack={handleBackToList}
        playlist={playlist}
      />
    );
  }

  // EPG Guide
  if (showEPG) {
    return (
      <EPGGuide 
        channels={playlist?.channels || []}
        onClose={handleEPGClose}
        onProgramSelect={(program, channel) => {
          console.log("Programa selecionado:", program, "Canal:", channel);
          setShowEPG(false);
        }}
      />
    );
  }

  // Interface principal
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
              <p className="text-sm text-muted-foreground">
                {credentials ? `Conectado: ${credentials.server}` : 'Sua experiência de streaming'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEPG(true)}
              className="flex items-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>EPG</span>
            </Button>
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
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
              channels={playlist?.channels || []} 
              onChannelSelect={handleVideoSelect}
            />
          </TabsContent>

          <TabsContent value="movies" className="animate-fade-in">
            <Movies 
              movies={playlist?.movies || []} 
              onMovieSelect={handleVideoSelect}
            />
          </TabsContent>

          <TabsContent value="series" className="animate-fade-in">
            <Series 
              series={playlist?.series || []} 
              onSeriesSelect={handleVideoSelect}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
