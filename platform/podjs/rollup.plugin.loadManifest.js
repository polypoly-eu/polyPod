const fs = require("fs");

module.exports.loadManifest = ({ src, dest }) => {
    const copyOnce = false;
    let copied = false;

    return {
        name: "loadManifest",
        writeBundle: () => {
            if (copyOnce && copied) {
                return;
            }

            if (!src || !dest) {
                throw new Error(`must have "src" and "dest" properties`);
            }

            try {
                console.log(src, dest);
                const manifestData = fs.readFileSync(src, "utf8");

                console.log(manifestData);
            } catch (err) {
                console.error(err);
            }

            copied = true;
        },
    };
};
