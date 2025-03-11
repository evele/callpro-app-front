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
          'dark-primary-container': '#4F378B',
          danger: '#C00F0C',
          'danger-1': '#EC221F',
          'danger-2': '#900B09',
          'danger-light': '#fbd5d5', // Color más claro si lo necesitas
          success: '#14AE5C',
          'success-light': '#d5fbd5',
          'light-2': '#F7F2FA',
          'dark-2': '#1D1B20',
          'dark-3': '#1E1E1E',
          'dark-4': '#383838',
          'dark-5': '#2C2C2C',
          'dark-blue': '#1D192B',
          'secondary-hover': '#5B7906',

          'grey-secondary': '#757575',
          'grey-main': '#49454F',
          'grey-4': '#79747E',
          'grey-5': '#797676',
          'grey-6': '#CAC4D0',
          'grey-7': '#B3B3B3',
          'grey-8': '#D9D9D9',
          'grey-9': '#5A5A5A',
          'grey-14': '#767676',

          verified: '#009951',
          pending: '#FFA629',
          unverified: '#C00F0C',
          
          'green-positive-primary': '#009951',
          'green-positive-secondary': '#14AE5C',

          'card-background': '#E6E0E9',

          'purple-main': '#65558F',
          'light-purple': '#E8DEF8',
          'light-purple-2': "#D0BCFF",
          'light-purple-3': '#EDD9FF',
          'yellow-credits': "#E8ED5F",
        },
        boxShadow: {
          'popover': '0px -4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
        },
      },
    },
    plugins: [require('tailwindcss-primeui')]
};
    