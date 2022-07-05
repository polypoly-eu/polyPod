const INDENTING_SPACES = 4;

import { convertCamelCaseToHyphen, isCamelCase } from "../utils.js";

// template returns a string that can be written to a file
export function packageTemplate(
    name,
    version,
    description,
    main,
    author,
    license
) {
    if (isCamelCase(name)) {
        name = convertCamelCaseToHyphen(name);
    }

    return JSON.stringify(
        {
            name: name,
            version: version,
            description: description,
            main: main,
            scripts: {
                build: "rollup -c",
                watch: "rollup --watch -c",
                test: 'echo "🚨: No tests run"'
            },
            devDependencies: {
                "@polypoly-eu/rollup-plugin-copy-watch":
                    "file:../../dev-utils/rollup-plugin-copy-watch",
                rollup: "*",
                "@rollup/plugin-json": "*",
                "@rollup/plugin-node-resolve": "*",
            },
            dependencies: {
                "@polypoly-eu/silly-i18n":
                    "file:../../feature-utils/silly-i18n",
                "@polypoly-eu/podjs": "file:../../platform/podjs",
                "@polypoly-eu/pod-api":
                    "file:../../platform/feature-api/api/pod-api",
                "@polypoly-eu/poly-look": "file:../../feature-utils/poly-look",
                react: "*",
                "react-dom": "*",
            },
            author: author,
            license: license,
        },
        null,
        INDENTING_SPACES
    );
}
