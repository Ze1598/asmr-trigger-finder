
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-10 space-y-4">
      <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-400">AI is analyzing the video...</p>
    </div>
  );
};

export default Loader;
