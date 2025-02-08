module.exports = {
  extends: [
    "airbnb",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "@shoutem/base",
    // custom rules
    require.resolve("./rules/custom"),
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: [
    "react",
    "import",
    "simple-import-sort"
  ],
  rules: {},
  globals: {
    "fetch": "readonly"
  },
};
