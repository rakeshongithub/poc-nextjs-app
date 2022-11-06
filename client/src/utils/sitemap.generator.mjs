/** @type {import('next-sitemap').IConfig} */
// Default code you can customize according to your requirements.
import environment from '../environments/environment.js';
// import pkg from '../services/getPosts.js';
import axios from 'axios';
// const { getPosts } = pkg;

// TODOS: this is SSR way to generating sitemap for dynamic pages as well.
const env_config = {
  dev: {
    appPath: 'https://local.myblog.com/us-locations'
  },
  it: {
    appPath: 'https://it.myblog.com/us-locations'
  },
  uat: {
    appPath: 'https://uat.myblog.com/us-locations'
  },
  prod: {
    appPath: 'https://www.myblog.com/us-locations'
  }
};

const getSiteUrl = () => {
  if (process.env.BUILD_ENV) {
    return env_config[process.env.BUILD_ENV].appPath;
  }
  return env_config.prod.appPath;
};

const configs = {
  // siteUrl: process.env.BUILD_ENV || environment.appPath,
  siteUrl: getSiteUrl(),
  generateRobotsTxt: false, // (optional)
  generateIndexSitemap: false,
  alternateRefs: [
    {
      href: 'https://es.example.com',
      hreflang: 'es'
    },
    {
      href: 'https://fr.example.com',
      hreflang: 'fr'
    }
  ],
  additionalPaths: async (config) => {
    const result = [];
    const res = await axios(
      'https://jsonplaceholder.typicode.com/todos/?_page=1&_limit=10'
    );
    console.log(res.data, '=======================>');

    // required value only
    result.push({ loc: '/additional-page-1' });

    // all possible values
    result.push({
      loc: '/additional-page-2',
      changefreq: 'yearly',
      priority: 0.7,
      lastmod: new Date().toISOString(),

      // acts only on '/additional-page-2'
      alternateRefs: [
        {
          href: 'https://es.example.com',
          hreflang: 'es'
        },
        {
          href: 'https://fr.example.com',
          hreflang: 'fr'
        }
      ]
    });

    // using transformation from the current configuration
    result.push(await config.transform(config, '/additional-page-3'));

    return result;
  }
};

export default configs;
