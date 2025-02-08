module.exports = {
  rules: {
    "camelcase": ["error", { allow: ["^UNSAFE_"] }],
    "jsx-a11y/img-has-alt": 0,
    "jsx-a11y/control-has-associated-label": 0,
    "jsx-a11y/label-has-associated-control": 0,
    "no-use-before-define": 0,
    "no-restricted-globals": 0,
    "prefer-const": ["warn", {
      "ignoreReadBeforeAssign": true
    }],
    "import/order": "off",
    "import/extensions": 0,
    "import/no-extraneous-dependencies": 0,
    "prefer-destructuring": 2,
    "react/no-did-update-set-state": "off",
    "react/require-default-props": 2,
    "react/forbid-prop-types": 0,
    "react/static-property-placement": ["warn", "property assignment"],
    "react/sort-comp": 0,
    "react/no-multi-comp": [2, { "ignoreStateless": false }],
    "react/jsx-filename-extension": [1, { "extensions": [".jsx", ".js"] }],
    "react/jsx-props-no-spreading": 0,
    "react/jsx-one-expression-per-line": 0,
    "react/jsx-no-bind": 0,
    "react/sort-prop-types": [1, {
      "callbacksLast": true,
      "ignoreCase": true,
      "requiredFirst": true,
      "sortShapeProp": true,
      "noSortAlphabetically": false
    }],
    "simple-import-sort/exports": "error",
    "simple-import-sort/imports": [
      "error",
      {
        "groups": [
          [
            // Packages. `react` related packages come first.
            "^react",
            // Packages
            "^(?!(shoutem).*)|(@?\\w)$",
            // Internal packages.
            "^(@+shoutem)(\/.*|$)",
            "^(shoutem)(\.*|$)",
            // Side effect imports.
            "^\\u0000",
            // Parent imports. Put `..` last.
            "^\\.\\.(?!/?$)",
            "^\\.\\./?$",
            // Other relative imports. Put same-folder imports and `.` last.
            "^\\./(?=.*/)(?!/?$)",
            "^\\.(?!/?$)",
            "^\\./?$",
            // Style imports
            "^.+\\.s?css$"
          ]
        ]
      }
    ],
  },
};
