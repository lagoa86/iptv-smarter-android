import { useState } from "react";
import { VideoPlayer } from "./VideoPlayer";

interface Channel {
  id: string;
  name: string;
  url: string;
}

interface TVChannelsProps {
  channels: Channel[];
}

export const TVChannels = ({ channels }: TVChannelsProps) => {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Canais</h2>
      <ul className="grid grid-cols-2 gap-2">
        {channels.map((ch) => (
          <li key={ch.id}>
            <button
              onClick={() => setSelectedChannel(ch.url)}
              className="text-left hover:underline"
            >
              {ch.name}
            </button>
          </li>
        ))}
      </ul>

      {selectedChannel && (
        <div className="mt-4">
          <VideoPlayer src={selectedChannel} />
        </div>
      )}
    </div>
  );
};
