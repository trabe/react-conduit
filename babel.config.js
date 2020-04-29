module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          browsers: ["last 2 versions", "IE >= 10"],
        },
        useBuiltIns: false,
      },
    ],
    "@babel/react",
  ],
  plugins: ["@babel/plugin-proposal-class-properties"],
};
