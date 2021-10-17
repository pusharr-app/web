const jsonSchemaTransformer =
  require('ts-transformer-json-schema/transformer').default;

const config = {
  webpack5: true,
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.tsx?$/,
      loader: 'ts-loader', // or 'next-babel-loader'
      options: {
        // make sure not to set `transpileOnly: true` here, otherwise it will not work
        getCustomTransformers: (program) => ({
          before: [jsonSchemaTransformer(program)],
        }),
      },
    });

    return config;
  },
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(config);
