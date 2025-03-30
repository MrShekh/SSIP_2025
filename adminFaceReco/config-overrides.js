const { override, addWebpackModuleRule } = require('customize-cra');

module.exports = override(
  // Disable sourcemaps for node_modules
  function(config) {
    // Disable source maps completely
    config.devtool = false;
    
    // OR selectively disable for face-api.js
    if (config.resolve) {
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        'face-api.js': require.resolve('face-api.js')
      };
    }
    
    // Ignore source map warnings for specific modules
    if (config.ignoreWarnings) {
      config.ignoreWarnings.push(/Failed to parse source map/);
    } else {
      config.ignoreWarnings = [/Failed to parse source map/];
    }
    
    // Add Node.js polyfills for browser compatibility
    if (!config.resolve.fallback) {
      config.resolve.fallback = {};
    }
    
    // Provide empty implementations of Node.js modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
      os: false,
      stream: false,
      buffer: false
    };
    
    return config;
  }
); 