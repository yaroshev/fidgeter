import { useState, useEffect } from 'react';
import { DragPosition } from '../types';

export const useFidget = () => {
  const [popBubbles, setPopBubbles] = useState<boolean[]>(Array(24).fill(false));
  const [sliderPositions, setSliderPositions] = useState<number[]>([30, 50, 70, 40, 60]);
  const [dragPos, setDragPos] = useState<DragPosition>({ x: 150, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [spinAngle, setSpinAngle] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  // Pop bubble functions
  const popBubble = (index: number) => {
    const newBubbles = [...popBubbles];
    newBubbles[index] = true;
    setPopBubbles(newBubbles);
  };

  const resetBubbles = () => {
    setPopBubbles(Array(popBubbles.length).fill(false));
  };

  const addBubbleRow = () => {
    setPopBubbles(prev => [...prev, ...Array(6).fill(false)]);
  };

  const removeBubbleRow = () => {
    if (popBubbles.length > 6) { // Keep at least one row
      setPopBubbles(prev => prev.slice(0, prev.length - 6));
    }
  };

  // Drag functions
  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDrag = (e: React.MouseEvent) => {
    if (isDragging) {
      const parentRect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - parentRect.left - 25;
      const y = e.clientY - parentRect.top - 25;
      const boundedX = Math.max(0, Math.min(x, parentRect.width - 50));
      const boundedY = Math.max(0, Math.min(y, parentRect.height - 50));
      setDragPos({ x: boundedX, y: boundedY });
    }
  };

  // Slider functions
  const addSlider = () => {
    setSliderPositions(prev => {
      const lastValue = prev[prev.length - 1] || 50;
      return [...prev, (lastValue + 20) % 100];
    });
  };

  const removeSlider = () => {
    if (sliderPositions.length > 1) {
      setSliderPositions(prev => prev.slice(0, -1));
    }
  };

  const handleSliderChange = (index: number, value: number) => {
    const newPositions = [...sliderPositions];
    const previousValue = newPositions[index];
    const direction = value - previousValue; // Positive for up, negative for down
    newPositions[index] = value;
    
    // Create a gentler wave effect on other sliders
    for (let i = 0; i < newPositions.length; i++) {
      if (i !== index) {
        // Calculate distance from changed slider (0 to 1)
        const distance = Math.abs(i - index) / newPositions.length;
        // Calculate wave influence (stronger for closer sliders)
        const influence = Math.pow(1 - distance, 2) * 0.3; // Reduced influence
        // Calculate the wave effect based on movement direction
        const wave = direction * influence * 10; // Scale the effect based on movement
        // Apply the wave effect to the current position with bounds
        newPositions[i] = Math.max(0, Math.min(100, newPositions[i] + wave));
      }
    }
    
    setSliderPositions(newPositions);
  };

  // Spin functions
  const toggleSpin = () => {
    setIsSpinning(!isSpinning);
  };

  useEffect(() => {
    let animationId: number;
    if (isSpinning) {
      const animate = () => {
        setSpinAngle(prevAngle => (prevAngle + 2) % 360);
        animationId = requestAnimationFrame(animate);
      };
      animationId = requestAnimationFrame(animate);
    }
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isSpinning]);

  return {
    popBubbles,
    sliderPositions,
    dragPos,
    isDragging,
    spinAngle,
    isSpinning,
    popBubble,
    resetBubbles,
    addBubbleRow,
    removeBubbleRow,
    handleDragStart,
    handleDragEnd,
    handleDrag,
    handleSliderChange,
    addSlider,
    removeSlider,
    toggleSpin,
  };
}; 