let environment = {
  name: 'local',
  production: false,
  basePath: process.env.BASE_PATH,
  defaultLocale: process.env.DEFAULT_LOCALE,
  otherLocales: process.env.OTHER_LOCALES,
  supportedLocales: process.env.SUPPORTED_LOCALES,
  baseUrl: 'http://localhost:3200',
  appPath: 'https://local.myblog.com/us-locations'
};

let envConfig = { ...environment };

try {
  const configs = process.env.BUILD_ENV
    ? require(`./environment.${process.env.BUILD_ENV}.js`).default
    : {};
  envConfig = {
    ...environment,
    ...configs
  };
} catch (e) {
  envConfig = environment;
}

module.exports = envConfig;
