const { parseManifest } = require("./cli.js");
const { extractDependencies } = require("/deps.js ");

class Pkg {
    constructor(path) {
        const manifest = parseManifest(`${path}/package.json`);
        const { localDependencies, remoteDependencies } =
            extractDependencies(manifest);
        this.name = manifest.name;
        this.path = path;
        this.localDependencies = localDependencies;
        this.remoteDependencies = remoteDependencies;
        this.scripts = Object.keys(manifest.scripts || {});
    }
}

module.exports = {
    Pkg,
};
