// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const lightCodeTheme = require('prism-react-renderer/themes/vsDark');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Λrrow',
  tagline: "Functional companion to Kotlin's Standard Library",
  favicon: 'img/arrow-brand-icon.svg',
  url: 'https://arrow-kt.io',
  baseUrl: '/',
  trailingSlash: true,
  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'arrow-kt', // Usually your GitHub org/user name.
  projectName: 'arrow-website', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: 'content/learn',
          routeBasePath: 'learn',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/arrow-kt/arrow-website/edit/main/',
          breadcrumbs: false,
        },
        pages: {
          path: 'src/pages',
        },
        blog: {
          path: 'content/blog',
          routeBasePath: 'community/blog',
          showReadingTime: true,
          editUrl: 'https://github.com/arrow-kt/arrow-website/edit/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        defaultMode: 'light',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      navbar: {
        logo: {
          alt: 'Arrow Logo',
          src: 'img/arrow-brand.svg',
        },
        items: [
          {
            to: '/',
            position: 'right',
            label: 'Home',
            activeBaseRegex: '^/+$',
          },
          {
            to: 'about/what-is-arrow',
            position: 'right',
            label: 'About',
          },
          {
            type: 'dropdown',
            position: 'right',
            label: 'Learn',
            items: [
              {
                label: 'Overview',
                to: 'learn/overview',
              },
              {
                label: 'Quickstart',
                to: 'learn/quickstart',
              },
              {
                label: 'Typed errors',
                to: 'learn/category/typed-errors',
                activeBaseRegex:
                  '^(/learn/category/typed-errors)|^(/learn/typed-errors)',
              },
              {
                label: 'Coroutines',
                to: 'learn/category/coroutines',
                activeBaseRegex:
                  '^(/learn/category/coroutines)|^(/learn/coroutines)',
              },
              {
                label: 'Resilience',
                to: 'learn/category/resilience',
                activeBaseRegex:
                  '^(/learn/category/resilience)|^(/learn/resilience)',
              },
              {
                label: 'Design',
                to: 'learn/category/design',
                activeBaseRegex: '^(/learn/category/design)|^(/learn/design)',
              },
            ],
          },
          {
            to: 'projects',
            position: 'right',
            label: 'Projects',
          },
          {
            to: 'training',
            position: 'right',
            label: 'Training',
          },
          {
            type: 'dropdown',
            position: 'right',
            label: 'Community',
            items: [
              { to: 'community/support', label: 'Support' },
              { to: 'community/blog', label: 'Blog' },
              { to: 'community/events', label: 'Events' },
            ],
          },
        ],
      },
      footer: {
        links: [
          {
            title: 'Menu',
            items: [
              {
                label: 'About',
                to: 'about/what-is-arrow',
              },
              {
                label: 'Learn',
                to: 'learn/quickstart',
              },
              {
                label: 'Projects',
                to: 'projects',
              },
              {
                label: 'Training',
                to: 'training',
              },
              {
                label: 'Community',
                to: 'community/support',
              },
            ],
          },
          {
            title: 'Learn',
            items: [
              {
                label: 'Quickstart',
                to: 'learn/quickstart',
              },
              {
                label: 'Overview',
                to: 'learn/overview',
              },
              {
                label: 'Typed errors',
                to: 'learn/category/typed-errors',
              },
              {
                label: 'Coroutines',
                to: 'learn/category/coroutines',
              },
              {
                label: 'Resilience',
                to: 'learn/category/resilience',
              },
              {
                label: 'Design',
                to: 'learn/category/design',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Support',
                to: 'community/support',
              },
              {
                label: 'Events',
                to: 'community/events',
              },
              {
                label: 'Blog',
                to: 'community/blog',
              },
            ],
          },
          {
            title: 'Links',
            items: [
              {
                label: 'Twitter',
                href: 'https://twitter.com/arrow-kt',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/arrow-kt',
              },
              {
                label: 'YouTube',
                href: 'https://www.youtube.com/@xebiafunctional',
              },
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/arrow-kt',
              },
            ],
          },
        ],
        logo: {
          alt: 'Arrow Logo',
          src: 'img/arrow-brand.svg',
          href: 'https://arrow-kt.io',
          width: 128,
          height: 42,
        },
        copyright: `Arrow is designed and developed by ARROW with support from Xebia Functional`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['kotlin'],
        defaultLanguage: 'kotlin',
      },
    }),

  plugins: [
    () => ({
      name: 'yaml-loader-plugin',
      configureWebpack() {
        return {
          module: {
            rules: [
              {
                test: /\.ya?ml$/,
                use: 'yaml-loader',
              },
            ],
          },
        };
      },
    }),
  ],
};

module.exports = config;
