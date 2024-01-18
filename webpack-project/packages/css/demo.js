module.exports = {
  module: {
    rules: [
      {
        loader: "postcss-loader",
        options: {
          postcssOptions: {
            ident: "postcss",
            config: false,
            plugins: "tailwindcss",
          },
        },
      },
    ],
  },
};
