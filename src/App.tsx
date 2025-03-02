import React, { useState } from 'react';
import { ThemeToggle } from './components/ui/ThemeToggle';
import { ButtonGrid } from './components/buttons/ButtonGrid';
import { FidgetContainer } from './components/fidget/FidgetContainer';
import { useTheme } from './hooks/useTheme';
import { Button } from './types';
import { 
  MousePointer2, 
  Fingerprint, 
  SlidersHorizontal, 
  RotateCw,
  Gamepad2
} from 'lucide-react';

const buttons: Button[] = [
  { id: 'button1', text: 'Press Me!' },
  { id: 'button2', text: 'Press Me!' },
  { id: 'button3', text: 'Press Me!' },
  { id: 'button4', text: 'Press Me!' },
  { id: 'button5', text: 'Press Me!' },
  { id: 'button6', text: 'Press Me!' },
  { id: 'button7', text: 'Press Me!' },
  { id: 'button8', text: 'Press Me!' },
  { id: 'button9', text: 'Press Me!' },
  { id: 'button10', text: 'Press Me!' },
  { id: 'button11', text: 'Press Me!' },
  { id: 'button12', text: 'Press Me!' },
];

const fidgetOptions = [
  { id: 'buttons', label: 'Buttons', icon: Gamepad2 },
  { id: 'pop', label: 'Pop', icon: Fingerprint },
  { id: 'drag', label: 'Drag', icon: MousePointer2 },
  { id: 'slide', label: 'Slide', icon: SlidersHorizontal },
  { id: 'spin', label: 'Spin', icon: RotateCw }
];

function App() {
  const { isDark, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('landing');

  const renderContent = () => {
    console.log('Current section:', activeSection);
    
    switch (activeSection) {
      case 'landing':
        return (
          <div className={`
            flex flex-col items-center justify-center gap-8 
            max-w-4xl mx-auto text-center p-8
            animate-in fade-in duration-500
            mt-20 pb-16
          `}>
            <h1 className={`
              text-6xl font-bold 
              bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
              bg-clip-text text-transparent
              animate-gradient-rotate
              py-2
            `}>
              Welcome to Fidgeteer
            </h1>
            <p className={`
              text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}
              max-w-2xl
              px-4
            `}>
              Your ultimate destination for digital fidgeting! Explore our collection of satisfying interactive elements designed to keep your hands busy and your mind engaged.
            </p>
            <div className="flex gap-4 flex-wrap justify-center px-4">
              {fidgetOptions.map((option) => {
                const Icon = option.icon;
                return (
    <button
                    key={option.id}
                    onClick={() => setActiveSection(option.id)}
                    className={`
                      relative px-6 py-3 rounded-full
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
                      flex items-center gap-3
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
                    {/* Sweeping Gradient Overlay */}
                    <div className="
                      absolute inset-0 opacity-0 group-hover:opacity-100 
                      transition-opacity duration-300
                      overflow-hidden rounded-full
                    ">
                      <div className={`
                        absolute inset-0 bg-gradient-to-r from-transparent 
                        ${isDark ? 'via-indigo-500/20' : 'via-indigo-400/20'} 
                        to-transparent translate-x-[-100%]
                        transition-transform duration-[2000ms] ease-in-out
                        group-hover:translate-x-[100%]
                        transform
                      `} />
      </div>
                    <Icon className="w-5 h-5 relative z-10" />
                    <span className="font-medium relative z-10">{option.label}</span>
    </button>
  );
              })}
            </div>
          </div>
        );
      case 'buttons':
        return <ButtonGrid buttons={buttons} isDark={isDark} />;
      default:
        return <FidgetContainer isDark={isDark} activeTab={activeSection} />;
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    }`}>
      {/* Detached Navigation Bar */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4">
        <div className={`
          ${isDark ? 'bg-gray-800/90' : 'bg-white/90'} 
          backdrop-blur-md
          rounded-full
          py-3 px-8
          shadow-lg
          flex items-center
          border ${isDark ? 'border-gray-700' : 'border-gray-200'}
          transition-all duration-300
          hover:shadow-xl
          hover:scale-[1.02]
          ${isDark 
            ? 'hover:bg-gray-800/95 hover:border-transparent hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]' 
            : 'hover:bg-white/95 hover:border-indigo-200 hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]'}
          w-full
          relative
          overflow-hidden
          group
        `}>
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
              before:p-[1px]
              before:bg-gradient-to-r
              before:from-indigo-500
              before:via-purple-500
              before:to-pink-500
              before:content-['']
              after:absolute
              after:inset-[1px]
              after:rounded-full
              after:bg-gray-800/90
              after:content-['']
              after:backdrop-blur-md
            "/>
          )}

          {/* Sweeping Gradient Overlay */}
          <div className={`
            absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
            overflow-hidden rounded-full
          `}>
            <div className={`
              absolute inset-0 bg-gradient-to-r from-transparent 
              ${isDark 
                ? 'via-indigo-500/20' 
                : 'via-indigo-400/20'} 
              to-transparent translate-x-[-100%]
              transition-transform duration-[2000ms] ease-in-out
              group-hover:translate-x-[100%]
              transform
            `} />
          </div>

          {/* Website Name with Icon */}
          <button
            onClick={() => {
              console.log('Navigating to landing page');
              setActiveSection('landing');
            }}
            className={`
              font-bold text-lg tracking-wider flex items-center gap-2
              ${isDark ? 'text-white' : 'text-gray-800'}
              transition-all duration-300
              hover:scale-105 hover:text-indigo-500
              cursor-pointer
              group/title
              relative
            `}
          >
            <Gamepad2 className={`w-5 h-5 transition-colors duration-300 group-hover/title:text-indigo-500`} />
            <span>FIDGETEER</span>
            {/* Hover underline animation */}
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 scale-x-0 group-hover/title:scale-x-100 transition-transform duration-300" />
          </button>

          {/* Spacer */}
          <div className="flex-grow" />

          {/* Right Section with Options and Theme Toggle */}
          <div className="flex items-center">
            {/* Center Section with Options */}
            <div className="flex items-center gap-2 mr-6">
              {fidgetOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => setActiveSection(option.id)}
                    className={`
                      relative p-2 rounded-full flex items-center gap-2
                      transition-all duration-300
                      ${activeSection === option.id 
                        ? `${isDark ? 'text-indigo-500 font-semibold' : 'text-indigo-600 font-semibold'}`
                        : `${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-indigo-600'}`
                      }
                      hover:scale-110
                      before:-z-10
                    `}
                  >
                    <Icon className={`w-4 h-4 relative z-0 ${activeSection === option.id ? 'stroke-[2.5px]' : ''}`} />
                    <span className={`
                      text-sm whitespace-nowrap relative z-0
                      ${activeSection === option.id ? 'opacity-100 max-w-[80px] font-medium' : 'opacity-0 max-w-0'}
                      transition-all duration-300 overflow-hidden
                    `}>
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center relative">
              {/* Separator as a separate element */}
              <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-[60%] w-[1px] ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              <div className="pl-6">
                <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center p-4">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;