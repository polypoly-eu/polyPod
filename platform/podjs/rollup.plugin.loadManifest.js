const MagicString = require("magic-string");
const fs = require("fs");

function replaceManifestData(code, manifestData) {
    const magicString = new MagicString(code);
    const pattern = new RegExp("__DYNAMIC_IMPORT_MANIFEST__", "g");

    let hasReplacements = false;
    let match;
    let start;
    let end;
    let replacement;

    while ((match = pattern.exec(code))) {
        console.log("\nMATCH!");
        hasReplacements = true;

        start = match.index;
        end = start + match[0].length;

        replacement = manifestData;

        magicString.overwrite(start, end, replacement);
    }

    if (!hasReplacements) return null;

    const result = { code: magicString.toString() };
    return result;
}

function executeReplacement(code, manifestJsonPath) {
    try {
        const manifestData = fs.readFileSync(manifestJsonPath, "utf8");
        return replaceManifestData(code, manifestData);
    } catch (err) {
        console.error(err);
    }
}

/**
 * @param options
 * @param options.manifestJsonPath
 */
module.exports.loadManifest = (options = {}) => {
    return {
        name: "loadManifest",
        async transform(code) {
            if (!options.manifestJsonPath) {
                throw new Error(`Must have "manifestJsonPath" property`);
            }

            return executeReplacement(code, options.manifestJsonPath);
        },
    };
};
