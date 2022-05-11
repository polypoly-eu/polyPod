module.exports = {
    roots: ["<rootDir>/src"],
    transform: {
        "^.+\\.[t|j]sx?$": "babel-jest",
    },
    transformIgnorePatterns: [],
    testEnvironment: "jsdom",
};
