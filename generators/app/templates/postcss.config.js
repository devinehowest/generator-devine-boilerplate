module.exports = {
  plugins: [
    require(`stylelint`),
    require(`postcss-import`),
    require(`postcss-reporter`)({clearMessages: true}), // prettier stylelint reporting
    require(`postcss-cssnext`),
    require(`postcss-will-change`)
  ]
};
