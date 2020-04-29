module.exports = {
    roots: ["<rootDir>/src"],
    testEnvironment: "node",
    preset: "ts-jest/presets/js-with-ts",

    globals: {
        "ts-jest": {
            tsConfig: {
                "allowJs": true,
                "rootDir": "./"
            }
        }
    }
};
