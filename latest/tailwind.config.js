const routes = ['./src/**/*.{css,html}'];

module.exports = {
  mode: 'jit',
  purge: routes,
  content: routes,
  theme: {
    extend: {
      colors: {
        primary: '#1e55e3'
      },
    },
  },
  plugins: [],
}
