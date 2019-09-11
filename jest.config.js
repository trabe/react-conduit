module.exports = {
  transform: {
    "\\.js$": "babel-jest",
  },
  setupFiles: ["<rootDir>/test/enzyme-setup.js"],
  snapshotSerializers: ["<rootDir>/node_modules/enzyme-to-json/serializer"],
  testURL: "http://localhost/",
};
