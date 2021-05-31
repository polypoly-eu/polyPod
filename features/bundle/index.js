"use strict";

const child_process = require("child_process");
const fs = require("fs");
const path = require("path");

function packageFeature({ archiveName, moduleName, artifactPath }, targetDir) {
    console.log(`Packaging ${archiveName}`);
    const targetArchive = path.join(targetDir, `${archiveName}.zip`);
    const sourceDir =
          path.join(__dirname, "node_modules", moduleName, artifactPath);
    child_process.execSync(`zip -r ${targetArchive} *`, { cwd: sourceDir });
}

const features = require("./package.json").polyPodFeatures;

const targetDir = path.join(__dirname, "dist");
if (fs.existsSync(targetDir))
    fs.rmdirSync(targetDir, { recursive: true });
fs.mkdirSync(targetDir);

for (let feature of features) packageFeature(feature, targetDir);
