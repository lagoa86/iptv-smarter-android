
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Tv, Play } from "lucide-react";

interface Channel {
  id: string;
  name: string;
  group: string;
  url: string;
  logo?: string;
}

interface TVChannelsProps {
  channels: Channel[];
  onChannelSelect: (channel: Channel) => void;
}

export const TVChannels = ({ channels, onChannelSelect }: TVChannelsProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("all");

  const groups = ["all", ...new Set(channels.map(channel => channel.group))];
  
  const filteredChannels = channels.filter(channel => {
    const matchesSearch = channel.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = selectedGroup === "all" || channel.group === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar canais..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-secondary/50"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {groups.slice(0, 6).map((group, index) => (
            <Badge
              key={`group-${index}-${group}`}
              variant={selectedGroup === group ? "default" : "secondary"}
              className="cursor-pointer hover:bg-primary/80"
              onClick={() => setSelectedGroup(group)}
            >
              {group === "all" ? "Todos" : group}
            </Badge>
          ))}
        </div>
      </div>

      {/* Channels Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredChannels.map((channel, index) => (
          <Card 
            key={`channel-${channel.id || index}`}
            className="group hover:bg-secondary/50 transition-all duration-200 cursor-pointer hover:scale-105 bg-card/50 backdrop-blur-sm"
            onClick={() => onChannelSelect(channel)}
          >
            <CardContent className="p-3">
              <div className="aspect-video bg-secondary/50 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                {channel.logo ? (
                  <img
                    src={channel.logo}
                    alt={channel.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const nextSibling = target.nextSibling as HTMLElement;
                      if (nextSibling) {
                        nextSibling.style.display = 'flex';
                      }
                    }}
                  />
                ) : null}
                <div className={`absolute inset-0 flex items-center justify-center bg-primary/20 ${channel.logo ? 'hidden' : 'flex'}`}>
                  <Tv className="w-8 h-8 text-primary" />
                </div>
                
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <h3 className="font-medium text-foreground text-sm truncate group-hover:text-primary transition-colors">
                {channel.name}
              </h3>
              <p className="text-xs text-muted-foreground truncate mt-1">
                {channel.group}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredChannels.length === 0 && (
        <div className="text-center py-12">
          <Tv className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Nenhum canal encontrado</h3>
          <p className="text-muted-foreground">
            Tente ajustar os filtros ou termo de busca
          </p>
        </div>
      )}
    </div>
  );
};
