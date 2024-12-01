module.exports = {
    module: {
      rules: [
        {
          test: /\.scss$/, // Targets SCSS files
          use: [
            "style-loader", // Injects styles into the DOM
            "css-loader",   // Translates CSS into CommonJS
            {
              loader: "sass-loader",
              options: {
                additionalData: `@use 'src/styles/globalMixins' as *;`, // Automatically inject mixins
              },
            },
          ],
        },
      ],
    },
  };