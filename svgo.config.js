const { extendDefaultPlugins } = require("svgo");
module.exports = {
  plugins: extendDefaultPlugins([
    {
      name: "removeViewBox",
      active: false,
    },
    {
      name: "removeAttrs",
      active: true,
      attrs: "(width|height)",
    },
  ]),
};
