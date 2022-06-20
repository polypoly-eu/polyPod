const INDENTING_SPACES = 4;

// template returns a string that can be written to a file
export function packageTemplate(
    name,
    version,
    description,
    main,
    author,
    license
) {
    return JSON.stringify(
        {
            name: name,
            version: version,
            description: description,
            main: main,
            scripts: {
                build: "rollup -c",
                test: 'echo "Error: no test specified" && exit 1',
            },
            devDependencies: {
                "@polypoly-eu/rollup-plugin-copy-watch":
                    "file:../../dev-utils/rollup-plugin-copy-watch",
            },
            dependencies: {
                "@polypoly-eu/silly-i18n":
                    "file:../../feature-utils/silly-i18n",
                "@polypoly-eu/podjs": "file:../../platform/podjs",
                "@polypoly-eu/pod-api":
                    "file:../../platform/feature-api/api/pod-api",
                "@polypoly-eu/poly-look": "file:../../feature-utils/poly-look",
            },
            author: author,
            license: license,
        },
        null,
        INDENTING_SPACES
    );
}
