# Sandbox for AWS - ADLC Consumer Project

**Enterprise sandbox account management for AWS Organizations**

> **ADLC Version**: 3.0.0 | **Distribution**: Symlink | **Status**: DEVELOPMENT
> **Source**: Innovation Sandbox on AWS v1.1.8 (Apache 2.0)
> **Stack**: TypeScript 98.6%, CDK v2, Node 22, Vite, Vitest
> **npm**: `sandbox-for-aws` (unscoped, AWS Trademark Section 13 compliant)
> **GitHub**: `nnthanh101/aws-sandbox` (repo name, descriptive context)

---

## GIT SAFETY (BLOCKING — Non-Negotiable)

**Claude and ALL agents MUST NOT execute ANY git operations:**
- `git add` — staging files
- `git commit` — creating commits
- `git push` to any remote (origin, upstream, or any URL)
- `git push --force` or `git push -f`
- `git reset`, `git revert`, `git rebase`
- `gh pr create` or any PR/issue creation commands
- `npm publish` without explicit HITL approval

**Manager (HITL) maintains complete version control authority.**
Agents create/edit files only. Manager stages, commits, and pushes.

---

## Quick Start

```bash
npm install                  # Install dependencies
npx cdk synth               # Synthesize 4 CDK stacks
npm test                     # Vitest snapshot tests
npm run build                # Build frontend
```

## Quick Start with Taskfile (Docker-first)

```bash
task docker:start            # Start sandbox-dev + LocalStack containers
task test:tier1:docker       # Run Tier 1 snapshot tests (2-3s, free)
task synth                   # Synthesize CloudFormation via Docker
task frontend:dev            # Start Vite dev server (port 5173)
task compose:validate        # Verify SSOT pattern
task legal:audit             # Check legal compliance
task --list                  # Show all available tasks
```

## Docker Services

| Service | Image | Purpose |
|---------|-------|---------|
| `sandbox-dev` | `nnthanh101/terraform:latest` | Node 22 + CDK v2 + AWS CLI v2 + Terraform |
| `sandbox-localstack` | `localstack/localstack:latest` | AWS service emulation (Tier 2) |

**Architecture**: `docker-compose.base.yml` is SINGLE SOURCE OF TRUTH, extended by:
- `docker-compose.yml` — standalone/production mode
- `.devcontainer/docker-compose.yml` — VS Code DevContainer mode

## Testing Tiers

| Tier | Command | Duration | Cost | Scope |
|------|---------|----------|------|-------|
| 1 | `task test:tier1:docker` | 2-3s | Free | CDK snapshot tests |
| 2 | `task test:tier2:docker` | 30-60s | Free | LocalStack integration |
| 3 | `task test:tier3` | 5-10min | AWS | Real AWS integration |
| E2E | `npx playwright test` | 10-30s | Free | Browser smoke tests |

## Docker Exec Convention

All npm/cdk commands run inside the container for consistent environment:
```bash
docker exec sandbox-dev npm test
docker exec sandbox-dev npx cdk synth
docker exec sandbox-dev npm run build
```

## CDK Stacks (4 total)

| Stack | CloudFormation ID | Purpose |
|-------|------------------|---------|
| AccountPool | `Sandbox-AccountPool` | Sandbox account lifecycle |
| IDC | `Sandbox-IDC` | IAM Identity Center + SAML |
| Data | `Sandbox-Data` | DynamoDB, S3, SES |
| Compute | `Sandbox-Compute` | Lambda, Step Functions, API GW |

**Note**: Stack IDs renamed from upstream `InnovationSandbox-*` to `Sandbox-*`.
This is a fresh clone with zero deployed stacks — no CloudFormation replacement risk.

## Workspace Packages (Unscoped — KISS)

| Package | Path | Purpose |
|---------|------|---------|
| `sandbox-for-aws` | `./` | Root monorepo (npm publish target) |
| `sandbox-commons` | `source/common` | Shared types + utilities |
| `sandbox-infrastructure` | `source/infrastructure` | CDK stacks + constructs |
| `sandbox-frontend` | `source/frontend` | Vite + React + Cloudscape UI |
| `sandbox-*` | `source/lambdas/**` | Lambda handlers |

## ADLC Framework (via symlink)

| Component | Count | Source |
|-----------|-------|--------|
| Agents | 9 | .claude/agents/ |
| Commands | 69 | .claude/commands/ |
| Skills | 103 | .claude/skills/ |

## Evidence Path

`tmp/aws-sandbox/` (gitignored)

## Legal

- **License**: Apache 2.0 (LICENSE + NOTICE at repo root — MANDATORY)
- **Attribution**: Based on Innovation Sandbox on AWS by Amazon.com, Inc.
- **Construct IDs**: `Sandbox-*` (renamed from upstream `InnovationSandbox-*`)
- **Branding**: `sandbox-for-aws` (npm publish), `sandbox-*` (workspace packages)
