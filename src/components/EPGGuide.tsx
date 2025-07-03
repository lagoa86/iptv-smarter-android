
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, Tv, ChevronLeft, ChevronRight } from "lucide-react";

interface EPGProgram {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  category: string;
}

interface EPGChannel {
  id: string;
  name: string;
  logo?: string;
  programs: EPGProgram[];
}

interface EPGGuideProps {
  channels: any[];
  onClose: () => void;
  onProgramSelect?: (program: EPGProgram, channel: EPGChannel) => void;
}

export const EPGGuide = ({ channels, onClose, onProgramSelect }: EPGGuideProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [epgData, setEpgData] = useState<EPGChannel[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Simular dados de EPG (em um app real, isso viria de uma API)
  useEffect(() => {
    const generateEPGData = () => {
      const mockPrograms: EPGProgram[] = [
        {
          id: "1",
          title: "Jornal Nacional",
          description: "Principais notícias do Brasil e do mundo",
          startTime: "20:30",
          endTime: "21:20",
          category: "Notícias"
        },
        {
          id: "2",
          title: "Novela das 9",
          description: "Drama brasileiro",
          startTime: "21:20",
          endTime: "22:10",
          category: "Novela"
        },
        {
          id: "3",
          title: "Filme da Madrugada",
          description: "Ação e aventura",
          startTime: "00:30",
          endTime: "02:15",
          category: "Filme"
        }
      ];

      const epgChannels: EPGChannel[] = channels.slice(0, 10).map((channel, index) => ({
        id: channel.id || `channel-${index}`,
        name: channel.name,
        logo: channel.logo,
        programs: mockPrograms.map((program, pIndex) => ({
          ...program,
          id: `${channel.id || index}-${program.id}-${pIndex}`
        }))
      }));

      setEpgData(epgChannels);
    };

    generateEPGData();
  }, [channels]);

  // Atualizar hora atual a cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time: string) => {
    return time;
  };

  const isCurrentProgram = (startTime: string, endTime: string) => {
    const now = currentTime.toTimeString().slice(0, 5);
    return now >= startTime && now <= endTime;
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50">
      <div className="container mx-auto p-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">Guia de Programação (EPG)</h1>
          </div>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          <Button variant="outline" size="sm" onClick={() => changeDate(-1)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="text-lg font-semibold">
            {selectedDate.toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          <Button variant="outline" size="sm" onClick={() => changeDate(1)}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* EPG Grid */}
        <div className="flex-1 overflow-auto">
          <div className="space-y-4">
            {epgData.map((channel) => (
              <Card key={channel.id} className="bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-3">
                    {channel.logo ? (
                      <img 
                        src={channel.logo} 
                        alt={channel.name}
                        className="w-8 h-8 rounded object-cover"
                      />
                    ) : (
                      <Tv className="w-8 h-8 text-primary" />
                    )}
                    <span>{channel.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {channel.programs.map((program) => (
                      <div
                        key={program.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          isCurrentProgram(program.startTime, program.endTime)
                            ? 'bg-primary/20 border-primary'
                            : 'bg-secondary/30 border-secondary hover:bg-secondary/50'
                        }`}
                        onClick={() => onProgramSelect?.(program, channel)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm font-medium">
                                {formatTime(program.startTime)} - {formatTime(program.endTime)}
                              </span>
                              {isCurrentProgram(program.startTime, program.endTime) && (
                                <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">
                                  AO VIVO
                                </span>
                              )}
                            </div>
                            <h4 className="font-semibold text-foreground">{program.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {program.description}
                            </p>
                          </div>
                          <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                            {program.category}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
