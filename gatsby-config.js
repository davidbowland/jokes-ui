module.exports = {
  siteMetadata: {
    title: 'Joke-ui',
    siteUrl: 'https://dbowland.com/',
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-alias-imports',
      options: {
        alias: {
          '@assets': 'src/assets',
          '@components': 'src/components',
          '@pages': 'src/pages',
          '@services': 'src/services',
          '@test': 'test',
        },
        extensions: ['js', 'jsx', 'ts', 'tsx'],
      },
    },
    'gatsby-plugin-sass',
    'gatsby-plugin-image',
    'gatsby-plugin-styled-components',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sitemap',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: 'src/assets/images/',
      },
      __key: 'images',
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: 'src/pages/',
      },
      __key: 'pages',
    },
  ],
  flags: { PRESERVE_WEBPACK_CACHE: true },
}
