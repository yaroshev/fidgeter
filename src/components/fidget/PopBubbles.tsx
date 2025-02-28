import React, { useState } from 'react';
import { RotateCcw, Plus, Minus } from 'lucide-react';
import { ThemeProps } from '../../types';

interface PopBubblesProps extends ThemeProps {
  popBubbles: boolean[];
  popBubble: (index: number) => void;
  resetBubbles: () => void;
  addBubbleRow: () => void;
  removeBubbleRow: () => void;
}

export const PopBubbles: React.FC<PopBubblesProps> = ({
  isDark,
  popBubbles,
  popBubble,
  resetBubbles,
  addBubbleRow,
  removeBubbleRow,
}) => {
  const [animatingBubbles, setAnimatingBubbles] = useState<number[]>([]);

  const handlePop = (index: number) => {
    if (!popBubbles[index] && !animatingBubbles.includes(index)) {
      setAnimatingBubbles(prev => [...prev, index]);
      popBubble(index);
      setTimeout(() => {
        setAnimatingBubbles(prev => prev.filter(i => i !== index));
      }, 600);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-700'}`}>
          Pop Bubble Wrap
        </h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={removeBubbleRow}
            className={`
              relative p-2 rounded-full
              ${isDark 
                ? 'bg-transparent border-2 border-gray-700 hover:border-transparent' 
                : 'glass'}
              shadow-lg
              transition-all duration-300
              ${isDark ? 'text-white hover:shadow-[0_0_30px_rgba(139,92,246,0.6)]' : 'text-gray-800'}
              hover:scale-105
              font-medium
              group
              overflow-hidden
              ${popBubbles.length <= 6 ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            disabled={popBubbles.length <= 6}
          >
            {isDark && (
              <div className="
                absolute inset-0 
                rounded-full 
                opacity-0 
                group-hover:opacity-100
                transition-all
                duration-300
                before:absolute
                before:inset-0
                before:rounded-full
                before:p-[2px]
                before:bg-gradient-to-r
                before:from-indigo-500
                before:via-purple-500
                before:to-pink-500
                before:content-['']
                after:absolute
                after:inset-[2px]
                after:rounded-full
                after:bg-gray-900
                after:content-['']
              "/>
            )}
            <span className="relative z-10">
              <Minus className="w-4 h-4" />
            </span>
          </button>
          <button 
            onClick={addBubbleRow}
            className={`
              relative p-2 rounded-full
              ${isDark 
                ? 'bg-transparent border-2 border-gray-700 hover:border-transparent' 
                : 'glass'}
              shadow-lg
              transition-all duration-300
              ${isDark ? 'text-white hover:shadow-[0_0_30px_rgba(139,92,246,0.6)]' : 'text-gray-800'}
              hover:scale-105
              font-medium
              group
              overflow-hidden
            `}
          >
            {isDark && (
              <div className="
                absolute inset-0 
                rounded-full 
                opacity-0 
                group-hover:opacity-100
                transition-all
                duration-300
                before:absolute
                before:inset-0
                before:rounded-full
                before:p-[2px]
                before:bg-gradient-to-r
                before:from-indigo-500
                before:via-purple-500
                before:to-pink-500
                before:content-['']
                after:absolute
                after:inset-[2px]
                after:rounded-full
                after:bg-gray-900
                after:content-['']
              "/>
            )}
            <span className="relative z-10">
              <Plus className="w-4 h-4" />
            </span>
          </button>
          <button 
            onClick={resetBubbles}
            className={`
              relative px-4 py-2 rounded-full
              ${isDark 
                ? 'bg-transparent border-2 border-gray-700 hover:border-transparent' 
                : 'glass'}
              shadow-lg
              transition-all duration-300
              ${isDark ? 'text-white hover:shadow-[0_0_30px_rgba(139,92,246,0.6)]' : 'text-gray-800'}
              hover:scale-105
              font-medium
              group
              overflow-hidden
            `}
          >
            {/* Gradient border overlay for dark mode */}
            {isDark && (
              <div className="
                absolute inset-0 
                rounded-full 
                opacity-0 
                group-hover:opacity-100
                transition-all
                duration-300
                before:absolute
                before:inset-0
                before:rounded-full
                before:p-[2px]
                before:bg-gradient-to-r
                before:from-indigo-500
                before:via-purple-500
                before:to-pink-500
                before:content-['']
                after:absolute
                after:inset-[2px]
                after:rounded-full
                after:bg-gray-900
                after:content-['']
              "/>
            )}
            <span className="relative z-10 flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset All
            </span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-6 gap-3">
        {popBubbles.map((popped, index) => (
          <button
            key={index}
            onClick={() => handlePop(index)}
            className={`
              relative aspect-square rounded-xl
              ${isDark 
                ? 'bg-transparent border-2 border-gray-700' 
                : 'glass'}
              shadow-lg
              transition-all duration-300
              ${isDark ? 'text-white' : 'text-gray-800'}
              ${popped 
                ? 'scale-90 cursor-default backdrop-blur-sm' 
                : 'hover:scale-105 hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] cursor-pointer'}
              group
              overflow-hidden
              ${animatingBubbles.includes(index) ? 'animate-modern-pop' : ''}
            `}
          >
            {/* Pop animation overlay */}
            <div className={`
              absolute inset-0 rounded-xl
              transition-all duration-300
              ${popped 
                ? isDark 
                  ? 'bg-gray-800/90 backdrop-blur-md' 
                  : 'bg-white/90 backdrop-blur-md'
                : 'bg-transparent'
              }
            `}>
              {/* Bubble shine effect */}
              {!popped && (
                <div className="
                  absolute inset-0
                  bg-gradient-to-br
                  from-white/20
                  via-transparent
                  to-transparent
                  rounded-xl
                  group-hover:opacity-70
                "/>
              )}
              
              {/* Pop burst effect */}
              {animatingBubbles.includes(index) && (
                <>
                  <div className="
                    absolute inset-0
                    flex items-center justify-center
                  ">
                    <div className="
                      w-full h-full
                      bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                      animate-modern-burst
                      opacity-60
                      mix-blend-overlay
                    "/>
                  </div>
                  <div className="
                    absolute inset-0
                    flex items-center justify-center
                  ">
                    <div className="
                      w-3/4 h-3/4
                      rounded-full
                      bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500
                      animate-ripple
                      opacity-40
                      mix-blend-overlay
                    "/>
                  </div>
                </>
              )}
            </div>

            {/* Gradient border overlay for dark mode */}
            {isDark && !popped && (
              <div className="
                absolute inset-0 
                rounded-xl 
                opacity-0 
                group-hover:opacity-100
                transition-all
                duration-300
                before:absolute
                before:inset-0
                before:rounded-xl
                before:p-[2px]
                before:bg-gradient-to-r
                before:from-indigo-500
                before:via-purple-500
                before:to-pink-500
                before:content-['']
                after:absolute
                after:inset-[2px]
                after:rounded-xl
                after:bg-gray-900
                after:content-['']
              "/>
            )}

            {/* Popped state indicator */}
            {popped && (
              <div className={`
                absolute inset-0
                flex items-center justify-center
                opacity-60
              `}>
                <div className="
                  w-2 h-2 rounded-full
                  bg-gradient-to-r from-indigo-400 to-purple-400
                  shadow-lg shadow-purple-500/30
                "/>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}; 