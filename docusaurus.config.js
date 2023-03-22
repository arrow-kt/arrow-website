// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/ban-ts-comment */

/*
 * The following is a workaround when importing some pure ESM packages
 * (e.g. remark-directive) in the Docusaurus config, which is CommonJS.
 * More info can be found in:
 *
 * https://github.com/facebook/docusaurus/issues/6520
 * https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c
 *
 */
const createConfig = async () => {
  const { arrowDark: darkCodeTheme } = await import(
    './src/utils/arrowDark.mjs'
  );

  /** @type {import('@docusaurus/types').Config} */
  const config = {
    title: 'Λrrow',
    tagline: 'Idiomatic functional programming for Kotlin',
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
            path: 'content/docs',
            routeBasePath: '/',
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
            customCss: [
              require.resolve('./src/css/typography.css'),
              require.resolve('./src/css/vars.css'),
              require.resolve('./src/css/custom.css'),
            ],
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
        docs: {
          sidebar: {
            autoCollapseCategories: true,
          },
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
              to: '/about/what-is-arrow',
              position: 'right',
              label: 'About',
            },
            {
              type: 'dropdown',
              position: 'right',
              label: 'Learn',
              to: '/learn/overview',
              items: [
                {
                  label: 'Quickstart',
                  to: '/learn/quickstart',
                },
                {
                  label: 'Typed errors',
                  to: '/learn/typed-errors',
                  activeBaseRegex: '^(/learn/typed-errors)',
                },
                {
                  label: 'Coroutines',
                  to: '/learn/coroutines',
                  activeBaseRegex: '^(/learn/coroutines)',
                },
                {
                  label: 'Resilience',
                  to: '/learn/resilience',
                  activeBaseRegex: '^(/learn/resilience)',
                },
                {
                  label: 'Immutable data',
                  to: '/learn/immutable-data',
                  activeBaseRegex: '^(/learn/immutable-data)',
                },
                {
                  label: 'Design',
                  to: '/learn/design',
                  activeBaseRegex: '^(/learn/design)',
                },
              ],
            },
            {
              label: 'API Docs',
              position: 'right',
              to: 'https://arrow-kt.github.io/arrow/index.html',
            },
            {
              type: 'dropdown',
              position: 'right',
              label: 'Incubation',
              to: '/incubation/overview',
              items: [
                {
                  label: 'Analysis',
                  to: '/incubation/analysis',
                  activeBaseRegex: '^(/incubation/analysis)',
                },
              ],
            },
            {
              to: '/libraries',
              position: 'right',
              label: 'Libraries',
            },
            {
              to: '/training',
              position: 'right',
              label: 'Training',
            },
            {
              type: 'dropdown',
              position: 'right',
              label: 'Community',
              items: [
                { to: '/community/support', label: 'Support' },
                { to: '/community/blog', label: 'Blog' },
                { to: '/community/events', label: 'Events' },
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
                  to: '/about/what-is-arrow',
                },
                {
                  label: 'Learn',
                  to: '/learn/overview',
                },
                {
                  label: 'Libraries',
                  to: '/libraries',
                },
                {
                  label: 'Training',
                  to: '/training',
                },
                {
                  label: 'Community',
                  to: '/community/support',
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
                  label: 'Typed errors',
                  to: '/learn/typed-errors',
                },
                {
                  label: 'Coroutines',
                  to: '/learn/coroutines',
                },
                {
                  label: 'Resilience',
                  to: '/learn/resilience',
                },
                {
                  label: 'Immutable data',
                  to: '/learn/immutable-data',
                },
                {
                  label: 'Design',
                  to: '/learn/design',
                },
              ],
            },
            {
              title: 'More',
              items: [
                {
                  label: 'API Docs',
                  to: 'https://arrow-kt.github.io/arrow/index.html',
                },
                {
                  label: 'Analysis',
                  to: '/incubation/analysis',
                },
              ],
            },
            {
              title: 'Community',
              items: [
                {
                  label: 'Support',
                  to: '/community/support',
                },
                {
                  label: 'Events',
                  to: '/community/events',
                },
                {
                  label: 'Blog',
                  to: '/community/blog',
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
          theme: darkCodeTheme,
          additionalLanguages: ['kotlin', 'java', 'groovy'],
          defaultLanguage: 'kotlin',
        },
        mermaid: {
          theme: {
            light: 'base',
            dark: 'base',
          },
          options: {
            themeVariables: {
              fontFamily:
                "'Inter', open sans, sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
              fontSize: '14px',
              primaryColor: '#2455cf',
              primaryTextColor: '#fff',
              secondaryColor: '#e88d15',
              lineColor: '#222e51',
            },
          },
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
      () => ({
        name: 'docusaurus-custom-media',
        configurePostCss(postcssOptions) {
          // Appends Global Data, Custom Media and AutoPrefixer.
          postcssOptions.plugins.push(
            // @ts-ignore
            require('@csstools/postcss-global-data')({
              files: ['./src/css/custom.css'],
            }),
          );
          postcssOptions.plugins.push(require('postcss-custom-media'));
          postcssOptions.plugins.push(require('autoprefixer'));
          return postcssOptions;
        },
      }),
    ],
    markdown: {
      mermaid: true,
    },
    themes: ['@docusaurus/theme-mermaid'],
  };

  return config;
};

module.exports = createConfig;
