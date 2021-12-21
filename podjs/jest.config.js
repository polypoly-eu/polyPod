module.exports = {
    roots: ["<rootDir>/src/tests"],
    preset: "ts-jest",
    collectCoverage: true,
    coverageReporters: ["json", "html", "text"],
};
