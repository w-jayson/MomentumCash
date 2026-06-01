/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        void: '#060B14',
        deep: '#0F1624',
        midnight: '#1A233A',
        steel: '#24304D',
        frost: '#2D3B5A',
        cyan: { DEFAULT: '#00E5FF', glow: '#00E5FF40', dim: '#006D7A' },
        emerald: { DEFAULT: '#00E676', glow: '#00E67640' },
        coral: { DEFAULT: '#FF3D60', glow: '#FF3D6040' },
        'text-primary': '#E8EDF5',
        'text-secondary': '#7B89A1',
        'text-muted': '#465570',
      },
      fontFamily: {
        display: ['Satoshi', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
