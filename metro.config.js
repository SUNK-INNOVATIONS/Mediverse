const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// If using `.ts` or `.tsx`, this should already work, but double-check:
config.resolver.sourceExts = ['ts', 'tsx', ...config.resolver.sourceExts];

module.exports = config;
