
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Tv, Play } from "lucide-react";

export const TVChannels = ({ channels, onChannelSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("all");

  const groups = ["all", ...new Set(channels.map(ch => ch.group))];
  
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
          {groups.slice(0, 6).map(group => (
            <Badge
              key={group}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredChannels.map((channel) => (
          <Card 
            key={channel.id}
            className="group hover:bg-secondary/50 transition-all duration-200 cursor-pointer hover:scale-105 bg-card/50 backdrop-blur-sm"
            onClick={() => onChannelSelect(channel)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                {channel.logo ? (
                  <img
                    src={channel.logo}
                    alt={channel.name}
                    className="w-12 h-12 rounded-lg object-cover bg-secondary"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className={`w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center ${channel.logo ? 'hidden' : 'flex'}`}
                >
                  <Tv className="w-6 h-6 text-primary" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {channel.name}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {channel.group}
                  </p>
                </div>
                
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-5 h-5 text-primary" />
                </div>
              </div>
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
