import React from 'react';
import { Sliders as SlidersIcon, Plus, Minus } from 'lucide-react';
import { ThemeProps } from '../../types';

interface SlidersProps extends ThemeProps {
  sliderPositions: number[];
  handleSliderChange: (index: number, value: number) => void;
  addSlider: () => void;
  removeSlider: () => void;
}

// Array of complementary gradients
const GRADIENTS = [
  'from-indigo-400 to-purple-500',
  'from-rose-400 to-pink-500',
  'from-cyan-400 to-blue-500',
  'from-emerald-400 to-teal-500',
  'from-amber-400 to-orange-500',
];

export const Sliders: React.FC<SlidersProps> = ({
  isDark,
  sliderPositions,
  handleSliderChange,
  addSlider,
  removeSlider,
}) => {
  return (
    <div className="p-6">
      {/* Title and Controls */}
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-700'}`}>
          Satisfying Sliders
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={removeSlider}
            disabled={sliderPositions.length <= 1}
            className={`
              p-2 rounded-full
              transition-all duration-300
              ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
              ${sliderPositions.length <= 1 ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <Minus className={`w-4 h-4 ${isDark ? 'text-white' : 'text-gray-700'}`} />
          </button>
          <button
            onClick={addSlider}
            className={`
              p-2 rounded-full
              transition-all duration-300
              ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
            `}
          >
            <Plus className={`w-4 h-4 ${isDark ? 'text-white' : 'text-gray-700'}`} />
          </button>
        </div>
      </div>

      {/* Sliders */}
      {sliderPositions.map((position, index) => (
        <div key={index} className="mb-8 relative group/slider">
          {/* Percentage Indicator */}
          <div 
            className={`
              absolute -top-6 left-1/2 transform -translate-x-1/2
              bg-gradient-to-r ${GRADIENTS[index % GRADIENTS.length]}
              text-white text-sm font-medium px-3 py-1 rounded-full
              opacity-0 group-hover/slider:opacity-100 transition-opacity duration-200
              shadow-lg
            `}
          >
            {Math.round(position)}%
          </div>

          {/* Slider Container - Added padding for knob overflow */}
          <div className="px-3 -mx-3">
            {/* Slider Track */}
            <div className={`
              h-3 relative
              rounded-full
              ${isDark ? 'bg-gray-800' : 'bg-gray-100'}
              shadow-inner
              border ${isDark ? 'border-gray-700/50' : 'border-gray-200'}
              transition-all duration-300
              group-hover/slider:h-4
            `}>
              {/* Background pattern */}
              <div className={`
                absolute inset-0 opacity-10
                bg-[repeating-linear-gradient(45deg,transparent,transparent,10px,rgba(0,0,0,0.1)_10px,rgba(0,0,0,0.1)_20px)]
                rounded-full
              `} />
              
              <input 
                type="range"
                min="0"
                max="100"
                value={position}
                onChange={(e) => handleSliderChange(index, parseInt(e.target.value))}
                className="absolute w-full h-full opacity-0 cursor-pointer z-10"
              />
              
              {/* Progress bar with gradient */}
              <div 
                className={`
                  absolute h-full bg-gradient-to-r ${GRADIENTS[index % GRADIENTS.length]} 
                  transition-all duration-300 ease-out
                  rounded-full
                  shadow-[0_0_20px_rgba(0,0,0,0.1)]
                  overflow-hidden
                `}
                style={{ width: `${position}%` }}
              >
                {/* Animated shine effect */}
                <div className="
                  absolute inset-0 
                  bg-gradient-to-r from-transparent via-white to-transparent opacity-30
                  -translate-x-full group-hover/slider:translate-x-full
                  transition-transform duration-1000 ease-in-out
                "/>
                {/* Static shine */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
              </div>
              
              {/* Slider handle */}
              <div 
                className={`
                  absolute w-5 h-5 rounded-full
                  shadow-lg
                  flex items-center justify-center
                  transition-all duration-300 ease-out
                  transform 
                  group-hover/slider:scale-110
                  group-hover/slider:w-6 group-hover/slider:h-6
                  ${isDark ? 'bg-white' : 'bg-white'}
                  top-1/2
                  -translate-y-1/2
                  border ${isDark ? 'border-gray-600' : 'border-gray-300'}
                `}
                style={{ 
                  left: `${position}%`,
                  transform: `translate(-50%, -50%)`,
                  boxShadow: isDark 
                    ? '0 2px 8px rgba(0,0,0,0.4), inset 0 2px 2px rgba(255,255,255,0.2)'
                    : '0 2px 8px rgba(0,0,0,0.1), inset 0 2px 2px rgba(255,255,255,0.5)'
                }}
              >
                {/* Handle inner gradient */}
                <div className={`
                  absolute inset-1 rounded-full
                  bg-gradient-to-br ${GRADIENTS[index % GRADIENTS.length]}
                  opacity-0 group-hover/slider:opacity-100
                  transition-opacity duration-300
                `} />
                
                {/* Handle glow effect */}
                <div className={`
                  absolute -inset-1 rounded-full
                  transition-opacity duration-300
                  opacity-0 group-hover/slider:opacity-100
                  ${isDark 
                    ? `shadow-[0_0_10px_rgba(139,92,246,0.3)]` 
                    : `shadow-[0_0_10px_rgba(99,102,241,0.2)]`}
                `} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}; 