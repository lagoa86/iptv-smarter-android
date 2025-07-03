
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { X, Settings, Volume2, Monitor } from "lucide-react";

export const SettingsPanel = ({ onClose }) => {
  const [autoplay, setAutoplay] = useState(true);
  const [quality, setQuality] = useState("auto");
  const [volume, setVolume] = useState([80]);
  const [bufferSize, setBufferSize] = useState([30]);

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-3">
          <Settings className="w-5 h-5 text-primary" />
          <div>
            <CardTitle>Configurações</CardTitle>
            <CardDescription>Personalize sua experiência de streaming</CardDescription>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Reprodução */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground flex items-center">
            <Monitor className="w-4 h-4 mr-2" />
            Reprodução
          </h3>
          
          <div className="space-y-4 pl-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-foreground">Reprodução automática</label>
                <p className="text-xs text-muted-foreground">Iniciar reprodução automaticamente</p>
              </div>
              <Switch
                checked={autoplay}
                onCheckedChange={setAutoplay}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Qualidade padrão</label>
              <Select value={quality} onValueChange={setQuality}>
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Automática</SelectItem>
                  <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                  <SelectItem value="720p">720p (HD)</SelectItem>
                  <SelectItem value="480p">480p (SD)</SelectItem>
                  <SelectItem value="360p">360p</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Buffer de reprodução: {bufferSize[0]}s
              </label>
              <Slider
                value={bufferSize}
                onValueChange={setBufferSize}
                max={60}
                min={5}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Maior buffer = reprodução mais estável, mas demora mais para iniciar
              </p>
            </div>
          </div>
        </div>

        {/* Áudio */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground flex items-center">
            <Volume2 className="w-4 h-4 mr-2" />
            Áudio
          </h3>
          
          <div className="space-y-4 pl-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Volume padrão: {volume[0]}%
              </label>
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            Salvar configurações
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
