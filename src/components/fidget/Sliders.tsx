import React, { useState, useEffect } from 'react';
import { Sliders as SlidersIcon, Plus, Minus, Trophy, Target, X, Clock, ChevronRight, Star } from 'lucide-react';
import { ThemeProps } from '../../types';
import { Achievement, SliderChallenge } from '../../hooks/useFidget';

interface SlidersProps extends ThemeProps {
  sliderPositions: number[];
  handleSliderChange: (index: number, value: number) => void;
  addSlider: () => void;
  removeSlider: () => void;
  score: number;
  achievements: Achievement[];
  currentChallenge: SliderChallenge | null;
  lastAchievement: Achievement | null;
  startChallenge: (challenge: SliderChallenge) => void;
}

// Array of complementary gradients
const GRADIENTS = [
  'from-indigo-400 to-purple-500',
  'from-rose-400 to-pink-500',
  'from-cyan-400 to-blue-500',
  'from-emerald-400 to-teal-500',
  'from-amber-400 to-orange-500',
];

// Predefined challenges with enhanced descriptions and difficulty levels
const CHALLENGES: (SliderChallenge & { difficulty: 'easy' | 'medium' | 'hard' })[] = [
  {
    targetPositions: [100, 75, 50, 25, 0],
    tolerance: 5,
    timeLimit: 5,
    description: 'Create a perfect descending pattern',
    difficulty: 'easy'
  },
  {
    targetPositions: [50, 100, 50, 100, 50],
    tolerance: 5,
    timeLimit: 5,
    description: 'Create an alternating pattern',
    difficulty: 'medium'
  },
  {
    targetPositions: [0, 25, 50, 75, 100],
    tolerance: 5,
    timeLimit: 5,
    description: 'Create a perfect ascending pattern',
    difficulty: 'hard'
  }
];

