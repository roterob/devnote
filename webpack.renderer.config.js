const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const rules = require("./webpack.rules");
const plugins = require("./webpack.plugins");

const assets = ["static"];
const copyPlugins = assets.map((asset) => {
  return new CopyWebpackPlugin({
    patterns: [
      {
        from: path.resolve(__dirname, "src", asset),
        to: path.resolve(__dirname, ".webpack/renderer", asset),
      },
    ],
  });
});

rules.push(
  {
    test: /\.css$/,
    use: [{ loader: "style-loader" }, { loader: "css-loader" }],
  },
  {
    test: /\.s[ac]ss$/i,
    use: ["style-loader", "css-loader", "sass-loader"],
  },
  {
    test: /\.(woff(2)?|ttf|svg|png|jpe?g|gif)$/i,
    use: [
      {
        loader: "file-loader",
      },
    ],
  }
);

module.exports = {
  module: {
    rules,
  },
  plugins: [...plugins, ...copyPlugins],
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".sass", ".scss"],
  },
};
