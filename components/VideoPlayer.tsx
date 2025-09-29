import React from 'react';
import { ExternalLinkIcon } from './icons';

interface VideoPlayerProps {
  videoId: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId }) => {
  return (
    <div className="w-full">
        <h2 className="text-2xl font-semibold text-slate-200 text-center mb-6">Analyzed Video</h2>
        <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg border border-slate-700">
        <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full"
        ></iframe>
        </div>
        <div className="text-center mt-2">
          <a
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-400 hover:text-purple-400 transition-colors inline-flex items-center"
          >
              Playback issues? Watch on YouTube
              <ExternalLinkIcon className="h-4 w-4 ml-1.5" />
          </a>
        </div>
    </div>
  );
};

// This is a simple utility to make Tailwind's aspect ratio plugin work without installing it
const style = document.createElement('style');
style.textContent = `
  .aspect-w-16 {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 */
  }
  .aspect-h-9 > * {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;
document.head.append(style);

export default VideoPlayer;