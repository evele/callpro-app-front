module.exports = {
    content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./app.vue",
        "./error.vue",
      ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['Roboto', 'sans-serif'], 
        },
        colors: {
          danger: '#C00F0C', // Define aquí tu color danger
          'danger-light': '#fbd5d5', // Color más claro si lo necesitas
        },
        boxShadow: {
          'popover': '0px -4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
        },
      },
    },
    plugins: [require('tailwindcss-primeui')]
};
    