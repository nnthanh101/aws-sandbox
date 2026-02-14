---
id: security
title: Security Policy
sidebar_label: Security
sidebar_position: 2
---

# Security Policy

## Reporting Vulnerabilities

If you discover a security vulnerability in Sandbox for AWS, please report it responsibly.

**Do NOT open a public GitHub issue for security vulnerabilities.**

Instead, report via:
1. GitHub Security Advisories (preferred)
2. Email to the repository maintainers

## Security Controls

See [Security Controls](/docs/architecture/security-controls) for the full defense-in-depth architecture.

### Summary

| Layer | Controls |
|-------|----------|
| Network | AWS WAF, CloudFront, VPC |
| Identity | IAM Identity Center, SAML 2.0 |
| Authorization | IAM policies, SCPs, RBAC |
| Data | KMS encryption at rest, TLS in transit |
| Monitoring | CloudTrail, CloudWatch, audit logs |

## Dependency Management

- Dependencies are pinned in `package-lock.json`
- Regular `npm audit` checks for known vulnerabilities
- Trivy scans container images and IaC templates
- Checkov validates CloudFormation security best practices

```bash
# Run security scan
task security:scan
```

## Secure Development

### Code Review Requirements

- All changes require pull request review
- Security-sensitive changes require additional reviewer
- Automated security scanning in CI/CD pipeline

### Secret Management

- No secrets in source code or environment files
- Use AWS Secrets Manager or SSM Parameter Store
- `.env` files are gitignored
- IAM roles used instead of access keys where possible

## Compliance

Sandbox for AWS supports enterprise compliance requirements:

| Framework | Support |
|-----------|---------|
| SOX | Audit logging, access controls |
| PCI-DSS | Encryption, network isolation |
| GDPR | Data retention policies, access controls |
| HIPAA | Encryption at rest and in transit |
