const fsPromises = require("fs/promises");
const fs = require("fs");

const { parseManifest } = require("./cli.js");
const { npm } = require("./npm.js");
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
    name;
    path;
    localDependencies;
    remoteDependencies;
    scripts;
    _processed = false;

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

    async npmRun(script) {
        if (!this.scripts.includes(script)) return false;

        logDetail(`${this.name}: Executing ${script} script ...`);
        await npm("run", script);
        return true;
    }

    async clean() {
        if (await this.npmRun("clean")) return;

        // Just so that we don't have to add a 'clean' script to every single
        // package, we cover the conventional case as a fallback - but it's
        // arguably a bit dangerous.
        logDetail(`${this.name}: Executing fallback clean logic ...`);
        for (let path of ["node_modules", "dist"])
            await fsPromises.rm(path, { recursive: true, force: true });
    }

    install() {
        npmInstall(this.name);
    }

    build() {
        this.npmRun("build");
    }

    test() {
        this.npmRun("test");
    }

    clean() {
        this.clean();
    }

    syncdeps() {
        this.sync();
    }

    async executeCommand(command) {
        const oldPath = process.cwd();
        try {
            process.chdir(this.path);
        } catch {
            throw `Directory ${this.path} for package ${this.name} does not exist`;
        }

        try {
            await this[command]();
        } finally {
            process.chdir(oldPath);
        }
    }

    get isProcessed() {
        return this._processed;
    }

    setProcessed() {
        this._processed = true;
    }
}

module.exports = {
    Pkg,
};
