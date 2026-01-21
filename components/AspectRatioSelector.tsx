import React from 'react';
import { AspectRatio } from '../types';

interface AspectRatioSelectorProps {
  value: AspectRatio;
  onChange: (value: AspectRatio) => void;
  disabled?: boolean;
}

const ratios: { value: AspectRatio; label: string; iconClass: string }[] = [
  { value: '1:1', label: 'Square', iconClass: 'w-6 h-6 border-2 border-current rounded-sm' },
  { value: '16:9', label: 'Landscape', iconClass: 'w-8 h-5 border-2 border-current rounded-sm' },
  { value: '9:16', label: 'Portrait', iconClass: 'w-5 h-8 border-2 border-current rounded-sm' },
  { value: '4:3', label: 'Classic', iconClass: 'w-7 h-6 border-2 border-current rounded-sm' },
  { value: '3:4', label: 'Vertical', iconClass: 'w-6 h-7 border-2 border-current rounded-sm' },
];

export const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ value, onChange, disabled }) => {
  return (
    <div className="flex flex-col space-y-3">
      <label className="text-sm font-medium text-gray-400">Aspect Ratio</label>
      <div className="grid grid-cols-5 gap-2">
        {ratios.map((ratio) => (
          <button
            key={ratio.value}
            type="button"
            onClick={() => onChange(ratio.value)}
            disabled={disabled}
            className={`
              flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200
              ${value === ratio.value 
                ? 'bg-primary-900/30 text-primary-400 ring-1 ring-primary-500/50' 
                : 'bg-dark-800 text-gray-500 hover:bg-dark-700 hover:text-gray-300'}
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            title={ratio.label}
          >
            <div className={`mb-1 ${ratio.iconClass}`} />
            <span className="text-[10px] font-medium hidden sm:block">{ratio.value}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
