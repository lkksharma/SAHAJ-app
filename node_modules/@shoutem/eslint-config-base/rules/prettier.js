module.exports = {
  rules: {
    "prettier/prettier": [
      "error",
      {
        singleQuote: true,
        trailingComma: "all",
        arrowParens: "avoid",
      },
      {
        usePrettierrc: false,
      },
    ],
  },
};
