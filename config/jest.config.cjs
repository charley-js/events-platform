const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const config = {
  coverageProvider: "v8",
  testEnvironment: "node",
  rootDir: "../",
  testMatch: [
    "**/tests/**/*.test.[jt]s?(x)", // Matches tests in the 'tests' folder
    "**/tests/**/*.spec.[jt]s?(x)", // Matches specs in the 'tests' folder
    "**/?(*.)+(spec|test).[tj]s?(x)", // Matches test or spec files anywhere
  ],
  testPathIgnorePatterns: ["/node_modules/", "/\\.next/"], // Ignore these folders
};

module.exports = createJestConfig(config);
