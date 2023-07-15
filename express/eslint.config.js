// @ts-check

import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://eslint.org/blog/2022/08/new-config-system-part-2/#backwards-compatibility-utility
// Note: Since https://github.com/eslint/eslintrc/pull/103, the FlatCompat()
// constructor requires the 'allConfig' and 'recommendedConfig' parameters.
const compat = new FlatCompat({
  baseDirectory: __dirname,
  allConfig: js.configs.all,
  recommendedConfig: js.configs.recommended,
});

export default [
  js.configs.recommended,
  ...compat.config({
    extends: [
      "plugin:@typescript-eslint/strict-type-checked",
      "plugin:@typescript-eslint/stylistic-type-checked",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: "latest",
      project: "tsconfig.json",
    },
    plugins: ["@typescript-eslint"],
    // Currently, @typescript-eslint/eslint-plugin throws a bunch of
    // false-positive errors for eslint.config.js. Let's skip it for now.
    ignorePatterns: "eslint.config.js",
  }),
  prettier,
];
