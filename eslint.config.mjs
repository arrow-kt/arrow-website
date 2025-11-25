import { defineConfig } from "eslint/config";
import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-plugin-prettier";
import _import from "eslint-plugin-import";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    extends: fixupConfigRules(compat.extends(
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
        "plugin:import/recommended",
        "plugin:import/typescript",
    )),

    plugins: {
        "@typescript-eslint": fixupPluginRules(typescriptEslint),
        prettier,
        import: fixupPluginRules(_import),
    },

    languageOptions: {
        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "module",

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },

    settings: {
        "import/parsers": {
            "@typescript-eslint/parser": [".ts", ".tsx"],
        },

        "import/resolver": {
            typescript: {
                alwaysTryTypes: true,
            },
        },
    },

    rules: {
        "prettier/prettier": "error",

        "import/no-unresolved": ["error", {
            ignore: ["^@theme", "^@docusaurus", "^@site"],
        }],

        "import/order": ["error", {
            groups: [
                "builtin",
                "external",
                "internal",
                "parent",
                "sibling",
                "index",
                "object",
                "type",
            ],

            pathGroups: [{
                pattern: "{@docusaurus/**,@theme/**}",
                group: "external",
                position: "after",
            }, {
                pattern: "@site/**",
                group: "internal",
                position: "after",
            }],

            distinctGroup: true,
            pathGroupsExcludedImportTypes: ["@docusaurus/**", "@theme/**", "@site/**"],
            "newlines-between": "always",
        }],

        "@typescript-eslint/no-unused-vars": ["error", {
            argsIgnorePattern: "^_",
        }],
    },
}]);