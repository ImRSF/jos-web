const presets = [
    [
      "@babel/env",
      {
        targets: {
          edge: "17",
          firefox: "60",
          chrome: "60",
          safari: "11.1",
        },
        useBuiltIns: "usage", // for using babel-polyfill
        modules: false
      },
    ],
  ];
  
  const plugins = ["@babel/transform-arrow-functions", "@babel/transform-modules-commonjs"]
  
  module.exports = { presets, plugins }; 