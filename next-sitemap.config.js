// These routes also carry <meta name="robots" content="noindex, nofollow">.
// They are deliberately NOT disallowed in robots.txt: a crawler has to fetch a page
// to see its noindex, so blocking it would keep the URL indexable from inbound links.
// (next-sitemap already drops /404 and /500 on its own; they are listed for the record.)
const noIndexRoutes = ['/400', '/403', '/404', '/500', '/j/__placeholder__']

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  exclude: noIndexRoutes,
  generateRobotsTxt: true,
  outDir: './out',
  robotsTxtOptions: {
    policies: [
      {
        allow: '/',
        userAgent: '*',
      },
    ],
  },
  siteUrl: 'https://jokes.dbowland.com',
}
