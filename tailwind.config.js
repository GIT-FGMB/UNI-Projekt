/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        olive: {
          50: '#f5f7f0',
          100: '#e8ebe0',
          200: '#d1d8c0',
          300: '#adb896',
          400: '#8B9B75',
          500: '#7B8B65',
          600: '#637050',
          700: '#4B5E3C',
          800: '#3D4E31',
          900: '#2F3D25',
        },
        terra: {
          50: '#fdf3ec',
          100: '#fae3d2',
          200: '#f4c5a4',
          300: '#e8a070',
          400: '#C07845',
          500: '#A8683B',
          600: '#8E5530',
          700: '#744526',
          800: '#5A351D',
          900: '#402514',
        },
      },
    },
  },
  plugins: [],
};
