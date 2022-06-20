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
            author: author,
            license: license,
        },
        null,
        INDENTING_SPACES
    );
}
