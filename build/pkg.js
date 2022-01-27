const { parseManifest } = require("./cli.js");

function extractDependencies(manifest) {
    const allDependencies = {
        ...manifest.dependencies,
        ...manifest.devDependencies,
    };
    const localDependencies = [];
    const remoteDependencies = [];
    for (let [name, url] of Object.entries(allDependencies)) {
        const group = url.startsWith("file:")
            ? localDependencies
            : remoteDependencies;
        group.push(name);
    }
    return { localDependencies, remoteDependencies };
}

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
