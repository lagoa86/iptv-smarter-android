
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Link, Tv } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LoadM3UProps {
  onPlaylistLoad: (playlist: any) => void;
}

export const LoadM3U = ({ onPlaylistLoad }: LoadM3UProps) => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const parseM3U = (content: string) => {
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);
    const channels: any[] = [];
    const movies: any[] = [];
    const series: any[] = [];
    
    let currentEntry: any = {};
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.startsWith('#EXTINF:')) {
        // Parse EXTINF line
        const extinf = line.substring(8); // Remove "#EXTINF:"
        const parts = extinf.split(',');
        
        if (parts.length >= 2) {
          const info = parts[0];
          const name = parts.slice(1).join(',').trim();
          
          // Extract group-title
          const groupMatch = info.match(/group-title="([^"]+)"/);
          const group = groupMatch ? groupMatch[1] : "Sem categoria";
          
          // Extract logo
          const logoMatch = info.match(/tvg-logo="([^"]+)"/);
          const logo = logoMatch ? logoMatch[1] : undefined;
          
          currentEntry = {
            name,
            group,
            logo,
            id: `entry_${Date.now()}_${Math.random()}`
          };
        }
      } else if (line.startsWith('http')) {
        // This is a URL line
        if (currentEntry.name) {
          currentEntry.url = line;
          
          // Categorize based on group name or URL
          const groupLower = currentEntry.group.toLowerCase();
          const nameLower = currentEntry.name.toLowerCase();
          
          if (groupLower.includes('movie') || groupLower.includes('filme') || 
              nameLower.includes('movie') || nameLower.includes('filme')) {
            movies.push({ ...currentEntry });
          } else if (groupLower.includes('series') || groupLower.includes('serie') ||
                    nameLower.includes('series') || nameLower.includes('serie')) {
            series.push({ ...currentEntry });
          } else {
            channels.push({ ...currentEntry });
          }
          
          currentEntry = {};
        }
      }
    }
    
    console.log("Parsed M3U:", { channels: channels.length, movies: movies.length, series: series.length });
    
    return { channels, movies, series };
  };

  const loadFromUrl = async () => {
    if (!url.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira uma URL válida",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log("Carregando M3U da URL:", url);
      
      // Try to fetch the URL directly first
      let response;
      try {
        response = await fetch(url);
      } catch (error) {
        // If direct fetch fails due to CORS, try with a proxy
        console.log("Tentando com proxy devido a CORS...");
        response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
        if (response.ok) {
          const data = await response.json();
          response = {
            ok: true,
            text: async () => data.contents
          };
        }
      }
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      
      const content = await response.text();
      console.log("Conteúdo M3U carregado, tamanho:", content.length);
      
      if (!content.includes('#EXTINF') && !content.includes('#EXTM3U')) {
        throw new Error("O arquivo não parece ser uma lista M3U válida");
      }
      
      const playlist = parseM3U(content);
      
      if (playlist.channels.length === 0 && playlist.movies.length === 0 && playlist.series.length === 0) {
        throw new Error("Nenhum conteúdo foi encontrado na lista M3U");
      }
      
      toast({
        title: "Sucesso!",
        description: `Lista carregada: ${playlist.channels.length} canais, ${playlist.movies.length} filmes, ${playlist.series.length} séries`
      });
      
      onPlaylistLoad(playlist);
      
    } catch (error) {
      console.error("Erro ao carregar M3U:", error);
      toast({
        title: "Erro ao carregar lista",
        description: `Erro: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        console.log("Arquivo M3U carregado, tamanho:", content.length);
        
        if (!content.includes('#EXTINF') && !content.includes('#EXTM3U')) {
          throw new Error("O arquivo não parece ser uma lista M3U válida");
        }
        
        const playlist = parseM3U(content);
        
        if (playlist.channels.length === 0 && playlist.movies.length === 0 && playlist.series.length === 0) {
          throw new Error("Nenhum conteúdo foi encontrado na lista M3U");
        }
        
        toast({
          title: "Sucesso!",
          description: `Lista carregada: ${playlist.channels.length} canais, ${playlist.movies.length} filmes, ${playlist.series.length} séries`
        });
        
        onPlaylistLoad(playlist);
        
      } catch (error) {
        console.error("Erro ao processar arquivo:", error);
        toast({
          title: "Erro ao processar arquivo",
          description: `Erro: ${error.message}`,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Tv className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">IPTV Player</CardTitle>
          <p className="text-muted-foreground">
            Carregue sua lista M3U para começar
          </p>
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
                  placeholder="https://exemplo.com/lista.m3u"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="bg-secondary/50"
                />
              </div>
              <Button 
                onClick={loadFromUrl} 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Carregando..." : "Carregar Lista"}
              </Button>
            </TabsContent>
            
            <TabsContent value="file" className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="file"
                  accept=".m3u,.m3u8"
                  onChange={loadFromFile}
                  className="bg-secondary/50"
                  disabled={isLoading}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Selecione um arquivo .m3u ou .m3u8
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
