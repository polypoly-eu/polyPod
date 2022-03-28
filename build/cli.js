const path = require("path");
const fs = require("fs");

const validCommands = [
    "build",
    "clean",
    "install",
    "lint",
    "lintfix",
    "list",
    "list-deps",
    "syncdeps",
    "test",
];

function parseCommandLine() {
    const [, scriptPath, ...parameters] = process.argv;
    if (parameters.includes("--help")) return { scriptPath, command: null };

    const startIndex = parameters.indexOf("--start");
    if (startIndex > 0 && startIndex + 1 >= parameters.length)
        return { scriptPath, command: null };
    const start =
        startIndex !== -1 ? parameters.splice(startIndex, 2)[1] : null;

    const skipRootInstallIndex = parameters.indexOf("--skip-root-install");
    const skipRootInstall = skipRootInstallIndex > -1;
    if (skipRootInstall) {
        parameters.splice(skipRootInstallIndex, 1);
    }

    if (parameters.length > 1) return { scriptPath, command: null };

    const command = parameters.length ? parameters[0] : "build";
    return {
        scriptPath,
        command: validCommands.includes(command) ? command : null,
        start,
        skipRootInstall,
    };
}

function showUsage(scriptPath) {
    const baseName = path.basename(scriptPath);
    const validCommandString = validCommands.join(" | ");
    console.error(
        `Usage: ${baseName} [ --start PACKAGE_NAME ] [ --skip-root-install ] [ ${validCommandString} ]`
    );
    console.error(" Run without arguments to build all packages");
}

function parseManifest(path) {
    try {
        return JSON.parse(fs.readFileSync(path));
    } catch (e) {
        throw `Cannot read ${path} or parse the result: ${e}`;
    }
}

module.exports = { parseCommandLine, showUsage, parseManifest };
