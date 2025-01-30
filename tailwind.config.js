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
          primary: '#653494',
          danger: '#C00F0C', // Define aquí tu color danger
          'danger-light': '#fbd5d5', // Color más claro si lo necesitas
          success: '#14AE5C',
          'success-light': '#d5fbd5',
          'dark-3': '#1E1E1E',
          'dark-blue': '#1D192B',
          'secondary-hover': '#5B7906',
          'grey-4': '#79747E',
          'grey-9': '#5A5A5A',
          'green-positive-primary': '#009951'
        },
        boxShadow: {
          'popover': '0px -4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
        },
      },
    },
    plugins: [require('tailwindcss-primeui')]
};
    