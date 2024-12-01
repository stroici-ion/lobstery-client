module.exports = {
    style: {
      sass: {
        loaderOptions: {
          additionalData: `@use 'src/styles/globalMixins' as *;`,
        },
      },
    },
  };