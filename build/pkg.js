const fsPromises = require("fs/promises");
const fs = require("fs");

const { parseManifest } = require("./cli.js");
const { npm, npmRun } = require("./npm.js");
const { logDetail } = require("./log.js");

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

    async sync() {
        logDetail(`🕑 ${this.name} ...`);
        if (fs.existsSync("package-lock.json")) {
            fs.rmSync("package-lock.json");
        }
        await npm("i");
    }

    async clean() {
        if (await npmRun("clean", this)) return;

        // Just so that we don't have to add a 'clean' script to every single
        // package, we cover the conventional case as a fallback - but it's
        // arguably a bit dangerous.
        logDetail(`${this.name}: Executing fallback clean logic ...`);
        for (let path of ["node_modules", "dist"])
            await fsPromises.rm(path, { recursive: true, force: true });
    }
}

module.exports = {
    Pkg,
};
