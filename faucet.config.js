module.exports = {
  js: [{
    source: "./src/HelloWorld.tsx",
    target: "./dist/bundle.js",
    typescript: true,
    externals: {
      "react": "React",
      "react-dom": "ReactDOM"
    }
  }],

  static: [{
    source: "./src/index.html",
    target: "./dist/index.html",
  }, {
    source: "react/umd/react.development.js",
    target: "./dist/react.js",
  }, {
    source: "react-dom/umd/react-dom.development.js",
    target: "./dist/react-dom.js",
  }],

  manifest: {
    webRoot: "./dist",
  },

  watchDirs: [
    "./src"
  ]
}
