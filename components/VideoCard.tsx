
import React from 'react';
import { Video } from '../types';

interface VideoCardProps {
  video: Video;
  onClick: (video: Video) => void;
  layout?: 'grid' | 'list';
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick, layout = 'grid' }) => {
  if (layout === 'list') {
    return (
      <div 
        className="flex gap-3 cursor-pointer group"
        onClick={() => onClick(video)}
      >
        <div className="relative w-40 flex-shrink-0">
          <img 
            src={video.thumbnail} 
            alt={video.title} 
            className="w-full aspect-video object-cover rounded-lg group-hover:opacity-80 transition-opacity"
          />
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <h3 className="text-sm font-semibold line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors">
            {video.title}
          </h3>
          <p className="text-xs text-zinc-400 mt-1">{video.channel}</p>
          <div className="flex items-center text-[10px] text-zinc-500 mt-0.5">
            <span>{video.views}</span>
            <span className="mx-1">•</span>
            <span>{video.publishedTime}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col gap-3 cursor-pointer group"
      onClick={() => onClick(video)}
    >
      <div className="relative w-full aspect-video overflow-hidden rounded-xl">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="flex gap-3">
        <div className="w-9 h-9 rounded-full bg-zinc-800 flex-shrink-0 overflow-hidden">
          <img src={`https://picsum.photos/seed/${video.channel}/100/100`} alt="channel" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col min-w-0">
          <h3 className="text-sm md:text-base font-semibold line-clamp-2 group-hover:text-blue-400 transition-colors">
            {video.title}
          </h3>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">{video.channel}</p>
          <div className="flex items-center text-xs text-zinc-400">
            <span>{video.views}</span>
            <span className="mx-1">•</span>
            <span>{video.publishedTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
