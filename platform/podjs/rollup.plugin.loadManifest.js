const MagicString = require("magic-string");
const fs = require("fs");

function replaceManifestData(code, manifestData) {
    const magicString = new MagicString(code);
    const pattern = new RegExp("window.manifestData", "g");

    let hasReplacements = false;
    let match;
    let start;
    let end;
    let replacement;

    while ((match = pattern.exec(code))) {
        hasReplacements = true;

        start = match.index;
        end = start + match[0].length;

        replacement = String(manifestData);

        magicString.overwrite(start, end, replacement);
    }

    if (!hasReplacements) {
        return null;
    }

    const result = {
        code: magicString.toString(),
    };
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
        async buildStart() {
            if (!options.manifestJsonPath) {
                throw new Error(`Must have "manifestJsonPath" property`);
            }
        },
        async transform(code) {
            return executeReplacement(code, options.manifestJsonPath);
        },
    };
};
