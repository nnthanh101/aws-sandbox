import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  icon: string;
  description: string;
};

const personas: FeatureItem[] = [
  {
    title: 'Cloud Platform Engineer',
    icon: '\u2601\uFE0F',
    description: 'Deploy and manage sandbox infrastructure with CDK v2. Automate account lifecycle with Step Functions.',
  },
  {
    title: 'Developer',
    icon: '\uD83D\uDCBB',
    description: 'Request sandboxes on-demand for experimentation. Full AWS Console access with guardrails.',
  },
  {
    title: 'FinOps Lead',
    icon: '\uD83D\uDCB0',
    description: 'FOCUS 1.2+ allocation tags, per-account budgets, and Infracost shift-left cost estimation.',
  },
  {
    title: 'Security Architect',
    icon: '\uD83D\uDD12',
    description: 'SCPs, KMS encryption, WAF, IAM least privilege. Defense-in-depth across all layers.',
  },
  {
    title: 'Engineering Manager',
    icon: '\uD83D\uDCCA',
    description: 'Approve sandbox requests, monitor utilization, and view cost reports across teams.',
  },
];

const verticals: FeatureItem[] = [
  {
    title: 'Financial Services',
    icon: '\uD83C\uDFE6',
    description: 'PCI-DSS compliant sandboxes with encryption at rest, audit logging, and network isolation.',
  },
  {
    title: 'Energy & Utilities',
    icon: '\u26A1',
    description: 'NERC-CIP aligned controls with region locking and automated resource cleanup.',
  },
  {
    title: 'Airlines & Travel',
    icon: '\u2708\uFE0F',
    description: 'SOX-compliant governance with complete audit trails and access control segregation.',
  },
  {
    title: 'Telecommunications',
    icon: '\uD83D\uDCF1',
    description: 'GDPR-ready with data residency controls, retention policies, and right-to-delete support.',
  },
  {
    title: 'Consumer Goods',
    icon: '\uD83C\uDFEA',
    description: 'SOX/GDPR hybrid compliance with cost allocation tags and showback reporting.',
  },
];

function FeatureCard({title, icon, description}: FeatureItem) {
  return (
    <div className={styles.featureCard}>
      <div className={styles.featureIcon}>{icon}</div>
      <div className={styles.featureTitle}>{title}</div>
      <div className={styles.featureDescription}>{description}</div>
    </div>
  );
}

type Props = {
  title: string;
  subtitle: string;
  items: FeatureItem[];
};

function FeatureSection({title, subtitle, items}: Props) {
  return (
    <section className={styles.features}>
      <div style={{width: '100%'}}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <p className={styles.sectionSubtitle}>{subtitle}</p>
        <div className={styles.featureGrid}>
          {items.map((props, idx) => (
            <FeatureCard key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <>
      <FeatureSection
        title="Built for Every Persona"
        subtitle="From platform engineers to engineering managers"
        items={personas}
      />
      <FeatureSection
        title="Enterprise Verticals"
        subtitle="Compliance-ready for regulated industries"
        items={verticals}
      />
    </>
  );
}
