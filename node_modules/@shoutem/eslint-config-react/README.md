# @shoutem/eslint-config-react

[![npm version](https://badge.fury.io/js/@shoutem%2Feslint-config-react.svg)](https://badge.fury.io/js/@shoutem%2Feslint-config-react)

This package provides Shoutem's React JS .eslintrc (with React plugins) as an extensible shared config.

## Usage

Our default export contains all of our ESLint rules, including ECMAScript 6+. It requires `eslint`, `eslint-plugin-import`, `eslint-plugin-prettier`, `eslint-plugin-import`, `eslint-plugin-simple-import-sort`, `eslint-plugin-jsx-a11y`, `eslint-plugin-react`, `eslint-plugin-react-hooks` and `prettier`.

1. Install the correct versions of each package, which are listed by the command:

```sh
npm info "@shoutem/eslint-config-react@latest" peerDependencies
```

If using **npm 5+**, use this shortcut

```sh
npx install-peerdeps --dev @shoutem/eslint-config-react
```

If using **npm < 5**, you can either install all the peer dependencies manually, or use the [install-peerdeps](https://github.com/nathanhleung/install-peerdeps) cli tool.

```sh
npm install -g install-peerdeps
install-peerdeps --dev @shoutem/eslint-config-react
```

2. Add `"extends": "@shoutem/react"` to your .eslintrc.
