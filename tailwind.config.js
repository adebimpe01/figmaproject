/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.html",       // all HTML files in public
    "./src/**/*.{js,ts,jsx,tsx}" // all JS/TS files
  ],
  theme: {
    screens: {
      xxs: '480px',
      xs: '600px',
      md: '768px',
      lg: '976px',
      xl: '1024px',
    },
    extend: {
      colors: {
        brightRed: 'hsl(12, 88%, 59%)',
        brightRedLight: 'hsl(12, 88%, 69%)',
        brightRedSupLight: 'hsl(12, 88%, 95%)',
        darkBlue: 'hsl(228, 39%, 23%)',
        darkGrayishBlue: 'hsl(227, 12%, 61%)',
        veryDarkBlue: 'hsl(233, 12%, 13%)',
        veryPaleRed: 'hsl(13, 100%, 96%)',
        veryLightGray: 'hsl(0, 0%, 98%)',
      },
      fontSize: {
        xxxs: '0.375rem',
        xxs: '0.525rem',
        tiny: '0.7rem',
        small:'3.0rem',
        huge: '4.5rem',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

