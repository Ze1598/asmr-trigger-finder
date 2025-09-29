
import React from 'react';
import { LinkIcon, ArrowRightIcon } from './icons';

interface URLInputFormProps {
  url: string;
  setUrl: (url: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const URLInputForm: React.FC<URLInputFormProps> = ({ url, setUrl, handleSubmit, isLoading }) => {
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 transition-all duration-200">
        <div className="pl-4 pr-2 pointer-events-none">
          <LinkIcon className="h-5 w-5 text-slate-500" />
        </div>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter YouTube ASMR video URL..."
          disabled={isLoading}
          className="w-full p-4 bg-transparent border-0 text-slate-200 placeholder-slate-500 focus:ring-0"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="m-1.5 px-4 sm:px-6 py-2.5 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-200 flex-shrink-0"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
             <>
               <span className="hidden sm:inline">Analyze</span>
               <ArrowRightIcon className="h-5 w-5 sm:ml-2" />
             </>
          )}
        </button>
      </div>
    </form>
  );
};

export default URLInputForm;
