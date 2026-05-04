import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        iver: {
          bg: '#121212',
          surface: '#1A1A1A',
          border: '#2A2A2A',
          blue: '#3B82F6',
          red: '#FF3B30',
        },
      },
    },
  },
  plugins: [],
};

export default config;
