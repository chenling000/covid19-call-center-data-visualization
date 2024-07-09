module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "airbnb",
    "airbnb-typescript",
    "eslint-config-prettier",
  ],
  ignorePatterns: ["dist", "vite.config.ts", "*.cjs"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
  plugins: ["react-refresh", "prettier", "@typescript-eslint", "unused-imports", "import"],
  rules: {
    "prettier/prettier": "error",
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react/jsx-no-bind": "off",
    "react/function-component-definition": [
      2,
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      },
    ],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "": "never",
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
        mjs: "never",
      },
    ],
    "import/order": [
      "warn",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          "unknown",
          "parent",
          "sibling",
          "index",
          "object",
          "type",
        ],
        "newlines-between": "always",
        alphabetize: { order: "asc", caseInsensitive: true },
      },
    ],
    "unused-imports/no-unused-imports": "warn",
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
    "react/no-unknown-property": ["error", { ignore: ["css"] }],
    // redux
    "no-restricted-imports": "off",
    "@typescript-eslint/no-restricted-imports": [
      "warn",
      {
        name: "react-redux",
        importNames: ["useSelector", "useDispatch"],
        message: "Use typed hooks `useAppDispatch` and `useAppSelector` instead.",
      },
    ],
  },
};
