/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

const BASE_PATH = process.env.BASE_PATH || '/locations';
const DEFAULT_LOCALE = 'en-us';
const OTHER_LOCALES = 'es';
const SUPPORTED_LOCALES = [DEFAULT_LOCALE, ...OTHER_LOCALES.split(',')];

const nextConfig = withBundleAnalyzer({
  basePath: BASE_PATH,
  trailingSlash: true,
  env: {
    BUILD_ENV: process.env.BUILD_ENV,
    BASE_PATH,
    DEFAULT_LOCALE,
    OTHER_LOCALES,
    SUPPORTED_LOCALES
  },
  i18n: {
    locales: SUPPORTED_LOCALES,
    defaultLocale: DEFAULT_LOCALE,
    localeDetection: false
  },
  // trailingSlash: true,

  // experimental: {
  //   outputStandalone: true
  // },
  // localeBeforeBasePath: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/locations',
        permanent: false
      },
      {
        source: '/posts/:id*.html', // Old url with .html
        destination: '/posts/:id*', // Redirect without .html
        permanent: false
      },
      {
        source: '/todos/:id*.html', // Old url with .html
        destination: '/todos/:id*', // Redirect without .html
        permanent: false
      },
      {
        source: `/locations.html`,
        destination: `/locations`,
        permanent: false
      }
    ];
  },
  reactStrictMode: true
});

module.exports = nextConfig;
