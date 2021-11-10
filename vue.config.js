const path = require('path');
const XMLPlugin = require('xml-webpack-plugin');

const protocol = process.env.PROTOCOL || 'http';
const domainName = process.env.DOMAIN_NAME || 'localhost';
const publicPath = process.env.PUBLIC_URL || '/';
const title = process.env.TITLE || 'Monochrome';
const url = `${protocol}://${domainName}/`;

const XMLFiles = [
  {
    data: {
      title,
      url,
    },
    filename: 'opensearch.xml',
    template: path.join(__dirname, './src/opensearch.ejs'),
  },
];

const metaArgs = {
  description: process.env.DESCRIPTION || 'A website for reading manga',
  title,
  url,
};

/** @type {import('@vue/cli-service').ProjectOptions} */
module.exports = {
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
  devServer: {
    port: 80,
  },
  pluginOptions: {
    i18n: {
      enableBridge: false,
      enableInSFC: true,
      fallbackLocale: 'en',
      locale: 'fr',
      localeDir: 'locales',
    },
  },
  publicPath,
  pwa: {
    name: title,
    themeColor: '#212121',
    workboxOptions: {
      cleanupOutdatedCaches: true,
      skipWaiting: true,
    },
  },
  transpileDependencies: ['vuetify'],
};
