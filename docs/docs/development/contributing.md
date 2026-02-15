---
id: contributing
title: Contributing
sidebar_label: Contributing
sidebar_position: 3
---

# Contributing

Guidelines for contributing to Sandbox for AWS.

## Development Workflow

```mermaid
graph LR
    FORK[Fork/Branch] --> DEV[Develop]
    DEV --> TEST[Test Locally]
    TEST --> PR[Pull Request]
    PR --> REVIEW[Code Review]
    REVIEW --> MERGE[Merge to Main]
```

### CI/CD Pipeline

```mermaid
graph LR
    subgraph "Build"
        INSTALL[npm install] --> LINT[ESLint + Prettier]
        LINT --> BUILD[npm run build]
    end

    subgraph "Synthesize"
        BUILD --> SYNTH[cdk synth<br/>4 stacks]
    end

    subgraph "Test"
        SYNTH --> TIER1[Tier 1<br/>Vitest Snapshots<br/>721 tests, 2-3s]
        TIER1 -->|pass| TIER2[Tier 2<br/>LocalStack<br/>30-60s]
        TIER2 -->|pass| SEC[Security Scan<br/>Trivy + Checkov]
        SEC -->|pass| TIER3[Tier 3<br/>AWS Deploy + Test<br/>5-10min]
    end

    subgraph "Publish"
        TIER3 -->|pass| DOCS[Docusaurus Build<br/>GitHub Pages]
        TIER3 -->|pass| PKG[npm pack<br/>sandbox-for-aws]
    end

    style TIER1 fill:#9f9,stroke:#333
    style TIER2 fill:#ff9,stroke:#333
    style TIER3 fill:#f99,stroke:#333
```

## Setup

1. Clone the repository:
```bash
git clone https://github.com/nnthanh101/aws-sandbox.git
cd aws-sandbox
```

2. Start the development environment:
```bash
task docker:start
```

3. Install dependencies:
```bash
docker exec sandbox-dev npm install
```

4. Run tests to verify setup:
```bash
task test:tier1:docker
```

## Code Standards

| Area | Tool | Command |
|------|------|---------|
| TypeScript | ESLint + Prettier | `npm run lint` |
| CDK | Snapshot tests | `task test:tier1:docker` |
| Security | Trivy + Checkov | `task security:scan` |
| Legal | License headers | `task legal:audit` |

## Pull Request Checklist

Before submitting a PR:

- [ ] Tier 1 snapshot tests pass (`task test:tier1:docker`)
- [ ] Tier 2 LocalStack tests pass (`task test:tier2:docker`)
- [ ] Frontend tests pass (`task test:frontend:docker`)
- [ ] No security scan findings (`task security:scan`)
- [ ] License headers present on modified files
- [ ] Documentation updated if API changed

## License Headers

Files derived from the upstream Innovation Sandbox on AWS codebase must retain the Amazon copyright:

```typescript
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
```

New original files (tests, configuration, documentation) do **not** receive the Amazon copyright header.

## Branch Naming

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feature/description` | `feature/budget-alerts` |
| Bug fix | `fix/description` | `fix/cleanup-timeout` |
| Docs | `docs/description` | `docs/workshop-guide` |

## Commit Messages

Follow conventional commits:

```
feat: add budget alert notifications
fix: resolve account cleanup timeout
docs: update workshop deploy guide
chore: upgrade CDK to v2.170
```
