/* eslint-disable @typescript-eslint/no-var-requires */
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const DotenvWebpackPlugin = require("dotenv-webpack");
const path = require("path");

const mode = process.env.NODE_ENV || "development";
const prod = mode === "production";
const buildDir = path.join(__dirname, "build");

module.exports = {
  entry: {
    bundle: ["./src/main.ts"],
    popup: ["./src/strava-oauth/index.ts"],
  },
  resolve: {
    alias: {
      svelte: path.resolve("node_modules", "svelte"),
    },
    extensions: [".ts", ".mjs", ".js", ".svelte"],
    mainFields: ["svelte", "browser", "module", "main"],
  },
  output: {
    path: buildDir,
    filename: "[name].js",
    chunkFilename: "[name].[id].js",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.svelte$/,
        use: {
          loader: "svelte-loader",
          options: {
            emitCss: true,
            preprocess: require("svelte-preprocess")({}),
            hotReload: false,
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          /**
           * MiniCssExtractPlugin doesn't support HMR.
           * For developing, use 'style-loader' instead.
           * */
          prod ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
        ],
      },
      {
        test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              limit: 10000,
            },
          },
        ],
      },
    ],
  },
  mode,
  plugins: [
    new DotenvWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new HtmlWebpackPlugin({
      chunks: ["popup"],
      filename: "popup.html",
      title: "Activity Viewer 3D - Login",
    }),
    new HtmlWebpackPlugin({
      chunks: ["bundle"],
      filename: "index.html",
      title: "Activity Viewer 3D",
    }),
  ],
  devtool: prod ? false : "source-map",
  devServer: {
    contentBase: buildDir,
    compress: true,
    hot: true,
    historyApiFallback: true,
  },
};
