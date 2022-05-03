const fs = require("fs");
const path = require("path");

function executeReplacement(podJs, manifestJsonPath) {
    try {
        const manifestData = fs.readFileSync(manifestJsonPath, "utf8");
        const podJsCode = fs.readFileSync(podJs, "utf8");

        const pattern = new RegExp("window.manifestData", "g");
        const replacedCode = podJsCode.replace(pattern, manifestData);

        fs.writeFileSync(podJs, replacedCode);
    } catch (err) {
        console.error("Error while replacing code", err);
    }
}

function copyPodJs(dest) {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir);
    }

    fs.copyFileSync("node_modules/@polypoly-eu/podjs/dist/pod.js", `${dest}`);
}

/**
 * @param options
 * @param options.build_dir - path to build_dir where pod.js exists
 * @param options.manifestPath - path to json file
 */
function loadManifest(options = {}) {
    if (!options.build_dir || !options.manifestPath) {
        throw new Error("manifestPath or build_dir not specified");
    }
    const podJsPath = `${options.build_dir}/pod.js`;
    console.log("Loading", options.manifestPath, "into", podJsPath);

    copyPodJs(podJsPath);

    executeReplacement(podJsPath, options.manifestPath);
}

exports.default = loadManifest;
