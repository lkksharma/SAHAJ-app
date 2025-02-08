module.exports = {
  extends: [
    "airbnb-base",
    // custom rules
    require.resolve("./rules/custom"),
    require.resolve("./rules/prettier"),
    "prettier", // must be on the end!
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["prettier"],
  rules: {},
};
