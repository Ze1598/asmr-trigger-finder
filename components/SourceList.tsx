
import React from 'react';
import { GroundingSource } from '../types';
import { SearchIcon } from './icons';

interface SourceListProps {
  sources: GroundingSource[];
}

const SourceList: React.FC<SourceListProps> = ({ sources }) => {
  const validSources = sources.filter(source => source.web && source.web.uri && source.web.title);

  if (validSources.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 pt-4">
      <h3 className="text-xl font-semibold text-slate-300 text-center mb-4">Sources</h3>
      <ul className="space-y-2">
        {validSources.map((source, index) => (
          <li key={index}>
            <a
              href={source.web!.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-purple-400 transition-colors duration-200 text-sm"
            >
              <SearchIcon className="h-5 w-5 mr-3 flex-shrink-0" />
              <span className="truncate">{source.web!.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SourceList;
