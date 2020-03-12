module.exports = {
    roots: ["<rootDir>/src"],
    transformIgnorePatterns: [
        "/node_modules/(?!typeson-registry).+\\.js$"
    ]
};
