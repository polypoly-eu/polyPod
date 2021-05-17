const copy = require("rollup-plugin-copy");
const glob = require("glob");

module.exports = function copyWatch(options) {
    const originalCopy = copy(options);
    return {
        ...originalCopy,
        name: "copyWatch",
        ["buildStart"]: async function () {
            if ("buildStart" in originalCopy) await originalCopy.buildStart();
            if (!this.meta.watchMode) return;
            for (let { src } of options.targets)
                for (let pattern of src)
                    for (let file of glob.sync(pattern))
                        this.addWatchFile(file);
        },
    };
};
