module.exports = {
  parser: "babel-eslint",
  plugins: ["prettier"],
  extends: ["unobtrusive", "unobtrusive/react", "prettier", "prettier/react"],
  env: {
    browser: true,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "prettier/prettier": ["error", require("./prettier.config.js")],
  },
};
