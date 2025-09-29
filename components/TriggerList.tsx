import React from 'react';
import { Trigger } from '../types';
import { ClockIcon, SoundWaveIcon } from './icons';

interface TriggerListProps {
  triggers: Trigger[];
  videoId: string;
}

// A robust parser that handles "MM:SS", "HH:MM:SS", and raw seconds as a string.
const parseTimestampToSeconds = (timestamp: string | number): number => {
  if (typeof timestamp === 'number') {
    return Math.round(timestamp);
  }
  
  if (timestamp.includes(':')) {
    const parts = timestamp.split(':').map(Number);
    if (parts.some(isNaN)) return 0;

    if (parts.length === 2) { // MM:SS
      return parts[0] * 60 + parts[1];
    }
    if (parts.length === 3) { // HH:MM:SS
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
  }
  
  const seconds = Number(timestamp);
  return isNaN(seconds) ? 0 : Math.round(seconds);
};

// A formatter to ensure display is always consistent.
const formatSecondsToTimestamp = (totalSeconds: number): string => {
  if (isNaN(totalSeconds) || totalSeconds < 0) return "00:00";
  
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');

  if (hours > 0) {
    return `${hours}:${paddedMinutes}:${paddedSeconds}`;
  }
  return `${paddedMinutes}:${paddedSeconds}`;
};


const TriggerList: React.FC<TriggerListProps> = ({ triggers, videoId }) => {
  if (triggers.length === 0) {
    return (
      <div className="text-center text-slate-400 p-8 bg-slate-800/50 rounded-lg">
        The AI couldn't identify any specific triggers for this video.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-slate-200 text-center mb-6">Identified Triggers</h2>
      <ul className="space-y-3">
        {triggers.map((trigger, index) => {
            const seconds = parseTimestampToSeconds(trigger.timestamp);
            const displayTimestamp = formatSecondsToTimestamp(seconds);
            const youtubeLink = `https://www.youtube.com/watch?v=${videoId}&t=${seconds}s`;

            return (
              <li
                key={index}
                className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-lg flex items-center justify-between hover:bg-slate-800 hover:border-slate-600 transition-all duration-200"
              >
                <div className="flex items-center">
                  <SoundWaveIcon className="h-6 w-6 text-purple-400 mr-4 flex-shrink-0" />
                  <p className="text-slate-300 capitalize">{trigger.trigger}</p>
                </div>
                <a
                  href={youtubeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm font-mono hover:bg-slate-600 hover:text-white transition-colors"
                  aria-label={`Watch video at ${displayTimestamp}`}
                >
                  <ClockIcon className="h-4 w-4 mr-2 text-slate-400" />
                  {displayTimestamp}
                </a>
              </li>
            );
        })}
      </ul>
    </div>
  );
};

export default TriggerList;