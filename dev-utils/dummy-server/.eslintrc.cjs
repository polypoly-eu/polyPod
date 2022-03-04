module.exports = {
    globals: {
        process: true,
        console: true,
        setTimeout: true,
    },
    overrides: [
        {
            files: ["*.js"],
            parserOptions: {
                sourceType: "module",
            },
        },
    ],
};
