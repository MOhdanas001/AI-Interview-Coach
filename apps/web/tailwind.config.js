/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        neu: {
          bg: '#E0E5EC',
          text: '#171819ff',
          muted: '#252628ff',
          accent: '#6C63FF',
          'accent-light': '#8B84FF',
          success: '#38B2AC',
          placeholder: '#A0AEC0',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Plus Jakarta Sans', 'sans-serif'],
        body: ['var(--font-body)', 'DM Sans', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '32px',
        '2xl': '16px',
        xl: '12px',
      },
      boxShadow: {
        'neu-extruded': '9px 9px 16px rgba(163, 177, 198, 0.6), -9px -9px 16px rgba(255, 255, 255, 0.5)',
        'neu-extruded-hover': '12px 12px 20px rgba(163, 177, 198, 0.7), -12px -12px 20px rgba(255, 255, 255, 0.6)',
        'neu-extruded-sm': '5px 5px 10px rgba(163, 177, 198, 0.6), -5px -5px 10px rgba(255, 255, 255, 0.5)',
        'neu-inset': 'inset 6px 6px 10px rgba(163, 177, 198, 0.6), inset -6px -6px 10px rgba(255, 255, 255, 0.5)',
        'neu-inset-deep': 'inset 10px 10px 20px rgba(163, 177, 198, 0.7), inset -10px -10px 20px rgba(255, 255, 255, 0.6)',
        'neu-inset-sm': 'inset 3px 3px 6px rgba(163, 177, 198, 0.6), inset -3px -3px 6px rgba(255, 255, 255, 0.5)',
      },
    },
  },
  plugins: [],
};
