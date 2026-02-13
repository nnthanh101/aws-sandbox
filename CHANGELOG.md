# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-02-12

### Changed

- **REBRANDED**: Shallow-cloned from Innovation Sandbox on AWS v1.1.8
- Root npm package: `@amzn/innovation-sandbox-on-aws` -> `sandbox-for-aws` (AWS Trademark Section 13 compliant)
- Workspace packages: `@amzn/innovation-sandbox-*` -> unscoped `sandbox-*` (KISS)
- README rewritten with upstream attribution, contact changed to info@oceansoft.io
- Replaced Amazon-specific governance files with Contributor Covenant v2.1
- Updated license headers with dual attribution (oceansoft.io + Amazon.com, Inc.)
- Deleted `solution-manifest.yaml` — refactored `manifest-reader.ts` to read from `package.json` (KISS: one source of truth for name/version)
- Replaced `license_header.txt` with enterprise branding
- Fixed `deployment/build-s3-dist.sh` workspace reference
- Renamed all `InnovationSandbox-*` construct IDs to `Sandbox-*` (307 occurrences across 37 files: stack IDs, IAM roles, SCP ARN patterns, SSM params, KMS aliases, facade class, error classes)

### Added

- ADLC framework integration (9 agents, 69 commands, 103 skills via symlink)
- CLAUDE.md project configuration
- settings.local.json (Tier 2 ADLC overrides)
- Git-push protection (agents MUST NOT push to remote)
- Enterprise vertical customization support (FSI, Energy, Airline, Telecom, FMCG)
- Local-first infrastructure: docker-compose.base.yml (SSOT), docker-compose.yml, .devcontainer/
- Taskfile.yml with 42 tasks (validate, build, synth, test, docker, localstack, security, evidence, legal)
- Playwright E2E scaffold (playwright.config.ts, tests/e2e/smoke.spec.ts)
- NOTICE updated with REBRANDED PACKAGES section (26 packages, Apache 2.0 Section 4(c) compliant)
- FOCUS 1.3 cost allocation tags (CostCenter, Environment, Project, Owner, ManagedBy) on all CDK resources
- GitHub Actions CI workflow (.github/workflows/ci.yml)

### Attribution

Based on [Innovation Sandbox on AWS](https://github.com/aws-solutions/innovation-sandbox-on-aws) v1.1.8
by Amazon.com, Inc. Licensed under Apache 2.0.

---

## Upstream History (Innovation Sandbox on AWS)

## [1.1.8] - 2026-02-04

### Security

- Upgraded `aws-nuke` to mitigate:
  - [CVE-2025-61726](https://nvd.nist.gov/vuln/detail/CVE-2025-61726)
  - [CVE-2025-8732](https://nvd.nist.gov/vuln/detail/CVE-2025-8732)
  - [CVE-2025-61728](https://nvd.nist.gov/vuln/detail/CVE-2025-61728)
  - [CVE-2025-61730](https://nvd.nist.gov/vuln/detail/CVE-2025-61730)
- Upgraded `fast-xml-parser` to mitigate [CVE-2026-25128](https://nvd.nist.gov/vuln/detail/CVE-2026-25128)
- Upgraded `lodash` to mitigate [CVE-2025-13465](https://nvd.nist.gov/vuln/detail/CVE-2025-13465)
- Upgraded `aws-nuke` to v3.63.2 to resolve discovery short-circuit behavior when encountering SCP-protected log groups
- All files, initial version (Amazon.com, Inc.)
