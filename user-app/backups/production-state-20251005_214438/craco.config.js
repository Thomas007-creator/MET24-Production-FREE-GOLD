const path = require('path');

module.exports = {
  eslint: {
    enable: false, // Disable ESLint plugin to avoid errors
  },
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Fix voor NextUI dom-animation chunk loading error
      if (env === 'development') {
        // Zorg ervoor dat optimization en splitChunks bestaan
        if (!webpackConfig.optimization) {
          webpackConfig.optimization = {};
        }
        if (!webpackConfig.optimization.splitChunks) {
          webpackConfig.optimization.splitChunks = {};
        }
        if (!webpackConfig.optimization.splitChunks.cacheGroups) {
          webpackConfig.optimization.splitChunks.cacheGroups = {};
        }

        webpackConfig.optimization.splitChunks.cacheGroups = {
          ...webpackConfig.optimization.splitChunks.cacheGroups,
          nextui: {
            test: /[\\/]node_modules[\\/]@nextui-org[\\/]/,
            name: 'nextui',
            chunks: 'all',
            priority: 20,
            enforce: true,
          },
          framerMotion: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'framer-motion',
            chunks: 'all',
            priority: 15,
            enforce: true,
          },
        };
      }

      // Voeg fallback toe voor Node.js modules
      if (!webpackConfig.resolve) {
        webpackConfig.resolve = {};
      }
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "fs": false,
        "path": false,
        "os": false,
      };

      return webpackConfig;
    },
  },
};
