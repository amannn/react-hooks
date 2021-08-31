/* eslint-disable import/no-extraneous-dependencies */
const commonjs = require('@rollup/plugin-commonjs');

// The `query-string` dependency is bundled so it works in IE11

module.exports = {
  rollup(config) {
    const fallbackExternal = config.external;
    config.external = (id) => {
      if (
        ['use-query-params', 'serialize-query-params', 'query-string'].includes(
          id
        )
      ) {
        return false;
      }

      return fallbackExternal(id);
    };

    const commonjsPluginIndex = config.plugins.findIndex(
      (plugin) => plugin && plugin.name === 'commonjs'
    );
    config.plugins[commonjsPluginIndex] = false;
    config.plugins.unshift(
      commonjs({
        include: '../../node_modules/query-string/index.js'
      })
    );

    return config;
  }
};
