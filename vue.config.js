const path = require('path');
const XMLPlugin = require('xml-webpack-plugin');

const protocol = process.env.PROTOCOL || 'http';
const domainName = process.env.DOMAIN_NAME || 'localhost';
const publicPath = process.env.PUBLIC_URL || '/';
const title = process.env.TITLE || 'Monochrome';
const url = `${protocol}://${domainName}/`;

const XMLFiles = [
  {
    template: path.join(__dirname, './src/opensearch.ejs'),
    filename: 'opensearch.xml',
    data: {
      url,
      title,
    },
  },
];

const metaArgs = {
  title,
  url,
  description: process.env.DESCRIPTION || 'A website for reading manga',
};

/** @type {import('@vue/cli-service').ProjectOptions} */
module.exports = {
  publicPath,
  transpileDependencies: ['vuetify'],
  devServer: {
    port: 80,
  },
  pwa: {
    name: title,
    themeColor: '#212121',
    workboxOptions: {
      cleanupOutdatedCaches: true,
      skipWaiting: true,
    },
  },
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0] = { ...args[0], ...metaArgs };
      return args;
    });
    config.plugins.delete('fork-ts-checker');
  },
  configureWebpack: {
    plugins: [
      new XMLPlugin({
        files: XMLFiles,
      }),
    ],
  },
  pluginOptions: {
    i18n: {
      locale: 'fr',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true,
      enableBridge: false,
    },
  },
};
