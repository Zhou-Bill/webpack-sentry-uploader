module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  root: true,
  // parser: "@typescript-eslint/parser",
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
  ],
  parser: "@typescript-eslint/parser",
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  plugins: [
    "react",
    "@typescript-eslint"
  ],
  rules: {
    quotes: ["error", "double"],
    semi: ["error", "always"]

  },
  ignorePatterns: ["webpack.config.js", "plugins", '*.js']
};
