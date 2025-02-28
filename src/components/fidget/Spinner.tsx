import React, { useState, useRef } from 'react';
import { ThemeProps } from '../../types';
import { ChevronUp, ChevronDown, RotateCcw, RotateCw, CircleDot, Triangle, Square, Hexagon } from 'lucide-react';

type SpinnerDesign = 'classic' | 'minimal' | 'geometric' | 'industrial';

interface SpinnerProps extends ThemeProps {
  spinAngle: number;
  isSpinning: boolean;
  toggleSpin: () => void;
}

export const Spinner: React.FC<SpinnerProps> = ({
  isDark,
  spinAngle,
  isSpinning,
  toggleSpin,
}) => {
  const spinnerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentAngle, setCurrentAngle] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [direction, setDirection] = useState<'clockwise' | 'counterclockwise'>('clockwise');
  const [design, setDesign] = useState<SpinnerDesign>('classic');
  const lastMousePos = useRef({ x: 0, y: 0 });
  const lastUpdateTime = useRef(Date.now());
  const frameRef = useRef<number>();

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!spinnerRef.current) return;
    e.preventDefault();
    setIsDragging(true);
    
    const rect = spinnerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    lastMousePos.current = { x: e.clientX - centerX, y: e.clientY - centerY };
    lastUpdateTime.current = Date.now();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !spinnerRef.current) return;
    
    const rect = spinnerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const currentPos = {
      x: e.clientX - centerX,
      y: e.clientY - centerY
    };

    // Calculate angles
    const lastAngle = Math.atan2(lastMousePos.current.y, lastMousePos.current.x);
    const newAngle = Math.atan2(currentPos.y, currentPos.x);
    let deltaAngle = (newAngle - lastAngle) * (180 / Math.PI);

    // Normalize the angle difference
    if (deltaAngle > 180) deltaAngle -= 360;
    if (deltaAngle < -180) deltaAngle += 360;

    // Calculate time difference
    const now = Date.now();
    const deltaTime = (now - lastUpdateTime.current) / 1000;
    
    // Update velocity based on mouse movement and direction
    const newVelocity = deltaAngle / deltaTime * (direction === 'clockwise' ? 1 : -1);
    setVelocity(newVelocity);
    
    // Update angle
    setCurrentAngle(prev => prev + deltaAngle);
    
    // Update references
    lastMousePos.current = currentPos;
    lastUpdateTime.current = now;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const adjustVelocity = (delta: number) => {
    setVelocity(prev => {
      const newVelocity = prev + delta * (direction === 'clockwise' ? 1 : -1);
      return Math.min(Math.max(newVelocity, -1000), 1000);
    });
  };

  const toggleDirection = () => {
    setDirection(prev => prev === 'clockwise' ? 'counterclockwise' : 'clockwise');
    setVelocity(prev => -prev);
  };

  // Animation loop
  React.useEffect(() => {
    const animate = () => {
      if (!isDragging) {
        // Apply friction
        setVelocity(prev => {
          const friction = 0.98;
          return Math.abs(prev) < 0.1 ? 0 : prev * friction;
        });
        
        setCurrentAngle(prev => prev + velocity * 0.016);
      }
      
      frameRef.current = requestAnimationFrame(animate);
    };
    
    frameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isDragging, velocity]);

  const getSpeedLabel = () => {
    const absVelocity = Math.abs(velocity);
    if (absVelocity < 0.1) return 'Stopped';
    if (absVelocity < 100) return 'Slow';
    if (absVelocity < 300) return 'Medium';
    if (absVelocity < 600) return 'Fast';
    return 'Super Fast';
  };

  const renderSpinnerDesign = () => {
    switch (design) {
      case 'minimal':
        return (
          <>
            {/* Center dot with rings */}
            <div className={`
              absolute w-12 h-12 rounded-full
              ${isDark ? 'bg-gray-800' : 'bg-white'}
              shadow-lg z-10
              flex items-center justify-center
              border ${isDark ? 'border-gray-700' : 'border-gray-200'}
            `}>
              <div className={`
                w-8 h-8 rounded-full
                ${isDark ? 'bg-gray-700' : 'bg-gray-100'}
                flex items-center justify-center
                border ${isDark ? 'border-gray-600' : 'border-gray-300'}
              `}>
                <div className={`
                  w-4 h-4 rounded-full
                  ${isDark ? 'bg-indigo-500' : 'bg-indigo-400'}
                  shadow-inner
                `} />
              </div>
            </div>
            
            {/* Three thin arms with gradient */}
            {[0, 120, 240].map((rotation) => (
              <div
                key={rotation}
                className="absolute"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transformOrigin: '50% 50%'
                }}
              >
                {/* Main arm with gradient */}
                <div className={`
                  absolute h-1.5 w-32 left-0
                  rounded-full
                  overflow-hidden
                  ${isDark ? 'bg-gray-700' : 'bg-gray-200'}
                `}>
                  <div className={`
                    absolute inset-0
                    bg-gradient-to-r
                    ${isDark 
                      ? 'from-indigo-500/30 via-purple-500/30 to-pink-500/30' 
                      : 'from-indigo-400/20 via-purple-400/20 to-pink-400/20'
                    }
                  `} />
                </div>

                {/* End weight with inner glow */}
                <div className={`
                  absolute right-0 w-6 h-6 rounded-full
                  ${isDark ? 'bg-gray-800' : 'bg-white'}
                  -translate-y-2
                  shadow-lg
                  border-2 ${isDark ? 'border-gray-700' : 'border-gray-200'}
                  flex items-center justify-center
                  overflow-hidden
                `}>
                  <div className={`
                    absolute inset-0.5 rounded-full
                    ${isDark ? 'bg-indigo-500' : 'bg-indigo-400'}
                    opacity-80
                  `} />
                  <div className={`
                    absolute inset-1 rounded-full
                    bg-gradient-to-br from-white/30 to-transparent
                  `} />
                </div>
              </div>
            ))}
          </>
        );

      case 'geometric':
        return (
          <>
            {/* Center hexagon with layers */}
            <div className={`
              absolute w-16 h-16 z-10
              ${isDark ? 'text-gray-800' : 'text-white'}
              flex items-center justify-center
            `}>
              <div className={`
                absolute w-full h-full
                ${isDark ? 'text-indigo-500' : 'text-indigo-400'}
                transform rotate-0
                transition-transform duration-200
                ${isDragging ? 'scale-95' : ''}
              `}>
                <Hexagon className="w-full h-full stroke-2" />
              </div>
              <div className={`
                absolute w-3/4 h-3/4
                ${isDark ? 'text-gray-700' : 'text-gray-200'}
                transform rotate-[30deg]
              `}>
                <Hexagon className="w-full h-full" />
              </div>
              <div className={`
                absolute w-1/2 h-1/2
                ${isDark ? 'text-indigo-500' : 'text-indigo-400'}
                transform rotate-[60deg]
                opacity-50
              `}>
                <Hexagon className="w-full h-full" />
              </div>
            </div>
            
            {/* Three geometric arms */}
            {[0, 120, 240].map((rotation) => (
              <div
                key={rotation}
                className="absolute w-32 h-8"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transformOrigin: '50% 50%'
                }}
              >
                {/* Arm with gradient overlay */}
                <div className={`
                  absolute h-1 w-full
                  ${isDark ? 'bg-gray-700' : 'bg-gray-200'}
                  overflow-hidden
                `}>
                  <div className={`
                    absolute inset-0
                    bg-gradient-to-r
                    ${isDark 
                      ? 'from-indigo-500/30 via-purple-500/30 to-pink-500/30' 
                      : 'from-indigo-400/20 via-purple-400/20 to-pink-400/20'
                    }
                  `} />
                </div>

                {/* End triangle with glow */}
                <div className={`
                  absolute right-0 w-8 h-8
                  ${isDark ? 'text-gray-800' : 'text-white'}
                  transform -translate-y-4
                  flex items-center justify-center
                `}>
                  <div className={`
                    absolute inset-0
                    ${isDark ? 'text-indigo-500' : 'text-indigo-400'}
                    transform rotate-90
                  `}>
                    <Triangle className="w-full h-full fill-current" strokeWidth={1.5} />
                  </div>
                  <div className={`
                    absolute inset-1
                    ${isDark ? 'text-indigo-400' : 'text-indigo-300'}
                    transform rotate-90 scale-90
                    opacity-50
                  `}>
                    <Triangle className="w-full h-full fill-current" strokeWidth={1.5} />
                  </div>
                </div>
              </div>
            ))}
          </>
        );

      case 'industrial':
        return (
          <>
            {/* Center bearing */}
            <div className={`
              absolute w-16 h-16 rounded-full
              ${isDark ? 'bg-gray-800' : 'bg-gray-100'}
              border-4 ${isDark ? 'border-gray-700' : 'border-gray-300'}
              shadow-inner z-10
              flex items-center justify-center
            `}>
              <div className={`
                w-8 h-8 rounded-full
                border-2 ${isDark ? 'border-gray-700' : 'border-gray-300'}
                flex items-center justify-center
              `}>
                <div className={`
                  w-4 h-4 rounded-full
                  ${isDark ? 'bg-gray-700' : 'bg-gray-300'}
                `} />
              </div>
            </div>
            
            {/* Three industrial arms */}
            {[0, 120, 240].map((rotation) => (
              <div
                key={rotation}
                className={`
                  absolute h-3
                  ${isDark ? 'bg-gray-800' : 'bg-gray-100'}
                  border-2 ${isDark ? 'border-gray-700' : 'border-gray-300'}
                `}
                style={{
                  width: '6rem',
                  transform: `rotate(${rotation}deg)`,
                  transformOrigin: '50% 50%'
                }}
              >
                <div className={`
                  absolute right-0 w-8 h-8
                  ${isDark ? 'bg-gray-800' : 'bg-gray-100'}
                  border-2 ${isDark ? 'border-gray-700' : 'border-gray-300'}
                  rounded-lg
                  -translate-y-2.5
                `} />
              </div>
            ))}
          </>
        );

      default: // 'classic'
        return (
          <>
            {/* Center bearing */}
            <div className={`
              absolute w-16 h-16 rounded-full
              ${isDark ? 'bg-gray-800' : 'bg-white'}
              shadow-lg z-10
              border-4 ${isDark ? 'border-gray-700' : 'border-gray-200'}
              flex items-center justify-center
            `}>
              <div className={`
                w-8 h-8 rounded-full
                ${isDark ? 'bg-gray-700' : 'bg-gray-100'}
                shadow-inner
              `} />
            </div>

            {/* Lobes */}
            {[0, 120, 240].map((rotation) => (
              <div
                key={rotation}
                className={`
                  absolute w-20 h-20 rounded-full
                  ${isDark ? 'bg-gray-800' : 'bg-white'}
                  shadow-lg
                  border-4 ${isDark ? 'border-gray-700' : 'border-gray-200'}
                `}
                style={{
                  transform: `rotate(${rotation}deg) translateX(5rem)`,
                }}
              >
                <div className={`
                  absolute inset-2 rounded-full
                  ${isDark ? 'bg-gray-700' : 'bg-gray-100'}
                  shadow-inner
                `} />
              </div>
            ))}

            {/* Connecting arms */}
            {[0, 120, 240].map((rotation) => (
              <div
                key={rotation}
                className={`
                  absolute h-2 left-1/2
                  ${isDark ? 'bg-gray-800' : 'bg-white'}
                  shadow-lg
                  border-2 ${isDark ? 'border-gray-700' : 'border-gray-200'}
                  rounded-full
                `}
                style={{
                  width: '5rem',
                  transform: `rotate(${rotation}deg)`,
                  transformOrigin: '0 50%'
                }}
              />
            ))}
          </>
        );
    }
  };

  return (
    <div className="p-6 flex flex-col items-center gap-6">
      {/* Controls */}
      <div className={`
        flex items-center gap-4
        ${isDark ? 'text-white' : 'text-gray-800'}
      `}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => adjustVelocity(-50)}
            className={`
              p-2 rounded-full
              transition-all duration-300
              ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
              disabled:opacity-50
              group
            `}
          >
            <ChevronDown className="w-5 h-5 transition-transform group-hover:scale-110" />
          </button>
          <div className={`
            px-4 py-1 rounded-full text-sm font-medium
            ${isDark ? 'bg-gray-800' : 'bg-white'}
            border ${isDark ? 'border-gray-700' : 'border-gray-200'}
            min-w-[80px] text-center
          `}>
            {getSpeedLabel()}
          </div>
          <button
            onClick={() => adjustVelocity(50)}
            className={`
              p-2 rounded-full
              transition-all duration-300
              ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
              group
            `}
          >
            <ChevronUp className="w-5 h-5 transition-transform group-hover:scale-110" />
          </button>
        </div>

        <button
          onClick={toggleDirection}
          className={`
            p-2 rounded-full
            transition-all duration-300
            ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
            group
          `}
        >
          {direction === 'clockwise' ? (
            <RotateCw className="w-5 h-5 transition-transform group-hover:scale-110" />
          ) : (
            <RotateCcw className="w-5 h-5 transition-transform group-hover:scale-110" />
          )}
        </button>
      </div>

      {/* Design selector */}
      <div className="flex gap-2">
        {(['classic', 'minimal', 'geometric', 'industrial'] as const).map((d) => (
          <button
            key={d}
            onClick={() => setDesign(d)}
            className={`
              px-3 py-1 rounded-full text-sm
              transition-all duration-300
              ${design === d 
                ? isDark 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-indigo-100 text-indigo-600'
                : isDark
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                  : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-100'
              }
            `}
          >
            {d.charAt(0).toUpperCase() + d.slice(1)}
          </button>
        ))}
      </div>

      {/* Main Spinner */}
      <div
        ref={spinnerRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`
          relative w-64 h-64
          flex items-center justify-center
          cursor-grab
          transition-transform duration-300
          ${isDragging ? 'cursor-grabbing scale-95' : 'hover:scale-105'}
        `}
        style={{
          transform: `rotate(${currentAngle}deg)`,
          transition: isDragging ? 'none' : undefined
        }}
      >
        {renderSpinnerDesign()}
      </div>
    </div>
  );
}; 