import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { ThemeProps } from '../../types';

interface ThemeToggleProps extends ThemeProps {
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`
        relative w-14 h-7 rounded-full 
        transition-all duration-300 ease-out
        ${isDark 
          ? 'bg-[linear-gradient(145deg,#1f2937,#374151)] shadow-inner' 
          : 'bg-[linear-gradient(145deg,#e5e7eb,#f3f4f6)]'
        }
        border ${isDark ? 'border-gray-700' : 'border-gray-200'}
        group
        hover:scale-105
        before:absolute before:content-[''] 
        before:top-1/2 before:left-[3px] before:-translate-y-1/2
        before:w-5 before:h-5 before:rounded-full 
        ${isDark
          ? 'before:bg-[linear-gradient(145deg,#6366f1,#4f46e5)]'
          : 'before:bg-[linear-gradient(145deg,#fbbf24,#f59e0b)]'
        }
        before:shadow-lg
        before:transition-all before:duration-300 before:ease-out
        ${isDark ? 'before:translate-x-[28px]' : 'before:translate-x-0'}
        hover:before:scale-95 active:before:scale-90
      `}
      aria-label="Toggle theme"
    >
      <div className="absolute inset-0 overflow-hidden rounded-full">
        <span className={`
          absolute right-2 top-1/2 -translate-y-1/2 
          w-5 h-5 flex items-center justify-center 
          transition-all duration-300
          ${isDark ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}
        `}>
          <Sun className="w-3.5 h-3.5 text-amber-500" />
        </span>
        <span className={`
          absolute left-2 top-1/2 -translate-y-1/2 
          w-5 h-5 flex items-center justify-center 
          transition-all duration-300
          ${isDark ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}
        `}>
          <Moon className="w-3.5 h-3.5 text-indigo-300" />
        </span>
      </div>
    </button>
  );
}; 