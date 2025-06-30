module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['@babel/preset-typescript', 'module:metro-react-native-babel-preset'],
  };
};
