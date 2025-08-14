const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Ensure UTF-8 encoding for all text files
config.transformer.minifierConfig = {
  ...config.transformer.minifierConfig,
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

// Add support for proper UTF-8 encoding
config.resolver.sourceExts = [
  ...config.resolver.sourceExts,
  'tsx',
  'ts',
  'jsx',
  'js',
  'json'
];

module.exports = config;