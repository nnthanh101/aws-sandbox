import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Implementation Guide',
      link: {type: 'doc', id: 'guide/guide-index'},
      items: [
        'guide/concepts',
        'guide/regions',
        {
          type: 'category',
          label: 'Prerequisites',
          link: {type: 'doc', id: 'guide/prerequisites/prerequisites-index'},
          items: [
            'guide/prerequisites/aws-accounts',
            'guide/prerequisites/home-region',
            'guide/prerequisites/organizations',
            'guide/prerequisites/enable-services',
          ],
        },
        {
          type: 'category',
          label: 'Deploy the Solution',
          link: {type: 'doc', id: 'guide/deploy/deploy-index'},
          items: [
            'guide/deploy/account-pool-stack',
            'guide/deploy/idc-stack',
            'guide/deploy/data-stack',
            'guide/deploy/compute-stack',
          ],
        },
        {
          type: 'category',
          label: 'Configure the Solution',
          link: {type: 'doc', id: 'guide/configure/configure-index'},
          items: [
            'guide/configure/saml-application',
            'guide/configure/identity-center',
            'guide/configure/web-application',
            'guide/configure/onboard-accounts',
            'guide/configure/external-idp',
          ],
        },
        {
          type: 'category',
          label: 'Use the Solution',
          link: {type: 'doc', id: 'guide/use/use-index'},
          items: [
            'guide/use/administrator',
            'guide/use/manager',
            'guide/use/end-user',
          ],
        },
        {
          type: 'category',
          label: 'Remove the Solution',
          link: {type: 'doc', id: 'guide/remove/remove-index'},
          items: [
            'guide/remove/maintenance-mode',
            'guide/remove/end-leases',
            'guide/remove/delete-stacks',
            'guide/remove/delete-saml',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Architecture',
      items: [
        'architecture/architecture-overview',
        'architecture/cdk-stacks',
        'architecture/security-controls',
        'architecture/account-lifecycle',
        'architecture/data-flow',
        'architecture/multi-cloud',
        'architecture/technology-radar',
      ],
    },
    {
      type: 'category',
      label: 'Operations',
      items: [
        'operations/cost-management',
        'operations/monitoring',
        'operations/troubleshooting',
        'operations/quotas',
      ],
    },
    {
      type: 'category',
      label: 'Development',
      items: [
        'development/local-first',
        'development/testing-tiers',
        'development/contributing',
        'development/adlc-framework',
      ],
    },
    {
      type: 'category',
      label: 'Governance',
      items: [
        'governance/license',
        'governance/security',
        'governance/adlc-constitution',
      ],
    },
  ],
};

export default sidebars;
