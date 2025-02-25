import React, { useState, useEffect } from 'react';
import { Sparkles, Moon, Sun, Heart, Star, Zap, Music2, Volume2, VolumeX, 
         Flame, Cloud, Rainbow, CloudLightning as Lightning, Wind, Snowflake, 
         Umbrella, Coffee, Rocket, Waves, Infinity, Compass, Flower2, 
         PartyPopper, SettingsIcon as Confetti, Palette } from 'lucide-react';

function App() {
  const [bgColor, setBgColor] = useState('bg-gray-100');
  const [isDark, setIsDark] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sparkleCount, setSparkleCount] = useState(0);
  const [showHeart, setShowHeart] = useState(false);
  const [pulseIndex, setPulseIndex] = useState(-1);
  const [rocketPosition, setRocketPosition] = useState(0);
  const [confettiActive, setConfettiActive] = useState(false);
  const [wavesActive, setWavesActive] = useState(false);
  const [rotationDegree, setRotationDegree] = useState(0);
  const [flowerColor, setFlowerColor] = useState('text-pink-500');
  const [partyMode, setPartyMode] = useState(false);
  const [clickedButtons, setClickedButtons] = useState<{ [key: string]: boolean }>({});
  const [floatingButtons, setFloatingButtons] = useState<{ [key: string]: boolean }>({});
  const [rippleEffects, setRippleEffects] = useState<{ [key: string]: boolean }>({});

  const colors = [
    'bg-gray-100',
    'bg-rose-100',
    'bg-blue-100',
    'bg-green-100',
    'bg-purple-100',
    'bg-yellow-100',
    'bg-teal-100',
    'bg-orange-100'
  ];

  const flowerColors = [
    'text-pink-500',
    'text-purple-500',
    'text-blue-500',
    'text-yellow-500',
    'text-red-500'
  ];

  useEffect(() => {
    if (partyMode) {
      const interval = setInterval(() => {
        setBgColor(colors[Math.floor(Math.random() * colors.length)]);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [partyMode]);

  const triggerButtonEffect = (buttonId: string) => {
    setClickedButtons(prev => ({ ...prev, [buttonId]: true }));
    setFloatingButtons(prev => ({ ...prev, [buttonId]: true }));
    setRippleEffects(prev => ({ ...prev, [buttonId]: true }));
    
    setTimeout(() => {
      setClickedButtons(prev => ({ ...prev, [buttonId]: false }));
      setFloatingButtons(prev => ({ ...prev, [buttonId]: false }));
      setRippleEffects(prev => ({ ...prev, [buttonId]: false }));
    }, 1000);
  };

  const randomColor = () => {
    let newColor;
    do {
      newColor = colors[Math.floor(Math.random() * colors.length)];
    } while (newColor === bgColor);
    setBgColor(newColor);
    triggerButtonEffect('color');
  };

  const handleRocketClick = () => {
    setRocketPosition(prev => (prev + 90) % 360);
    triggerButtonEffect('rocket');
  };

  const handleConfettiClick = () => {
    setConfettiActive(true);
    triggerButtonEffect('confetti');
    setTimeout(() => setConfettiActive(false), 1000);
  };

  const handleCompassClick = () => {
    setRotationDegree(prev => prev + 90);
    triggerButtonEffect('compass');
  };

  const handleFlowerClick = () => {
    const newColor = flowerColors[Math.floor(Math.random() * flowerColors.length)];
    setFlowerColor(newColor);
    triggerButtonEffect('flower');
  };

  const renderButton = (id: string, icon: React.ReactNode, onClick?: () => void) => (
    <button
      onClick={() => {
        onClick?.();
        triggerButtonEffect(id);
      }}
      className={`p-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 group relative
        ${clickedButtons[id] ? 'animate-[shake_0.5s_ease-in-out]' : ''}
        ${floatingButtons[id] ? 'animate-[float_1s_ease-in-out]' : ''}
      `}
    >
      <div className="flex flex-col items-center justify-center gap-2">
        {icon}
        <span className="text-sm font-medium">Click me!</span>
      </div>
      {rippleEffects[id] && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-white/30 rounded-lg animate-[ripple_1s_ease-out]"></div>
        </div>
      )}
    </button>
  );

  return (
    <div className={`min-h-screen ${bgColor} transition-colors duration-500 p-4 ${isDark ? 'dark' : ''} overflow-hidden`}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Interactive Button Playground</h1>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {renderButton('color', 
            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-spin"></div>,
            randomColor
          )}

          {renderButton('sparkle',
            <Sparkles className="w-5 h-5 text-yellow-500" />,
            () => setSparkleCount(prev => prev + 1)
          )}

          {renderButton('theme',
            <div className="relative w-5 h-5">
              <Sun className={`w-5 h-5 text-yellow-500 absolute transition-opacity duration-300 ${isDark ? 'opacity-0' : 'opacity-100'}`} />
              <Moon className={`w-5 h-5 text-blue-600 absolute transition-opacity duration-300 ${isDark ? 'opacity-100' : 'opacity-0'}`} />
            </div>,
            () => setIsDark(!isDark)
          )}

          {renderButton('heart',
            <Heart className={`w-5 h-5 ${showHeart ? 'text-red-500 fill-red-500 scale-125 animate-[burst_0.5s_ease-in-out]' : 'text-gray-400'} transition-all duration-300`} />,
            () => setShowHeart(!showHeart)
          )}

          {renderButton('star',
            <Star className="w-5 h-5 text-purple-500 group-hover:rotate-180 transition-transform duration-500" />
          )}

          {renderButton('sound',
            <div className="relative w-5 h-5">
              <Volume2 className={`w-5 h-5 text-green-500 absolute transition-transform duration-300 ${isPlaying ? 'scale-100' : 'scale-0'}`} />
              <VolumeX className={`w-5 h-5 text-red-500 absolute transition-transform duration-300 ${isPlaying ? 'scale-0' : 'scale-100'}`} />
            </div>,
            () => setIsPlaying(!isPlaying)
          )}

          {renderButton('zap',
            <Zap className="w-5 h-5 text-yellow-500 group-hover:animate-[bounce_0.5s_infinite]" />
          )}

          {renderButton('music',
            <Music2 className="w-5 h-5 text-indigo-500 group-hover:animate-[bounce_1s_infinite]" />
          )}

          {renderButton('fire',
            <Flame className={`w-5 h-5 text-orange-500 ${pulseIndex === 9 ? 'animate-ping' : ''}`} />,
            () => setPulseIndex(9)
          )}

          {renderButton('cloud',
            <Cloud className="w-5 h-5 text-blue-400 group-hover:translate-x-2 transition-transform" />
          )}

          {renderButton('rainbow',
            <Rainbow className="w-5 h-5 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500" />
          )}

          {renderButton('lightning',
            <Lightning className="w-5 h-5 text-yellow-600 group-hover:scale-125 transition-transform" />
          )}

          {renderButton('wind',
            <Wind className={`w-5 h-5 text-blue-300 transition-transform duration-300 ${wavesActive ? 'translate-x-2' : ''}`} />,
            () => setWavesActive(!wavesActive)
          )}

          {renderButton('snow',
            <Snowflake className="w-5 h-5 text-blue-200 group-hover:rotate-[180deg] transition-transform duration-500" />
          )}

          {renderButton('rain',
            <Umbrella className="w-5 h-5 text-gray-600 group-hover:-translate-y-1 transition-transform" />
          )}

          {renderButton('coffee',
            <div className="relative">
              <Coffee className="w-5 h-5 text-brown-600 group-hover:animate-bounce" />
              <div className="absolute -top-1 left-1/2 w-2 h-2 bg-brown-200 rounded-full opacity-0 group-hover:animate-ping group-hover:opacity-100"></div>
            </div>
          )}

          {renderButton('rocket',
            <Rocket 
              className="w-5 h-5 text-blue-500 transition-transform duration-500"
              style={{ transform: `rotate(${rocketPosition}deg)` }}
            />,
            handleRocketClick
          )}

          {renderButton('wave',
            <Waves className="w-5 h-5 text-blue-400" />,
            () => setWavesActive(!wavesActive)
          )}

          {renderButton('infinity',
            <Infinity className="w-5 h-5 text-purple-500 group-hover:animate-[spin_2s_linear_infinite]" />
          )}

          {renderButton('compass',
            <Compass 
              className="w-5 h-5 text-red-500 transition-transform duration-500"
              style={{ transform: `rotate(${rotationDegree}deg)` }}
            />,
            handleCompassClick
          )}

          {renderButton('flower',
            <Flower2 className={`w-5 h-5 ${flowerColor} transition-colors duration-300 group-hover:rotate-45`} />,
            handleFlowerClick
          )}

          {renderButton('party',
            <PartyPopper className={`w-5 h-5 ${partyMode ? 'text-yellow-500 animate-bounce' : 'text-gray-500'}`} />,
            () => setPartyMode(!partyMode)
          )}

          {renderButton('confetti',
            <Confetti className="w-5 h-5 text-pink-500" />,
            handleConfettiClick
          )}

          {renderButton('palette',
            <Palette className="w-5 h-5 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;