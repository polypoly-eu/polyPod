// template returns a string that can be written to a file
export function template(name, version, description, main, author, license) {
    let t = {
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
    };

    return JSON.stringify(t, null, 2);
}
