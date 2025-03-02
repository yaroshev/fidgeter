/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'gradient-rotate': 'gradient-rotate 3s ease infinite',
        'modern-pop': 'modern-pop 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'modern-burst': 'modern-burst 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'ripple': 'ripple 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'ping-slower': 'ping 4s cubic-bezier(0, 0, 0.2, 1) infinite',
        'particle': 'particle 1s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'pulse-subtle': 'pulse-subtle 2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'spin-reverse': 'spin 3s linear infinite reverse',
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
      },
      keyframes: {
        'gradient-rotate': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'modern-pop': {
          '0%': {
            transform: 'scale(1)',
            opacity: '1'
          },
          '50%': {
            transform: 'scale(0.9)',
            opacity: '0.5'
          },
          '100%': {
            transform: 'scale(0.8)',
            opacity: '0'
          }
        },
        'modern-burst': {
          '0%': {
            transform: 'scale(0)',
            opacity: '1'
          },
          '50%': {
            transform: 'scale(2)',
            opacity: '0.5'
          },
          '100%': {
            transform: 'scale(3)',
            opacity: '0'
          }
        },
        'ripple': {
          '0%': {
            transform: 'scale(0)',
            opacity: '1'
          },
          '50%': {
            transform: 'scale(1.5)',
            opacity: '0.5'
          },
          '100%': {
            transform: 'scale(2)',
            opacity: '0'
          }
        },
        'particle': {
          '0%': {
            transform: 'rotate(var(--angle)) translateX(0)',
            opacity: '1',
            scale: '0'
          },
          '50%': {
            opacity: '1',
            scale: '1'
          },
          '100%': {
            transform: 'rotate(var(--angle)) translateX(100px)',
            opacity: '0',
            scale: '0'
          }
        },
        'pulse-subtle': {
          '0%, 100%': {
            opacity: '1',
            transform: 'scale(1)'
          },
          '50%': {
            opacity: '0.9',
            transform: 'scale(0.98)'
          }
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
};
