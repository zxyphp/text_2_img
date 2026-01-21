import React, { useState } from 'react';
import { GeneratedImage } from '../types';
import { Button } from './Button';

interface ResultDisplayProps {
  image: GeneratedImage;
  onDownload: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ image, onDownload }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="w-full bg-dark-800 rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 animate-in fade-in zoom-in duration-300">
      <div className="relative group">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-dark-800 z-10">
             <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        <img
          src={image.url}
          alt={image.prompt}
          className={`w-full h-auto object-contain max-h-[70vh] bg-black/50 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
        />
        
        {/* Overlay actions */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-between">
            <div className="flex-1 mr-4">
                <div className="flex items-center space-x-2 mb-1">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-primary-400 bg-primary-900/40 px-2 py-0.5 rounded border border-primary-500/30">
                        {image.styleLabel}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">{image.aspectRatio}</span>
                </div>
                <p className="text-white text-sm line-clamp-2 font-medium drop-shadow-md">{image.prompt}</p>
            </div>
            <Button onClick={onDownload} variant="primary" className="shrink-0">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Download
            </Button>
        </div>
      </div>
    </div>
  );
};
