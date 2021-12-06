"use strict";

const child_process = require("child_process");
const fs = require("fs");
const path = require("path");
const windowsEnvironment = process.platform === "win32";
function packageFeature({ archiveName, moduleName, artifactPath }, targetDir) {
    console.log(`Packaging ${archiveName}`);
    const targetArchive = path.join(targetDir, `${archiveName}.zip`);
    const sourceDir = path.join(
        __dirname,
        "node_modules",
        moduleName,
        artifactPath
    );
    const args = windowsEnvironment
        ? ["-cfM", targetArchive, "."]
        : ["-r", targetArchive, "."];
    if (windowsEnvironment) {
        child_process.execFileSync("jar", args, { cwd: sourceDir });
    } else {
        child_process.execFileSync("zip", args, { cwd: sourceDir });
    }
}

function writeOrder(features, targetDir) {
    const order = features.map((feature) => feature.archiveName);
    fs.writeFileSync(path.join(targetDir, "order"), order.join("\n"));
}

const features = require("./package.json").polyPodFeatures;

const targetDir = path.join(__dirname, "dist");
if (fs.existsSync(targetDir)) fs.rmSync(targetDir, { recursive: true });
fs.mkdirSync(targetDir);

for (let feature of features) packageFeature(feature, targetDir);
writeOrder(features, targetDir);
