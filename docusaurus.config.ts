import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Viren070\'s Guides',
  tagline: 'Dinosaurs are cool',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://guides.viren070.me/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  trailingSlash: false,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  onBrokenAnchors: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en-GB',
    locales: ['en-GB'],
  },

  presets: [
    [
      'classic',
      {
        sitemap: {
          lastmod: "date",
          changefreq: 'weekly',
          priority: 0.8,
          filename: 'sitemap.xml',
        },
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/Viren070/guides/edit/main/',
          routeBasePath: '/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Viren070\'s Guides',
      logo: {
        alt: 'Guides Logo',
        src: 'img/viren070_pfp.svg',
      },
      items: [
        // add widget here as navbar is always loaded regardless of page
        {
          type: 'custom-kofi',
          position: 'right',
          widgetType: 'widget',
        },
        {
          type: 'custom-toastcontainer',
          position: 'right',
        },
        {
          href: 'https://github.com/Viren070/guides',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Categories',
          items: [
            {
              label: 'Gaming',
              to: 'category/gaming',
            },
            {
              label: 'Streaming',
              to: 'category/streaming',
            },
            {
              label: 'Reading',
              to: 'category/reading',
            }
          ],
        },
        {
          title: 'Popular',
          items: [
            {
              label: 'Stremio',
              to: 'stremio',
            },
            {
              label: 'Plutonium',
              to: 'plutonium',
            },
          ]
        }, 
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/Viren070/guides',
            },
            {
              label: 'Ko-fi',
              href: 'https://ko-fi.com/viren070',
            },
          ],
        },
      ],
    },
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    docs: {
      sidebar: {
        autoCollapseCategories: true,
        hideable: true,
      }
    },
    algolia: {
      // The application ID provided by Algolia
      appId: 'H8VMKESUZ1',

      // Public API key: it is safe to commit it
      apiKey: '5e266f4d711fe4a8737eed20bce3610d',

      indexName: 'guides-viren070',

      // Optional: see doc section below
      contextualSearch: true,

      // Optional: Algolia search parameters
      searchParameters: {},

      // Optional: path for search page that enabled by default (`false` to disable it)
      searchPagePath: 'search',

      // Optional: whether the insights feature is enabled or not on Docsearch 
      insights: false,

      //... other Algolia params
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
