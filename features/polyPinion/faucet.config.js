module.exports = {
    essugar: [
        {
            source: "./src/index.tsx",
            target: "./dist/bundle.js",
            typescript: true,
            jsx: true,
            externals: {
                react: "React",
                "react-dom": "ReactDOM",
                uuid: "uuid",
                "react-router-dom": "ReactRouterDOM",
            },
        },
    ],

    static: [
        {
            source: "./src/index.html",
            target: "./dist/index.html",
        },
        {
            source: "react/umd/react.development.js",
            target: "./dist/react.js",
        },
        {
            source: "react-dom/umd/react-dom.development.js",
            target: "./dist/react-dom.js",
        },
        {
            source: "./node_modules/uuid/dist/umd/uuid.min.js",
            target: "./dist/uuid.js",
        },
        {
            source: "./node_modules/@polypoly-eu/poly-look/dist/bundle.css",
            target: "./dist/bundle.css",
        },
        {
            source: "./node_modules/@polypoly-eu/poly-look/dist/fonts",
            target: "./dist/fonts",
        },
        {
            source: "./node_modules/@polypoly-eu/poly-look/dist/icons",
            target: "./dist/icons",
        },
        {
            source: "react-router-dom/umd/react-router-dom.min.js",
            target: "./dist/react-router-dom.js",
        },
    ],

    manifest: {
        webRoot: "./dist",
    },

    watchDirs: ["./src"],

    plugins: [require("faucet-pipeline-essugar")],
};
