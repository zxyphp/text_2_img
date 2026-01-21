import React, { useState, useCallback } from 'react';
import { Button } from './components/Button';
import { AspectRatioSelector } from './components/AspectRatioSelector';
import { StyleSelector, styles, StyleOption } from './components/StyleSelector';
import { ResultDisplay } from './components/ResultDisplay';
import { generateImageWithGemini } from './services/geminiService';
import { AspectRatio, GeneratedImage } from './types';

function App() {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [selectedStyleId, setSelectedStyleId] = useState<string>('none');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    const styleOption = styles.find(s => s.id === selectedStyleId) || styles[0];

    try {
      const result = await generateImageWithGemini(prompt, styleOption, aspectRatio);
      setCurrentImage(result);
      setHistory(prev => [result, ...prev]);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = useCallback((image: GeneratedImage) => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `lumina-gen-${image.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const handleSelectHistory = (image: GeneratedImage) => {
      setCurrentImage(image);
      setPrompt(image.prompt);
      setAspectRatio(image.aspectRatio);
      // If the history image has a styleId that matches our current styles, select it.
      // Otherwise default to none (backward compatibility if needed, though we updated types).
      if (image.styleId) {
          setSelectedStyleId(image.styleId);
      } else {
          setSelectedStyleId('none');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-dark-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-dark-900 via-dark-950 to-dark-950 text-white selection:bg-primary-500/30">
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-dark-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
               <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
               </svg>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Lumina
            </span>
          </div>
          <div className="hidden sm:block text-xs text-gray-500 font-medium px-3 py-1 rounded-full border border-white/5 bg-white/5">
            Powered by Gemini 2.5 Flash
          </div>
        </div>
      </header>

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-dark-900/50 rounded-2xl p-6 border border-white/5 shadow-xl backdrop-blur-sm sticky top-24">
              <form onSubmit={handleGenerate} className="space-y-6">
                
                {/* Prompt Input */}
                <div className="space-y-3">
                  <label htmlFor="prompt" className="text-sm font-medium text-gray-400">
                    Image Prompt
                  </label>
                  <div className="relative">
                    <textarea
                      id="prompt"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="A futuristic city with flying cars, neon lights..."
                      className="w-full h-32 bg-dark-950 border border-dark-700 rounded-xl p-4 text-sm text-white placeholder-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none shadow-inner"
                      disabled={isLoading}
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-gray-600 pointer-events-none">
                      {prompt.length} chars
                    </div>
                  </div>
                </div>

                {/* Style Selector */}
                <StyleSelector 
                  selectedStyleId={selectedStyleId}
                  onChange={setSelectedStyleId}
                  disabled={isLoading}
                />

                {/* Aspect Ratio */}
                <AspectRatioSelector 
                  value={aspectRatio} 
                  onChange={setAspectRatio}
                  disabled={isLoading}
                />

                {/* Error Message */}
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>{error}</span>
                  </div>
                )}

                {/* Generate Button */}
                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg font-semibold shadow-primary-500/25" 
                  isLoading={isLoading}
                  disabled={!prompt.trim()}
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  }
                >
                  Generate Art
                </Button>
              </form>
            </div>
          </div>

          {/* Right Column: Results & History */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Main Result Area */}
            <div className="min-h-[400px] flex flex-col items-center justify-center">
              {currentImage ? (
                <div className="w-full space-y-4">
                    <div className="flex items-center justify-between px-1">
                         <h2 className="text-lg font-semibold text-white">Generated Result</h2>
                    </div>
                   <ResultDisplay 
                     image={currentImage} 
                     onDownload={() => handleDownload(currentImage)} 
                   />
                </div>
              ) : (
                <div className="w-full h-[500px] bg-dark-900/30 border-2 border-dashed border-dark-700/50 rounded-2xl flex flex-col items-center justify-center text-center p-8 transition-colors hover:border-dark-600/50">
                   <div className="w-24 h-24 rounded-full bg-dark-800 flex items-center justify-center mb-6 shadow-inner">
                      <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                   </div>
                   <h3 className="text-xl font-medium text-gray-300 mb-2">Ready to Create</h3>
                   <p className="text-gray-500 max-w-sm">Enter a detailed description, choose a style, and watch your imagination come to life.</p>
                </div>
              )}
            </div>

            {/* History Grid */}
            {history.length > 0 && (
              <div className="pt-8 border-t border-white/5">
                <h3 className="text-lg font-medium text-gray-300 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Recent Generations
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {history.map((img) => (
                    <div 
                      key={img.id}
                      onClick={() => handleSelectHistory(img)}
                      className={`
                        group relative aspect-square rounded-lg overflow-hidden cursor-pointer bg-dark-800 ring-1 ring-white/5 hover:ring-primary-500/50 transition-all duration-200
                        ${currentImage?.id === img.id ? 'ring-2 ring-primary-500 shadow-lg shadow-primary-500/10' : ''}
                      `}
                    >
                      <img 
                        src={img.url} 
                        alt={img.prompt} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <span className="text-xs text-white font-medium bg-black/50 px-2 py-1 rounded backdrop-blur-sm">View</span>
                      </div>
                      {/* Style badge on history item */}
                      <div className="absolute bottom-2 left-2 right-2">
                        <span className="inline-block text-[10px] bg-black/70 text-gray-200 px-1.5 py-0.5 rounded backdrop-blur-sm truncate w-full text-center">
                            {img.styleLabel !== 'None' ? img.styleLabel : 'Standard'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
