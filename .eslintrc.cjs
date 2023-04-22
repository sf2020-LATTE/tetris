module.exports = {
    root: true,
    extends: [
      "eslint:recommended",
      "plugin:vue/vue3-recommended",
      "@vue/eslint-config-typescript/recommended"
    ],
    rules: {
      "no-redeclare": "off"
    },
    parserOptions: {
      parser: '@typescript-eslint/parser',
      extraFileExtensions: ['.vue']
    }
  };