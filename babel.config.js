module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['react-native-reanimated/plugin'],
      [
        '@tamagui/babel-plugin',
        {
          components: ['tamagui'],
          config: './tamagui.config.ts',
        },
      ],
    ],
  };
  // const plugins = [];

  // plugins.push('react-native-reanimated/plugin');
  // plugins.push([
  //   '@tamagui/babel-plugin',
  //   {
  //     components: ['tamagui'],
  //     config: './tamagui.config.ts',
  //   },
  // ]);
  // plugins.push([
  //   'react-native-dotenv',
  //   {
  //     moduleName: '@env',
  //     path: '.env',
  //     blacklist: null,
  //     whitelist: null,
  //     safe: false,
  //     allowUndefined: true,
  //   },
  // ]);
  // return {
  //   presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
  //   plugins,
  // };
};