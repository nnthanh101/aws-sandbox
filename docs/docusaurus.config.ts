import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Sandbox for AWS',
  tagline: 'Enterprise sandbox account management for AWS Organizations',
  favicon: 'img/logo.svg',

  url: 'https://nnthanh101.github.io',
  baseUrl: '/aws-sandbox/',

  organizationName: 'nnthanh101',
  projectName: 'aws-sandbox',

  onBrokenLinks: 'throw',
  onBrokenAnchors: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  themes: [
    '@docusaurus/theme-mermaid',
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        language: ['en'],
        indexBlog: false,
        docsRouteBasePath: '/docs',
        highlightSearchTermsOnTargetPage: true,
      },
    ],
  ],

  plugins: [
    'docusaurus-plugin-image-zoom',
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/nnthanh101/aws-sandbox/tree/main/docs/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Sandbox for AWS',
      logo: {
        alt: 'Sandbox for AWS Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/docs/guide',
          label: 'Implementation Guide',
          position: 'left',
        },
        {
          href: 'https://github.com/nnthanh101/aws-sandbox',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Get Started',
          items: [
            {label: 'Introduction', to: '/docs/intro'},
            {label: 'Implementation Guide', to: '/docs/guide'},
            {label: 'Architecture', to: '/docs/architecture/overview'},
          ],
        },
        {
          title: 'Resources',
          items: [
            {label: 'GitHub', href: 'https://github.com/nnthanh101/aws-sandbox'},
            {label: 'API Reference', href: 'pathname:///aws-sandbox/openapi/innovation-sandbox-api.yaml'},
            {label: 'AWS Solutions', href: 'https://aws.amazon.com/solutions/implementations/innovation-sandbox/'},
          ],
        },
        {
          title: 'Community',
          items: [
            {label: 'Issues', href: 'https://github.com/nnthanh101/aws-sandbox/issues'},
            {label: 'Discussions', href: 'https://github.com/nnthanh101/aws-sandbox/discussions'},
            {label: 'Contributing', to: '/docs/development/contributing'},
          ],
        },
      ],
      copyright: `Copyright ${new Date().getFullYear()} <a href="https://oceansoft.io">oceansoft.io</a>. Built with Docusaurus. Based on <a href="https://aws.amazon.com/solutions/implementations/innovation-sandbox/">Innovation Sandbox on AWS</a>.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'yaml', 'typescript'],
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    mermaid: {
      theme: {light: 'neutral', dark: 'dark'},
    },
    zoom: {
      selector: '.markdown img',
      background: {
        light: 'rgb(255, 255, 255)',
        dark: 'rgb(50, 50, 50)',
      },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
