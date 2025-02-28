import React from 'react';
import { ThemeProps } from '../../types';
import { PopBubbles } from './PopBubbles';
import { DragObject } from './DragObject';
import { Sliders } from './Sliders';
import { Spinner } from './Spinner';
import { useFidget } from '../../hooks/useFidget';

interface FidgetContainerProps extends ThemeProps {
  activeTab: string;
}

export const FidgetContainer: React.FC<FidgetContainerProps> = ({ isDark, activeTab }) => {
  const fidgetControls = useFidget();
  
  // Calculate background style based on slider positions
  const getContainerStyle = () => {
    if (activeTab !== 'slide') return {};
    
    // Calculate average position
    const avgPosition = fidgetControls.sliderPositions.reduce((a, b) => a + b, 0) / fidgetControls.sliderPositions.length;
    
    // Create a gradient based on the average position
    return {
      background: `linear-gradient(135deg, 
        ${isDark ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.8)'}, 
        ${getGradientColor(avgPosition / 100)})`,
      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
    };
  };

  // Get gradient color based on position with smooth interpolation
  const getGradientColor = (position: number) => {
    // Create an array of color stops with RGBA values for smooth interpolation
    const colors = [
      { pos: 0, color: isDark ? [79, 70, 229, 0.4] : [99, 102, 241, 0.2] },
      { pos: 0.33, color: isDark ? [139, 92, 246, 0.4] : [167, 139, 250, 0.2] },
      { pos: 0.66, color: isDark ? [236, 72, 153, 0.4] : [244, 114, 182, 0.2] },
      { pos: 1, color: isDark ? [248, 113, 113, 0.4] : [251, 146, 146, 0.2] }
    ];
    
    // Find the two colors to interpolate between
    let lower = colors[0];
    let upper = colors[colors.length - 1];
    
    for (let i = 0; i < colors.length - 1; i++) {
      if (position >= colors[i].pos && position <= colors[i + 1].pos) {
        lower = colors[i];
        upper = colors[i + 1];
        break;
      }
    }
    
    // Calculate how far between the two colors we are (0 to 1)
    const t = (position - lower.pos) / (upper.pos - lower.pos);
    
    // Interpolate between the two colors
    const r = Math.round(lower.color[0] * (1 - t) + upper.color[0] * t);
    const g = Math.round(lower.color[1] * (1 - t) + upper.color[1] * t);
    const b = Math.round(lower.color[2] * (1 - t) + upper.color[2] * t);
    const a = lower.color[3] * (1 - t) + upper.color[3] * t;
    
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  return (
    <div 
      className={`w-full max-w-lg ${isDark ? 'glass-dark' : 'glass'} rounded-xl shadow-xl overflow-hidden`}
      style={getContainerStyle()}
    >
      {/* Fidget Content */}
      <div>
        {activeTab === 'pop' && <PopBubbles isDark={isDark} {...fidgetControls} />}
        {activeTab === 'drag' && <DragObject isDark={isDark} {...fidgetControls} />}
        {activeTab === 'slide' && <Sliders isDark={isDark} {...fidgetControls} />}
        {activeTab === 'spin' && <Spinner isDark={isDark} {...fidgetControls} />}
      </div>
    </div>
  );
}; 