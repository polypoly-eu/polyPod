"use strict";

const fs = require("fs");
const path = require("path");
const zip = require("bestzip");
function packageFeature({ archiveName, moduleName, artifactPath }, targetDir) {
    console.log(`Packaging ${archiveName}`);
    const targetArchive = path.join(targetDir, `${archiveName}.zip`);
    const sourceDir = path.join(
        __dirname,
        "node_modules",
        moduleName,
        artifactPath
    );
    zip({
        source: "",
        destination: targetArchive,
        cwd: sourceDir,
    }).catch((error) => {
        console.error(error.stack);
        process.exit(1);
    });
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
