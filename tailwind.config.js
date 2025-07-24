/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  "./index.html",
  "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#f5f7ff",
          100: "#e3e7fa",
          200: "#c5c9ee",
          300: "#a5a9d7",
          400: "#7f83b5",
          500: "#595e93",
          600: "#444872",
          700: "#323356",
          800: "#23243b",
          900: "#181929",
        },
        accent: {
          500: "#29c4a9",
          600: "#1db395",
        },
        violet: {
          500: "#6c63ff",
        },
        blue: {
          500: "#2196f3",
        },
        gray: {
          900: "#21232e",
          800: "#2c2f40",
          700: "#414361",
          600: "#5c5e82",
          300: "#b8bace",
          100: "#f6f6fa",
        },
        white: "#fff"
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        xl: "1.25rem",
        '2xl': "2rem",
      },
      boxShadow: {
        xl: "0 8px 32px rgba(60, 70, 140, 0.18)",
      },
    },
  },
  plugins: [],
}
