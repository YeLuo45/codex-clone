/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // OpenAI-inspired design tokens
        background: {
          DEFAULT: '#ffffff',
          dark: '#0d0d0d',
          cream: '#f5f3ee',
        },
        primary: {
          DEFAULT: '#0d0d0d',
          4: '#3b3b3b',
          12: '#1a1a1a',
          44: 'rgba(255,255,255,0.44)',
          60: 'rgba(255,255,255,0.60)',
          100: '#ffffff',
        },
        ink: {
          DEFAULT: '#0d0d0d',
          80: 'rgba(0,0,0,0.8)',
          60: 'rgba(0,0,0,0.6)',
        },
        accent: {
          DEFAULT: '#10a37f',  // OpenAI green
          dark: '#0d8c6c',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
        serif: ['"Source Serif Pro"', '"Source Han Serif SC"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        'container-desktop': '1280px',
      },
      letterSpacing: {
        'tight-display': '-0.03em',
      },
    },
  },
  plugins: [],
}