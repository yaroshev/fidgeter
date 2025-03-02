import { useState, useEffect } from 'react';
import { DragPosition } from '../types';

// Define achievement types
export type Achievement = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  timestamp?: number;
};

export type SliderChallenge = {
  targetPositions: number[];
  tolerance: number;
  timeLimit?: number;
  description: string;
};

export const useFidget = () => {
  const [popBubbles, setPopBubbles] = useState<boolean[]>(Array(24).fill(false));
  const [sliderPositions, setSliderPositions] = useState<number[]>([30, 50, 70, 40, 60]);
  const [dragPos, setDragPos] = useState<DragPosition>({ x: 150, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [spinAngle, setSpinAngle] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  
  // Gamification state
  const [score, setScore] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: 'perfect', title: 'Perfect Alignment', description: 'Get all sliders to the same position', unlocked: false },
    { id: 'wave', title: 'Wave Master', description: 'Create a perfect wave pattern', unlocked: false },
    { id: 'speed', title: 'Speed Demon', description: 'Move all sliders to target positions in under 3 seconds', unlocked: false },
    { id: 'symmetry', title: 'Symmetry Expert', description: 'Create a perfectly symmetrical pattern', unlocked: false },
  ]);
  const [currentChallenge, setCurrentChallenge] = useState<SliderChallenge | null>(null);
  const [challengeStartTime, setChallengeStartTime] = useState<number | null>(null);
  const [lastAchievement, setLastAchievement] = useState<Achievement | null>(null);

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
    const direction = value - previousValue;
    newPositions[index] = value;
    
    // Create a gentler wave effect on other sliders
    for (let i = 0; i < newPositions.length; i++) {
      if (i !== index) {
        const distance = Math.abs(i - index) / newPositions.length;
        const influence = Math.pow(1 - distance, 2) * 0.3;
        const wave = direction * influence * 10;
        newPositions[i] = Math.max(0, Math.min(100, newPositions[i] + wave));
      }
    }
    
    setSliderPositions(newPositions);
    
    // Check for achievements
    checkAchievements(newPositions);
    
    // Check challenge progress
    if (currentChallenge) {
      checkChallengeProgress(newPositions);
    }
  };

  // Achievement checking
  const checkAchievements = (positions: number[]) => {
    // Perfect alignment achievement
    if (!achievements.find(a => a.id === 'perfect')?.unlocked) {
      const isPerfect = positions.every(pos => Math.abs(pos - positions[0]) < 2);
      if (isPerfect) {
        unlockAchievement('perfect');
        setScore(prev => prev + 1000);
      }
    }

    // Wave pattern achievement
    if (!achievements.find(a => a.id === 'wave')?.unlocked) {
      const isWave = positions.every((pos, i) => {
        if (i === 0) return true;
        const diff = pos - positions[i - 1];
        return i % 2 === 1 ? diff > 15 : diff < -15;
      });
      if (isWave) {
        unlockAchievement('wave');
        setScore(prev => prev + 800);
      }
    }

    // Symmetry achievement
    if (!achievements.find(a => a.id === 'symmetry')?.unlocked) {
      const mid = Math.floor(positions.length / 2);
      const isSymmetrical = positions.slice(0, mid).every((pos, i) => 
        Math.abs(pos - positions[positions.length - 1 - i]) < 2
      );
      if (isSymmetrical && positions.length > 1) {
        unlockAchievement('symmetry');
        setScore(prev => prev + 500);
      }
    }
  };

  const unlockAchievement = (id: string) => {
    setAchievements(prev => prev.map(achievement => {
      if (achievement.id === id && !achievement.unlocked) {
        const unlockedAchievement = {
          ...achievement,
          unlocked: true,
          timestamp: Date.now()
        };
        setLastAchievement(unlockedAchievement);
        setTimeout(() => setLastAchievement(null), 3000);
        return unlockedAchievement;
      }
      return achievement;
    }));
  };

  // Challenge system
  const startChallenge = (challenge: SliderChallenge) => {
    setCurrentChallenge(challenge);
    setChallengeStartTime(Date.now());
  };

  const checkChallengeProgress = (positions: number[]) => {
    if (!currentChallenge || !challengeStartTime) return;

    const isComplete = positions.every((pos, i) => 
      Math.abs(pos - currentChallenge.targetPositions[i]) <= currentChallenge.tolerance
    );

    if (isComplete) {
      const timeElapsed = (Date.now() - challengeStartTime) / 1000;
      
      // Speed achievement
      if (!achievements.find(a => a.id === 'speed')?.unlocked && 
          timeElapsed <= 3 && 
          currentChallenge.timeLimit) {
        unlockAchievement('speed');
        setScore(prev => prev + 1500);
      }

      // Regular challenge completion score
      setScore(prev => prev + 500);
      setCurrentChallenge(null);
      setChallengeStartTime(null);
    }
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
    score,
    achievements,
    currentChallenge,
    lastAchievement,
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
    startChallenge,
  };
}; 