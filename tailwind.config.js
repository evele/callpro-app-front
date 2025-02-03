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
          danger: '#C00F0C',
          'danger-2': '#900B09',
          'danger-light': '#fbd5d5', // Color más claro si lo necesitas
          success: '#14AE5C',
          'success-light': '#d5fbd5',
          'dark-2': '#1D1B20',
          'dark-3': '#1E1E1E',
          verified: '#009951',
          pending: '#FFA629',
          unverified: '#C00F0C',
          'secondary-hover': '#5B7906',
          'grey-secondary': '#757575',
          'grey-5': '#797676',
          'green-positive-primary': '#009951',
          'purple-main': '#65558F'
        },
        boxShadow: {
          'popover': '0px -4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
        },
      },
    },
    plugins: [require('tailwindcss-primeui')]
};
    