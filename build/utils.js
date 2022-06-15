const { execSync } = require("child_process");

function platformize(executable) {
    return process.platform === "win32" ? `${executable}.cmd` : executable;
}

function checkVersions(metaManifest) {
    const thisNPM = platformize("npm");
    let exitCode = 0;
    const nodeVersion = process.version.split(".")[0];
    if (nodeVersion < metaManifest.requiredNodeVersion) {
        console.error(
            `⚠️ Node.js v${metaManifest.requiredNodeVersion} or later ` +
                `required, you are on ${process.version}`
        );
        exitCode = 1;
    }
    let npmVersion;
    try {
        npmVersion = execSync(`${thisNPM} --version`, {
            encoding: "utf-8",
        }).split(".")[0];
        if (npmVersion < metaManifest.requiredNPMVersion) {
            console.error(
                `⚠️ NPM ${metaManifest.requiredNPMVersion} or later ` +
                    `required, you are on ${npmVersion}`
            );
            exitCode = 1;
        }
    } catch (error) {
        console.error(`⚠️ Error ${error} when trying to find NPM version`);
        exitCode = 1;
    }
    return exitCode;
}

function ANSIBold(string) {
    return `\x1b[1m${string}\x1b[0m`;
}

function ANSIInvert(string) {
    return `\x1b[7m${string}\x1b[27m`;
}

module.exports = {
    platformize,
    checkVersions,
    ANSIBold,
    ANSIInvert,
};