export const Sliders: React.FC<SlidersProps> = ({
  isDark,
  sliderPositions,
  handleSliderChange,
  addSlider,
  removeSlider,
  score,
  achievements,
  currentChallenge,
  lastAchievement,
  startChallenge,
}) => {
  const [showAchievements, setShowAchievements] = useState(false);
  const [challengeTime, setChallengeTime] = useState<number | null>(null);
  const [showChallenges, setShowChallenges] = useState(false);

  // Challenge timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentChallenge?.timeLimit && challengeTime !== null) {
      interval = setInterval(() => {
        setChallengeTime(prev => {
          if (prev === null) return null;
          const newTime = prev - 0.1;
          return newTime <= 0 ? 0 : newTime;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [currentChallenge, challengeTime]);

  // Reset timer when starting new challenge
  useEffect(() => {
    if (currentChallenge?.timeLimit) {
      setChallengeTime(currentChallenge.timeLimit);
    } else {
      setChallengeTime(null);
    }
  }, [currentChallenge]);

  const getDifficultyColor = (difficulty: 'easy' | 'medium' | 'hard') => {
    switch (difficulty) {
      case 'easy': return isDark ? 'text-green-400' : 'text-green-500';
      case 'medium': return isDark ? 'text-yellow-400' : 'text-yellow-500';
      case 'hard': return isDark ? 'text-red-400' : 'text-red-500';
    }
  };

  return (
    <div className="p-6 relative">
      {/* Header with Score and Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-700'}`}>
            Satisfying Sliders
          </h2>
          <div className={`
            px-4 py-1.5 rounded-full
            ${isDark ? 'bg-gray-800' : 'bg-white'}
            border ${isDark ? 'border-gray-700' : 'border-gray-200'}
            flex items-center gap-2
            transition-all duration-300
            hover:scale-105
            group
          `}>
            <Trophy className={`
              w-4 h-4 
              ${isDark ? 'text-yellow-500' : 'text-yellow-600'}
              transition-transform duration-300
              group-hover:rotate-12
            `} />
            <span className={`
              font-medium tabular-nums
              ${isDark ? 'text-white' : 'text-gray-900'}
            `}>
              {score.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setShowAchievements(!showAchievements);
              setShowChallenges(false);
            }}
            className={`
              p-2 rounded-full
              transition-all duration-300
              ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
              relative
              group
            `}
          >
            <Trophy className={`
              w-4 h-4 
              ${isDark ? 'text-white' : 'text-gray-700'}
              transition-transform duration-300
              group-hover:rotate-12
            `} />
            {achievements.some(a => a.unlocked) && (
              <div className="
                absolute -top-1 -right-1 w-2 h-2 
                bg-yellow-500 rounded-full
                animate-ping-slower
              " />
            )}
          </button>
          <button
            onClick={() => {
              setShowChallenges(!showChallenges);
              setShowAchievements(false);
            }}
            className={`
              p-2 rounded-full
              transition-all duration-300
              ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
              relative
              group
            `}
          >
            <Target className={`
              w-4 h-4 
              ${isDark ? 'text-white' : 'text-gray-700'}
              transition-transform duration-300
              group-hover:scale-110
            `} />
          </button>
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />
          <button
            onClick={removeSlider}
            disabled={sliderPositions.length <= 1}
            className={`
              p-2 rounded-full
              transition-all duration-300
              ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
              ${sliderPositions.length <= 1 ? 'opacity-50 cursor-not-allowed' : ''}
              group
            `}
          >
            <Minus className={`
              w-4 h-4 
              ${isDark ? 'text-white' : 'text-gray-700'}
              transition-transform duration-300
              group-hover:scale-110
            `} />
          </button>
          <button
            onClick={addSlider}
            className={`
              p-2 rounded-full
              transition-all duration-300
              ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
              group
            `}
          >
            <Plus className={`
              w-4 h-4 
              ${isDark ? 'text-white' : 'text-gray-700'}
              transition-transform duration-300
              group-hover:scale-110
            `} />
          </button>
        </div>
      </div>

      {/* Side Panels Container */}
      <div className={`
        fixed top-0 right-0 bottom-0
        w-96 max-w-[90vw]
        flex
        pointer-events-none
        z-50
      `}>
        {/* Achievements Panel */}
        <div className={`
          absolute inset-0
          pointer-events-auto
          transform transition-transform duration-300 ease-out
          ${showAchievements ? 'translate-x-0' : 'translate-x-full'}
        `}>
          <div className={`
            h-full w-full
            ${isDark ? 'bg-gray-800/95' : 'bg-white/95'}
            backdrop-blur-md
            border-l ${isDark ? 'border-gray-700' : 'border-gray-200'}
            p-6
            overflow-y-auto
            shadow-xl
          `}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Trophy className={`w-5 h-5 ${isDark ? 'text-yellow-500' : 'text-yellow-600'}`} />
                <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Achievements
                </h3>
              </div>
              <button
                onClick={() => setShowAchievements(false)}
                className={`
                  p-2 rounded-full
                  transition-colors duration-200
                  ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
                `}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid gap-4">
              {achievements.map(achievement => (
                <div
                  key={achievement.id}
                  className={`
                    p-4 rounded-lg
                    ${isDark ? 'bg-gray-700/50' : 'bg-gray-50/50'}
                    ${achievement.unlocked 
                      ? isDark ? 'border-yellow-500' : 'border-yellow-400'
                      : isDark ? 'border-gray-600' : 'border-gray-200'
                    }
                    border
                    transition-all duration-300
                    hover:scale-[1.02]
                    group
                    backdrop-blur-sm
                  `}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`
                      p-2 rounded-full
                      ${achievement.unlocked
                        ? isDark ? 'bg-yellow-500/20' : 'bg-yellow-100'
                        : isDark ? 'bg-gray-600/50' : 'bg-gray-200/50'
                      }
                      transition-colors duration-300
                    `}>
                      <Trophy className={`
                        w-4 h-4
                        ${achievement.unlocked
                          ? isDark ? 'text-yellow-500' : 'text-yellow-600'
                          : isDark ? 'text-gray-500' : 'text-gray-400'
                        }
                        transition-transform duration-300
                        group-hover:rotate-12
                      `} />
                    </div>
                    <h3 className={`
                      font-medium
                      ${isDark ? 'text-white' : 'text-gray-900'}
                      ${!achievement.unlocked && 'opacity-50'}
                    `}>
                      {achievement.title}
                    </h3>
                  </div>
                  <p className={`
                    text-sm
                    ${isDark ? 'text-gray-400' : 'text-gray-500'}
                    ${!achievement.unlocked && 'opacity-50'}
                  `}>
                    {achievement.description}
                  </p>
                  {achievement.unlocked && achievement.timestamp && (
                    <div className={`
                      mt-2 text-xs
                      ${isDark ? 'text-gray-500' : 'text-gray-400'}
                    `}>
                      Unlocked {new Date(achievement.timestamp).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Challenges Panel */}
        <div className={`
          absolute inset-0
          pointer-events-auto
          transform transition-transform duration-300 ease-out
          ${showChallenges ? 'translate-x-0' : 'translate-x-full'}
        `}>
          <div className={`
            h-full w-full
            ${isDark ? 'bg-gray-800/95' : 'bg-white/95'}
            backdrop-blur-md
            border-l ${isDark ? 'border-gray-700' : 'border-gray-200'}
            p-6
            overflow-y-auto
            shadow-xl
          `}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Target className={`w-5 h-5 ${isDark ? 'text-white' : 'text-gray-900'}`} />
                <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Challenges
                </h3>
              </div>
              <button
                onClick={() => setShowChallenges(false)}
                className={`
                  p-2 rounded-full
                  transition-colors duration-200
                  ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
                `}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid gap-3">
              {CHALLENGES.map((challenge, index) => (
                <button
                  key={index}
                  onClick={() => {
                    startChallenge(challenge);
                    setShowChallenges(false);
                  }}
                  className={`
                    p-4 rounded-lg
                    ${isDark ? 'bg-gray-700/50' : 'bg-gray-50/50'}
                    border ${isDark ? 'border-gray-600' : 'border-gray-200'}
                    transition-all duration-300
                    hover:scale-[1.02]
                    group
                    flex items-center justify-between
                    w-full
                    backdrop-blur-sm
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      p-2 rounded-full
                      ${isDark ? 'bg-gray-600/50' : 'bg-gray-200/50'}
                    `}>
                      <Target className={`
                        w-4 h-4
                        ${getDifficultyColor(challenge.difficulty)}
                        transition-transform duration-300
                        group-hover:scale-110
                      `} />
                    </div>
                    <div className="text-left">
                      <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {challenge.description}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`
                          text-xs px-2 py-0.5 rounded-full
                          ${getDifficultyColor(challenge.difficulty)}
                          ${isDark ? 'bg-gray-800' : 'bg-gray-100'}
                        `}>
                          {challenge.difficulty}
                        </div>
                        <div className={`
                          flex items-center gap-1
                          text-xs
                          ${isDark ? 'text-gray-400' : 'text-gray-500'}
                        `}>
                          <Clock className="w-3 h-3" />
                          {challenge.timeLimit}s
                        </div>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={`
                    w-4 h-4
                    ${isDark ? 'text-gray-400' : 'text-gray-500'}
                    transition-transform duration-300
                    group-hover:translate-x-1
                  `} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Current Challenge */}
      {currentChallenge && (
        <div className={`
          mb-6 p-4 rounded-xl
          ${isDark ? 'bg-gray-800/50' : 'bg-white/50'}
          backdrop-blur-sm
          border ${isDark ? 'border-gray-700' : 'border-gray-200'}
          animate-fade-in
        `}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Current Challenge
            </h3>
            {challengeTime !== null && (
              <div className={`
                px-3 py-1 rounded-full
                ${challengeTime <= currentChallenge.timeLimit! * 0.3
                  ? isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-500'
                  : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                }
                font-medium tabular-nums
                ${challengeTime <= currentChallenge.timeLimit! * 0.3 ? 'animate-pulse' : ''}
              `}>
                {challengeTime.toFixed(1)}s
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 mb-4">
            <div className={`
              text-xs px-2 py-0.5 rounded-full
              ${getDifficultyColor((currentChallenge as any).difficulty)}
              ${isDark ? 'bg-gray-700' : 'bg-gray-100'}
            `}>
              {(currentChallenge as any).difficulty}
            </div>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {currentChallenge.description}
            </p>
          </div>
          <div className="flex gap-2">
            {currentChallenge.targetPositions.map((target, index) => (
              <div
                key={index}
                className={`
                  flex-1 h-2 rounded-full
                  ${isDark ? 'bg-gray-700' : 'bg-gray-200'}
                  relative
                `}
              >
                <div
                  className={`
                    absolute h-4 w-1
                    ${Math.abs(sliderPositions[index] - target) <= currentChallenge.tolerance
                      ? 'bg-green-500 animate-pulse'
                      : 'bg-yellow-500'
                    }
                    rounded-full -translate-y-1
                    transition-colors duration-300
                  `}
                  style={{ left: `${target}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievement Notification */}
      {lastAchievement && (
        <div className={`
          fixed bottom-4 right-4 
          p-4 rounded-lg
          bg-gradient-to-r from-yellow-500 to-amber-500
          text-white
          shadow-lg
          animate-slide-up
          flex items-center gap-3
          z-40
          group
        `}>
          <div className="p-2 bg-white/10 rounded-full">
            <Trophy className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="font-medium flex items-center gap-2">
              <Star className="w-4 h-4" />
              {lastAchievement.title}
            </div>
            <div className="text-sm opacity-90 mt-0.5">
              {lastAchievement.description}
            </div>
          </div>
        </div>
      )}

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