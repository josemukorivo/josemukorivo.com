module.exports = {
  darkMode: 'class',
  content: ['pages/**/*.{js,ts,jsx,tsx}', 'components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      body: ['Figtree', 'sans-serif'],
      heading: ['Oswald', 'sans-serif'],
      mono: ['Syne Mono', 'monospace'],
    },
    extend: {
      maxWidth: {
        '8xl': '1920px',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
