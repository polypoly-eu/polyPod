const pkg = require("./package.json");
const externals = pkg.dependencies;

export default {
    input: "src/index.js",
    output: [
        {
			format: 'cjs',
			file: pkg.main,
			sourcemap: false,
			exports: 'auto'
		}
    ],
    externals: externals
};
