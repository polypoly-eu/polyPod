module.exports = {
  js: [{
    source: "./src/HelloWorld.tsx",
    target: "./dist/bundle.js",
    typescript: true,
    externals: {
      "react": "React",
      "react-dom": "ReactDOM"
    }
  }]
}
