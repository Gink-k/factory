const path = require("path");

module.exports = {
  entry: {
      app: "./src/app.jsx",
      news: "./src/news.jsx",
      other: "./src/other.jsx",
  },
  output: {
    path: path.join(__dirname, "/dist"),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        },
      },
    ]
  }
}
