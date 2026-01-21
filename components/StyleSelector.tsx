import React from 'react';

export interface StyleOption {
  id: string;
  label: string;
  value: string; // Suffix added to the prompt
  description: string;
}

export const styles: StyleOption[] = [
  { 
    id: 'none', 
    label: 'None', 
    value: '', 
    description: 'No specific style' 
  },
  { 
    id: 'photo', 
    label: 'Photorealistic', 
    value: 'photorealistic, 8k, highly detailed, realistic texture, photography, cinematic lighting', 
    description: 'True to life' 
  },
  { 
    id: 'anime', 
    label: 'Anime', 
    value: 'anime style, japanese animation, vibrant, cel shaded, studio ghibli style', 
    description: 'Japanese animation' 
  },
  { 
    id: 'oil', 
    label: 'Oil Painting', 
    value: 'oil painting style, textured, canvas, impasto, classic art, masterpiece', 
    description: 'Textured canvas' 
  },
  { 
    id: 'pixel', 
    label: 'Pixel Art', 
    value: 'pixel art style, 8-bit, retro game asset, dot matrix, sprite', 
    description: 'Retro 8-bit' 
  },
  { 
    id: 'cyberpunk', 
    label: 'Cyberpunk', 
    value: 'cyberpunk style, neon lights, futuristic, high contrast, sci-fi, blade runner aesthetic', 
    description: 'Neon futuristic' 
  },
  { 
    id: 'watercolor', 
    label: 'Watercolor', 
    value: 'watercolor painting style, soft edges, paper texture, artistic, wet on wet', 
    description: 'Soft & artistic' 
  },
  { 
    id: '3d', 
    label: '3D Render', 
    value: '3D render, octane render, unreal engine 5, raytracing, highly detailed, glossy', 
    description: 'Modern CGI' 
  },
  { 
    id: 'sketch', 
    label: 'Pencil Sketch', 
    value: 'pencil sketch, graphite, rough lines, black and white, hand drawn, charcoal', 
    description: 'Hand drawn' 
  },
  { 
    id: 'vintage', 
    label: 'Vintage', 
    value: 'vintage style, retro, old photo, grainy, nostalgic, 1950s poster style', 
    description: 'Retro aesthetic' 
  },
  { 
    id: 'lofi', 
    label: 'Lo-Fi', 
    value: 'lo-fi aesthetic, soft lighting, pastel colors, chill vibes, grainy, dreamcore', 
    description: 'Chill vibes' 
  },
];

interface StyleSelectorProps {
  selectedStyleId: string;
  onChange: (styleId: string) => void;
  disabled?: boolean;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyleId, onChange, disabled }) => {
  return (
    <div className="flex flex-col space-y-3">
      <label className="text-sm font-medium text-gray-400">Art Style</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[240px] overflow-y-auto pr-1 custom-scrollbar">
        {styles.map((style) => (
          <button
            key={style.id}
            type="button"
            onClick={() => onChange(style.id)}
            disabled={disabled}
            className={`
              flex flex-col items-start p-2.5 rounded-lg transition-all duration-200 border text-left group relative
              ${selectedStyleId === style.id 
                ? 'bg-primary-900/30 border-primary-500/50 text-primary-400 ring-1 ring-primary-500/20' 
                : 'bg-dark-800 border-transparent text-gray-400 hover:bg-dark-700 hover:text-gray-200'}
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            <div className="flex items-center justify-between w-full">
               <span className="text-xs font-semibold">{style.label}</span>
               {selectedStyleId === style.id && (
                 <div className="w-1.5 h-1.5 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(14,165,233,0.8)]" />
               )}
            </div>
            <span className="text-[10px] opacity-60 mt-0.5 line-clamp-1 group-hover:opacity-80 transition-opacity">
                {style.description}
            </span>
          </button>
        ))}
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 0.8);
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
};
