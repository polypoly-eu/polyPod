const fsPromises = require("fs/promises");
const fs = require("fs");

const { parseManifest } = require("./cli.js");
const { npm, npmInstall } = require("./npm.js");
const { logDetail } = require("./log.js");
const build = require("./index.js");

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
        this.processed = false;
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

    async install() {
        await npmInstall(this.name, false);
    }

    async offlineInstall() {
        await npmInstall(this.name);
    }

    async build() {
        await this.npmRun("build");
    }

    async installAndBuild() {
        await this.install();
        await this.build();
    }

    async test() {
        await this.npmRun("test");
    }

    async syncdeps() {
        await this.sync();
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
}

module.exports = {
    Pkg,
};
