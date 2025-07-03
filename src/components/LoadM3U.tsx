
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Link, Loader2, Tv } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const LoadM3U = ({ onPlaylistLoad }) => {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const { toast } = useToast();

  const parseM3U = (content) => {
    const lines = content.split('\n');
    const channels = [];
    const movies = [];
    const series = [];
    
    let currentItem = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('#EXTINF:')) {
        // Parse channel info
        const nameMatch = line.match(/,(.+)$/);
        const groupMatch = line.match(/group-title="([^"]+)"/);
        const logoMatch = line.match(/tvg-logo="([^"]+)"/);
        
        currentItem = {
          name: nameMatch ? nameMatch[1] : 'Canal sem nome',
          group: groupMatch ? groupMatch[1] : 'Outros',
          logo: logoMatch ? logoMatch[1] : null,
          id: Date.now() + Math.random()
        };
      } else if (line.startsWith('http') && currentItem) {
        currentItem.url = line;
        
        // Categorize content
        const group = currentItem.group.toLowerCase();
        if (group.includes('movie') || group.includes('filme')) {
          movies.push(currentItem);
        } else if (group.includes('serie') || group.includes('show')) {
          series.push(currentItem);
        } else {
          channels.push(currentItem);
        }
        
        currentItem = null;
      }
    }

    return { channels, movies, series };
  };

  const loadFromURL = async () => {
    if (!url.trim()) {
      toast({
        title: "URL obrigatória",
        description: "Por favor, insira uma URL válida",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(url);
      const content = await response.text();
      const playlist = parseM3U(content);
      
      toast({
        title: "Playlist carregada",
        description: `${playlist.channels.length} canais, ${playlist.movies.length} filmes, ${playlist.series.length} séries encontrados`
      });
      
      onPlaylistLoad(playlist);
    } catch (error) {
      console.error("Erro ao carregar playlist:", error);
      toast({
        title: "Erro ao carregar",
        description: "Não foi possível carregar a playlist da URL fornecida",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadFromFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const playlist = parseM3U(content);
        
        toast({
          title: "Arquivo carregado",
          description: `${playlist.channels.length} canais, ${playlist.movies.length} filmes, ${playlist.series.length} séries encontrados`
        });
        
        onPlaylistLoad(playlist);
      } catch (error) {
        console.error("Erro ao processar arquivo:", error);
        toast({
          title: "Erro no arquivo",
          description: "Não foi possível processar o arquivo M3U",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        {/* Logo/Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Tv className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">IPTV Player</h1>
          <p className="text-muted-foreground">Carregue sua lista M3U para começar</p>
        </div>

        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle className="text-center">Carregar Playlist</CardTitle>
            <CardDescription className="text-center">
              Escolha como deseja carregar sua lista M3U
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="url" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="url" className="flex items-center space-x-2">
                  <Link className="w-4 h-4" />
                  <span>URL</span>
                </TabsTrigger>
                <TabsTrigger value="file" className="flex items-center space-x-2">
                  <Upload className="w-4 h-4" />
                  <span>Arquivo</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="url"
                    placeholder="https://exemplo.com/playlist.m3u"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="bg-secondary/50"
                  />
                </div>
                <Button 
                  onClick={loadFromURL} 
                  disabled={loading || !url.trim()}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Carregando...
                    </>
                  ) : (
                    <>
                      <Link className="w-4 h-4 mr-2" />
                      Carregar da URL
                    </>
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="file" className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Clique para selecionar um arquivo M3U
                  </p>
                  <input
                    type="file"
                    accept=".m3u,.m3u8"
                    onChange={loadFromFile}
                    disabled={loading}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button
                    onClick={() => document.getElementById('file-upload').click()}
                    variant="outline"
                    disabled={loading}
                    className="bg-secondary/50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      "Selecionar Arquivo"
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            Formatos suportados: M3U, M3U8
          </p>
          <p className="text-xs text-muted-foreground">
            Sua playlist será processada localmente
          </p>
        </div>
      </div>
    </div>
  );
};
