const path = require("path");
const fs = require("fs");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;
const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;

process.env.NODE_ENV === "development";

const useTailwind = fs.existsSync(
  path.resolve(__dirname, "."),
  "tailwind.config.js"
);

module.exports = function () {
  const isEnvDevelopment = process.env.NODE_ENV === "development";

  console.log("process.env.NODE_ENV", process.env.NODE_ENV);

  const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
      {
        loader: isEnvDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
      },
      {
        loader: "css-loader",
        options: cssOptions,
      },
      {
        loader: "postcss-loader",
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
        },
      },
    ].filter(Boolean);

    if (preProcessor) {
      loaders.push(
        {
          loader: require.resolve("resolve-url-loader"),
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

  return {
    entry: "./src/index.js",
    mode: "development",
    output: {
      path: path.resolve(__dirname, "dist"),
    },
    module: {
      rules: [
        {
          test: cssRegex,
          exclude: cssModuleRegex,
          use: getStyleLoaders({
            importLoaders: 1,

            modules: {
              mode: "icss",
            },
          }),
        },
        {
          test: cssModuleRegex,
          use: getStyleLoaders({
            importLoaders: 1,
            modules: {
              mode: "local",
              localIdentName: "[local]_[hash:base64:5]",
            },
          }),
        },
        {
          test: sassRegex,
          exclude: sassModuleRegex,
          use: getStyleLoaders(
            {
              importLoaders: 3,
              modules: {
                mode: "icss",
              },
            },
            "sass-loader"
          ),
        },
        {
          test: sassModuleRegex,
          use: getStyleLoaders(
            {
              importLoaders: 3,
              modules: {
                mode: "local",
                localIdentName: "[local]_[hash:base64:5]",
              },
            },
            "sass-loader"
          ),
        },
        {
          test: lessRegex,
          exclude: lessModuleRegex,
          use: getStyleLoaders(
            {
              importLoaders: 3,
              modules: {
                mode: "icss",
              },
            },
            "less-loader"
          ),
        },
        {
          test: lessModuleRegex,
          use: getStyleLoaders(
            {
              importLoaders: 3,
              modules: {
                mode: "local",
                localIdentName: "[local]_[hash:base64:5]",
              },
            },
            "less-loader"
          ),
        },
      ],
    },
    plugins: [new MiniCssExtractPlugin(), new HTMLWebpackPlugin()],
    cache: {
      type: "filesystem",
    },
  };
};
