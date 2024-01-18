const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isEnvDevelopment = webpackEnv === "development";
const isEnvProduction = webpackEnv === "production";

const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    isEnvDevelopment && require.resolve("style-loader"),
    isEnvProduction && {
      loader: MiniCssExtractPlugin.loader,
    },
    {
      loader: require.resolve("css-loader"),
      options: {
        importLoaders: 1,
        sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
        modules: {
          mode: "icss",
        },
      },
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve("postcss-loader"),
      options: {
        postcssOptions: {
          // Necessary for external CSS imports to work
          // https://github.com/facebook/create-react-app/issues/2677
          ident: "postcss",
          config: false,
          plugins: !useTailwind
            ? [
                "postcss-flexbugs-fixes",
                [
                  "postcss-preset-env",
                  {
                    autoprefixer: {
                      flexbox: "no-2009",
                    },
                    stage: 3,
                  },
                ],
                // Adds PostCSS Normalize as the reset css with default options,
                // so that it honors browserslist config in package.json
                // which in turn let's users customize the target behavior as per their needs.
                "postcss-normalize",
              ]
            : [
                "tailwindcss",
                "postcss-flexbugs-fixes",
                [
                  "postcss-preset-env",
                  {
                    autoprefixer: {
                      flexbox: "no-2009",
                    },
                    stage: 3,
                  },
                ],
              ],
        },
        sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
      },
    },
  ].filter(Boolean);
  if (preProcessor) {
    loaders.push(
      {
        loader: require.resolve("resolve-url-loader"),
        options: {
          sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
          root: paths.appSrc,
        },
      },
      {
        loader: require.resolve(preProcessor),
        options: {
          sourceMap: true,
        },
      }
    );
  }
  return loaders;
};

module.exports = {
  entry: "./src/index.ts",
  mode: "development",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: [
    {
      test: /\.css$/,
      exclude: /\.module\.css$/,
      use: getStyleLoaders({
        importLoaders: 1,
        sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
        modules: {
          mode: "icss",
        },
      }),
      // Don't consider CSS imports dead code even if the
      // containing package claims to have no side effects.
      // Remove this when webpack adds a warning or an error for this.
      // See https://github.com/webpack/webpack/issues/6571
      sideEffects: true,
    },
    // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
    // using the extension .module.css
    // {
    //   test: /\.module\.css$/,
    //   use: getStyleLoaders({
    //     importLoaders: 1,
    //     sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
    //     modules: {
    //       mode: "local",
    //       getLocalIdent: getCSSModuleLocalIdent,
    //     },
    //   }),
    // },
    // // Opt-in support for SASS (using .scss or .sass extensions).
    // // By default we support SASS Modules with the
    // // extensions .module.scss or .module.sass
    // {
    //   test: /\.(scss|sass)$/,
    //   exclude: sassModuleRegex,
    //   use: getStyleLoaders(
    //     {
    //       importLoaders: 3,
    //       sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
    //       modules: {
    //         mode: "icss",
    //       },
    //     },
    //     "sass-loader"
    //   ),
    //   // Don't consider CSS imports dead code even if the
    //   // containing package claims to have no side effects.
    //   // Remove this when webpack adds a warning or an error for this.
    //   // See https://github.com/webpack/webpack/issues/6571
    //   sideEffects: true,
    // },
    // // Adds support for CSS Modules, but using SASS
    // // using the extension .module.scss or .module.sass
    // {
    //   test: /\.module\.(scss|sass)$/,
    //   use: getStyleLoaders(
    //     {
    //       importLoaders: 3,
    //       sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
    //       modules: {
    //         mode: "local",
    //         getLocalIdent: getCSSModuleLocalIdent,
    //       },
    //     },
    //     "sass-loader"
    //   ),
    // },
  ],
};
