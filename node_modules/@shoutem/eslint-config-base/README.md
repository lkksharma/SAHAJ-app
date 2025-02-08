# @shoutem/eslint-config-base

[![npm version](https://badge.fury.io/js/@shoutem%2Feslint-config-base.svg)](https://badge.fury.io/js/@shoutem%2Feslint-config-base)

This package provides Shoutem's base JS .eslintrc (without React plugins) as an extensible shared config.

## Usage

Our default export contains all of our ESLint rules, including ECMAScript 6+. It requires `eslint`, `eslint-plugin-import`, `eslint-plugin-prettier` and `prettier`.

1. Install the correct versions of each package, which are listed by the command:

```sh
npm info "@shoutem/eslint-config-base@latest" peerDependencies
```

If using **npm 5+**, use this shortcut

```sh
npx install-peerdeps --dev @shoutem/eslint-config-base
```

If using **npm < 5**, you can either install all the peer dependencies manually, or use the [install-peerdeps](https://github.com/nathanhleung/install-peerdeps) cli tool.

```sh
npm install -g install-peerdeps
install-peerdeps --dev @shoutem/eslint-config-base
```

2. Add `"extends": "@shoutem/base"` to your .eslintrc.
