import fs from 'fs';
import { getPosts } from '../services/getPosts';
import { getTodos } from '../services/getTodos';

const Sitemap = () => {};

export const getServerSideProps = async ({ res, locale }) => {
  // This value is considered fresh for ten seconds (s-maxage=10).
  // If a request is repeated within the next 10 seconds, the previously
  // cached value will still be fresh. If the request is repeated before 59 seconds,
  // the cached value will be stale but still render (stale-while-revalidate=59).
  //
  // In the background, a revalidation request will be made to populate the cache
  // with a fresh value. If you refresh the page, you will see the new value.
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  );

  const baseUrl = {
    development: 'http://localhost:3000',
    production: 'https://mydomain.com'
  }[process.env.NODE_ENV];

  const todosData = await getTodos();
  const postsData = await getPosts();

  const dynamicTodosPaths = todosData.map((todo) => {
    return `${baseUrl}/${locale}/todos/${todo.id}`;
  });

  const dynamicPostsPaths = postsData.map((post) => {
    return `${baseUrl}/${locale}/posts/${post.id}`;
  });

  const staticPages = fs
    .readdirSync('./src/pages')
    .filter((staticPage) => {
      return ![
        '_app.js',
        '_document.js',
        '_error.js',
        'sitemap.xml.js',
        'api'
      ].includes(staticPage);
    })
    .map((staticPagePath) => {
      return `${baseUrl}/${locale}/${staticPagePath}`;
    });

  const allPaths = [...staticPages, ...dynamicPostsPaths, ...dynamicTodosPaths];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${allPaths
          .map((url) => {
            return `
            <url>
                <loc>${url}</loc>
                <lastmod>${new Date().toISOString()}</lastmod>
                <changefreq>monthly</changefreq>
                <priority>1.0</priority>
            </url>
            `;
          })
          .join('')}
    </urlset>
    `;

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {}
  };
};

export default Sitemap;
