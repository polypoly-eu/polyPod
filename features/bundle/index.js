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
    return zip({
        source: process.platform === "win32" ? "" : ".",
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

function writeCategoriesOrder(categories, targetDir) {
    fs.writeFileSync(
        path.join(targetDir, "categories.json"),
        JSON.stringify(categories)
    );
}

const config = require("./package.json");
const features = config.polyPodFeatures;
const categories = config.polyPodCategories;
const targetDir = path.join(__dirname, "dist");

if (fs.existsSync(targetDir)) fs.rmSync(targetDir, { recursive: true });
fs.mkdirSync(targetDir);

for (let feature of features) packageFeature(feature, targetDir);
writeOrder(features, targetDir);

if (categories) writeCategoriesOrder(categories, targetDir);
