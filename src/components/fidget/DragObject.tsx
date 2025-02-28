import React, { useState, useEffect, useRef } from 'react';
import { ThemeProps } from '../../types';
import { Plus, Minus, RotateCcw, Circle, Square, Triangle, Hexagon } from 'lucide-react';

interface DragObjectProps extends ThemeProps {
  dragPos: { x: number; y: number };
  isDragging: boolean;
  handleDragStart: (e: React.MouseEvent) => void;
  handleDragEnd: () => void;
  handleDrag: (e: React.MouseEvent) => void;
}

interface DraggableShape {
  id: number;
  x: number;
  y: number;
  rotation: number;
  shape: 'circle' | 'square' | 'triangle' | 'hexagon';
  color: string;
  isActive: boolean;
  velocity: { x: number; y: number };
}

const COLORS = [
  'from-indigo-400 to-purple-500',
  'from-rose-400 to-pink-500',
  'from-cyan-400 to-blue-500',
  'from-emerald-400 to-teal-500',
];

const SHAPES = ['circle', 'square', 'triangle', 'hexagon'] as const;

export const DragObject: React.FC<DragObjectProps> = ({
  isDark,
  dragPos: _dragPos,
  isDragging: _isDragging,
  handleDragStart: _handleDragStart,
  handleDragEnd: _handleDragEnd,
  handleDrag: _handleDrag,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shapes, setShapes] = useState<DraggableShape[]>([]);
  const [activeShape, setActiveShape] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedShape, setSelectedShape] = useState<typeof SHAPES[number]>('circle');
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [showControls, setShowControls] = useState(false);

  // Initialize one shape
  useEffect(() => {
    addShape();
  }, []);

  // Animation loop for continuous movement
  useEffect(() => {
    let animationId: number;
    
    const animate = () => {
      setShapes(prevShapes => {
        return prevShapes.map(shape => {
          if (shape.id === activeShape) return shape;

          let newX = shape.x + shape.velocity.x;
          let newY = shape.y + shape.velocity.y;
          
          // Bounce off walls
          if (containerRef.current) {
            const bounds = containerRef.current.getBoundingClientRect();
            if (newX < 0 || newX > bounds.width) shape.velocity.x *= -0.9;
            if (newY < 0 || newY > bounds.height) shape.velocity.y *= -0.9;
          }
          
          // Apply friction
          shape.velocity.x *= 0.99;
          shape.velocity.y *= 0.99;

          return {
            ...shape,
            x: newX,
            y: newY,
            rotation: shape.rotation + (Math.abs(shape.velocity.x) + Math.abs(shape.velocity.y)) * 0.5
          };
        });
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [activeShape]);

  const addShape = () => {
    const newShape: DraggableShape = {
      id: Date.now(),
      x: containerRef.current ? containerRef.current.clientWidth / 2 : 200,
      y: containerRef.current ? containerRef.current.clientHeight / 2 : 200,
      rotation: 0,
      shape: selectedShape,
      color: COLORS[shapes.length % COLORS.length],
      isActive: false,
      velocity: { x: 0, y: 0 }
    };
    setShapes(prev => [...prev, newShape]);
  };

  const removeShape = () => {
    if (shapes.length > 1) {
      setShapes(prev => prev.slice(0, -1));
    }
  };

  const resetShapes = () => {
    setShapes(shapes.map(shape => ({
      ...shape,
      velocity: { x: 0, y: 0 }
    })));
  };

  const handleDragStart = (e: React.MouseEvent, id: number) => {
    if (!containerRef.current) return;
    
    setIsDragging(true);
    setActiveShape(id);
    setLastMousePos({ x: e.clientX, y: e.clientY });
    
    setShapes(prev => prev.map(s => ({
      ...s,
      isActive: s.id === id
    })));
  };

  const handleDrag = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current || activeShape === null) return;

    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;
    
    setLastMousePos({ x: e.clientX, y: e.clientY });

    setShapes(prev => prev.map(shape => {
      if (shape.id === activeShape) {
        return {
          ...shape,
          x: shape.x + deltaX,
          y: shape.y + deltaY,
          velocity: {
            x: deltaX * 0.3,
            y: deltaY * 0.3
          }
        };
      }
      return shape;
    }));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setActiveShape(null);
    setShapes(prev => prev.map(s => ({ ...s, isActive: false })));
  };

  const getShapePath = (shape: 'circle' | 'square' | 'triangle' | 'hexagon') => {
    switch (shape) {
      case 'circle': return 'rounded-full';
      case 'square': return 'rounded-lg';
      case 'triangle': return 'clip-path-triangle';
      case 'hexagon': return 'clip-path-hexagon';
    }
  };

  const ShapeIcon = {
    circle: Circle,
    square: Square,
    triangle: Triangle,
    hexagon: Hexagon
  }[selectedShape];

  return (
    <div 
      ref={containerRef}
      className={`p-6 h-[400px] relative overflow-hidden ${isDark ? 'bg-gray-800/50' : 'bg-white/50'} rounded-xl backdrop-blur-sm`}
      onMouseMove={handleDrag}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Title */}
      <h2 className={`
        text-lg font-semibold mb-3
        ${isDark ? 'text-white' : 'text-gray-700'}
        transition-opacity duration-300
        ${showControls ? 'opacity-100' : 'opacity-50'}
      `}>
        Drag Objects
      </h2>

      {/* Controls */}
      <div className={`
        absolute top-6 right-6 
        flex items-center gap-2
        transition-opacity duration-300
        ${showControls ? 'opacity-100' : 'opacity-0'}
      `}>
        <button
          onClick={() => {
            const nextIndex = (SHAPES.indexOf(selectedShape) + 1) % SHAPES.length;
            setSelectedShape(SHAPES[nextIndex]);
          }}
          className={`
            p-2 rounded-full
            ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
            transition-colors duration-200
          `}
        >
          <ShapeIcon className={`w-4 h-4 ${isDark ? 'text-white' : 'text-gray-700'}`} />
        </button>
        <button
          onClick={addShape}
          className={`
            p-2 rounded-full
            ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
            transition-colors duration-200
          `}
        >
          <Plus className={`w-4 h-4 ${isDark ? 'text-white' : 'text-gray-700'}`} />
        </button>
        <button
          onClick={removeShape}
          className={`
            p-2 rounded-full
            ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
            transition-colors duration-200
            ${shapes.length <= 1 ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          disabled={shapes.length <= 1}
        >
          <Minus className={`w-4 h-4 ${isDark ? 'text-white' : 'text-gray-700'}`} />
        </button>
        <button
          onClick={resetShapes}
          className={`
            p-2 rounded-full
            ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
            transition-colors duration-200
          `}
        >
          <RotateCcw className={`w-4 h-4 ${isDark ? 'text-white' : 'text-gray-700'}`} />
        </button>
      </div>

      {/* Draggable Shapes */}
      {shapes.map((shape) => (
        <div
          key={shape.id}
          className={`
            absolute cursor-grab active:cursor-grabbing
            w-12 h-12
            ${getShapePath(shape.shape)}
            bg-gradient-to-br ${shape.color}
            shadow-lg
            transition-transform duration-200
            ${shape.isActive ? 'scale-110 z-10' : 'scale-100 hover:scale-105'}
          `}
          style={{
            left: shape.x,
            top: shape.y,
            transform: `translate(-50%, -50%) rotate(${shape.rotation}deg)`,
            clipPath: shape.shape === 'triangle' 
              ? 'polygon(50% 0%, 0% 100%, 100% 100%)'
              : shape.shape === 'hexagon'
                ? 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
                : undefined
          }}
          onMouseDown={(e) => handleDragStart(e, shape.id)}
        >
          <div className={`
            absolute inset-0 
            bg-gradient-to-br from-white/20 to-transparent
            ${getShapePath(shape.shape)}
            opacity-50
          `} />
        </div>
      ))}
    </div>
  );
}; 