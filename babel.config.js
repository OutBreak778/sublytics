// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // Add any other plugins you need here (e.g. reanimated)
      "react-native-reanimated/plugin", // Put this LAST if you use it
      // "react-native-worklets/plugin",  // if you're using this package
    ],
  };
};
