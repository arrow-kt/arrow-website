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
    title: 'Arrow',
    tagline: 'The perfect companion for your Kotlin journey',
    favicon: '/img/arrow-brand-icon.svg',
    url: 'https://arrow-kt.io',
    baseUrl: '/',
    trailingSlash: true,
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
            blogSidebarCount: 0,
            blogListComponent: '@site/src/components/Blog/BlogListPage',
            blogTagsPostsComponent:
              '@site/src/components/Blog/BlogTagsPostsPage',
            postsPerPage: 8,
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
        image: '/img/social-card.jpg',
        colorMode: {
          defaultMode: 'light',
          disableSwitch: false,
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
            src: '/img/arrow-brand.svg',
            srcDark: '/img/arrow-brand-dark.svg',
          },
          items: [
            {
              to: '/',
              position: 'right',
              label: 'Home',
              activeBaseRegex: '^/+$',
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
                  activeBaseRegex: '^(/learn/quickstart)',
                },
                {
                  label: 'Typed errors',
                  to: '/learn/typed-errors',
                  activeBaseRegex: '^(/learn/typed-errors)',
                },
                {
                  label: 'Concurrency and resources',
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
                  label: 'Collections and functions',
                  to: '/learn/collections-functions',
                  activeBaseRegex: '^(/learn/collections-functions)',
                },
                {
                  label: 'Design recipes',
                  to: '/learn/design',
                  activeBaseRegex: '^(/learn/design)',
                },
                {
                  label: 'Example projects',
                  to: '/learn/projects',
                  activeBaseRegex: '^(/learn/projects)',
                },
                {
                  label: 'Integrations',
                  to: '/learn/integrations',
                },
              ],
            },
            {
              label: 'API Docs',
              position: 'right',
              href: 'https://apidocs.arrow-kt.io',
            },
            {
              type: 'dropdown',
              position: 'right',
              label: 'Community',
              items: [
                { to: '/community/blog', label: 'Blog' },
                {
                  label: 'More libraries',
                  to: '/libraries',
                },
              ],
            },
            {
              type: 'html',
              position: 'right',
              value: '<img src="https://img.shields.io/maven-central/v/io.arrow-kt/arrow-core?color=5b88f8&label=latest">',
            },
          ],
        },
        footer: {
          links: [
            {
              items: [
                {
                  label: 'API Docs',
                  href: 'https://apidocs.arrow-kt.io',
                },
                {
                  label: 'Blog',
                  to: '/community/blog',
                },
                {
                  label: 'Example projects',
                  to: '/learn/projects',
                },
              ],
            },
            {
              title: 'Learn',
              items: [
                {
                  label: 'Quickstart',
                  to: '/learn/quickstart',
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
              ],
            },
            {
              title: '...',
              items: [
                {
                  label: 'Immutable data',
                  to: '/learn/immutable-data',
                },
                {
                  label: 'Collections and functions',
                  to: '/learn/collections-functions',
                },
                {
                  label: 'Design',
                  to: '/learn/design',
                },
                {
                  label: 'Integrations',
                  to: '/learn/integrations',
                },
              ],
            },
            {
              title: 'Links',
              items: [
                {
                  label: 'Twitter',
                  href: 'https://twitter.com/arrow_kt',
                  icon: '/img/icon-social-twitter.svg',
                },
                {
                  label: 'Slack',
                  href: 'https://slack-chats.kotlinlang.org/c/arrow',
                  icon: '/img/icon-social-slack.svg',
                },
                {
                  label: 'GitHub',
                  href: 'https://github.com/arrow-kt',
                  icon: '/img/icon-social-github.svg',
                },
                {
                  label: 'Stack Overflow',
                  href: 'https://stackoverflow.com/questions/tagged/arrow-kt',
                  icon: '/img/icon-social-stackoverflow.svg',
                },
              ],
            },
          ],
          logo: {
            alt: 'Arrow Logo',
            src: '/img/arrow-brand.svg',
            srcDark: '/img/arrow-brand-dark.svg',
            href: 'https://arrow-kt.io',
            width: 128,
            height: 42,
          },
          copyright: `Arrow is developed and maintained by the community`,
        },
        prism: {
          theme: darkCodeTheme,
          additionalLanguages: ['kotlin', 'java', 'groovy', 'scala', 'haskell'],
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
              files: ['./src/css/vars.css'],
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
    themes: [
      '@docusaurus/theme-mermaid',
      [
        // https://github.com/easyops-cn/docusaurus-search-local
        require.resolve('@easyops-cn/docusaurus-search-local'),
        {
          docsRouteBasePath: '/',
          docsDir: 'content/docs',
          hashed: true,
          indexBlog: false,
          highlightSearchTermsOnTargetPage: false,
          searchResultLimits: 8,
          searchBarShortcutHint: false,
          searchContextByPaths: ['learn', 'ecosystem'],
          useAllContextsWithNoSearchContext: true,
        },
      ],
    ],
  };

  return config;
};

module.exports = createConfig;
