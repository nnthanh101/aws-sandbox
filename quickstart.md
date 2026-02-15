# Sandbox for AWS - Enterprise Quickstart

> **From Zero to Sandbox in 15 Minutes** | $0 Local-First Development
>
> ADLC v3.2.0 | CDK v2 | Node 22 | Docker-First | Apache 2.0

---

## Choose Your Path

| Persona | Goal | Time | Command |
|---------|------|------|---------|
| **Developer** | Local dev loop + CDK tests | 15 min | `task quickstart:dev` |
| **Platform Admin** | Deploy 4 CDK stacks to AWS | 30 min | `task deploy:production-checklist` |
| **FinOps Lead** | Cost estimation + tag compliance | 10 min | `task cost:estimate` |
| **Security Engineer** | Scan + validate + audit | 10 min | `task security:scan` |
| **Team Lead / Manager** | Review + approve + sign-off | 5 min | `task manager:review:full` |

---

## 1. Prerequisites (5 minutes)

### Required

| Tool | Version | Install | Verify |
|------|---------|---------|--------|
| Docker Desktop | >= 20.10 | [docker.com](https://docker.com) | `docker --version` |
| Task runner | >= 3.0 | `brew install go-task` | `task --version` |
| Git | >= 2.0 | Pre-installed on macOS/Linux | `git --version` |

### Optional (for Tier 3 AWS)

| Tool | Version | Purpose |
|------|---------|---------|
| AWS CLI v2 | >= 2.x | `aws sso login` for Tier 3 |
| Infracost | latest | Cost estimation (`INFRACOST_API_KEY`) |

### System Requirements

- **RAM**: 8 GB minimum (4 GB LocalStack + 2 GB sandbox-dev + 2 GB OS)
- **Disk**: 20 GB free (container images + LocalStack data + evidence)
- **OS**: macOS, Linux, Windows (WSL2)

> **No AWS credentials required** for Tier 1 + Tier 2 ($0 cost development)

---

## 2. Developer Quickstart (15 Minutes)

### One Command Startup

```bash
git clone https://github.com/nnthanh101/aws-sandbox.git
cd aws-sandbox
task quickstart:dev
```

`task quickstart:dev` orchestrates:

| Step | Task | Duration | What Happens |
|------|------|----------|-------------|
| 1 | `docker:start` | ~30s | Start `sandbox-dev` + `sandbox-localstack` containers |
| 2 | `docker:health` | ~15s | Verify LocalStack healthy + Node/CDK versions |
| 3 | `test:tier1:docker` | ~3s | Run 721 CDK snapshot tests ($0 cost) |
| 4 | `synth` | ~10s | Synthesize 4 CloudFormation stacks |
| 5 | `frontend:dev` | ~5s | Start Vite dev server on port 5173 |

### Success Validation

After `task quickstart:dev` completes, verify:

```bash
# Containers running
docker ps --format "table {{.Names}}\t{{.Status}}"
# Expected: sandbox-dev (healthy), sandbox-localstack (healthy)

# Evidence captured
ls tmp/aws-sandbox/test-results/tier1/
# Expected: YYYY-MM-DD-HHMMSS.log with PASS

# Frontend accessible
open http://localhost:5173
# Expected: Cloudscape UI dashboard
```

---

## 3. Zero-Cost Local-First Path

### Testing Tiers

```
Tier 1 (Snapshot)        Tier 2 (LocalStack)        Tier 3 (Real AWS)
task test:tier1:docker   task test:tier2:docker      task test:tier3
2-3 seconds              30-60 seconds               5-10 minutes
$0 cost                  $0 cost                     $5-10/run
No AWS login             No AWS login                AWS SSO required
CDK snapshots            Integration tests           E2E deployment
```

**Recommended workflow**: Develop on Tier 1 + 2 (free), validate on Tier 3 before production.

### Docker Architecture

```
Host Machine
├── sandbox-dev (172.29.0.3)       ← Node 22 + CDK v2 + AWS CLI + Terraform
│   ├── Port 3000-3001             ← API / Docusaurus
│   └── Port 5173-5179             ← Vite frontend
├── sandbox-localstack (172.29.0.2) ← 15 AWS services emulated
│   └── Port 4566                  ← AWS endpoint
└── sandbox-network (172.29.0.0/16) ← Isolated bridge network
```

**SSOT Pattern**: `docker-compose.base.yml` is the single source of truth, extended by:
- `docker-compose.yml` for standalone mode
- `.devcontainer/docker-compose.yml` for VS Code DevContainer mode

```bash
task compose:validate    # Verify SSOT pattern (4/4 checks)
```

---

## 4. MCP Environment Switching

Two MCP configurations for hybrid cloud development:

| Config | File | Servers | Target | Cost |
|--------|------|---------|--------|------|
| **LocalStack** | `.mcp-local.json` | 6 servers | `localhost:4566` | $0 |
| **Real AWS** | `.mcp.json` | 8 servers | AWS APIs | Pay-per-use |

### Switch Environments

```bash
# LocalStack (Tier 2, $0 cost) — DEFAULT for development
task mcp:local
claude --mcp-config .mcp-local.json

# Real AWS (requires SSO login)
aws sso login --profile <your-profile>
task mcp:aws
claude --mcp-config .mcp.json

# Check current status
task mcp:status
```

### MCP Servers

| Server | LocalStack | Real AWS | Purpose |
|--------|-----------|----------|---------|
| `awslabs.cdk-toolkit` | Yes | Yes | CDK best practices + Nag checks |
| `awslabs.cloudformation` | Yes | Yes | Template validation + stack ops |
| `awslabs.iam` | Yes | Yes | Policy analysis + least-privilege |
| `awslabs.cloudwatch` | Yes | Yes | Metrics, logs, alarms |
| `awslabs.lambda-tool` | Yes | Yes | Lambda debugging + invocation |
| `awslabs.cost-explorer` | No | Yes | FOCUS 1.3 cost tracking |
| `awslabs.terraform-mcp` | No | Yes | Terraform registry integration |
| `playwright-automation` | Yes | Yes | E2E testing + screenshots |

### Cross-Validation (MCP vs CLI)

```bash
task mcp:cross-validate    # 5 operations, target >=99.5% accuracy
```

---

## 5. ADLC Agent Coordination

This project follows the **Agent Development Lifecycle (ADLC) v3.2.0** with 9 specialized agents.

### Coordination Protocol (BLOCKING)

```
product-owner FIRST → cloud-architect SECOND → specialist agents THIRD
```

Every infrastructure change requires:
1. **product-owner** validates business requirements
2. **cloud-architect** approves technical design
3. Specialist agents execute (cdk-infrastructure-engineer, qa-engineer, etc.)
4. Evidence logged to `tmp/aws-sandbox/coordination-logs/`

### Top Skills

| Skill | Trigger | What It Does |
|-------|---------|-------------|
| `/cdk:test` | CDK validation | Runs 3-tier testing (snapshot → LocalStack → AWS) |
| `/cdk:synth` | Stack synthesis | Validates 4 CloudFormation templates |
| `/docs:diagrams` | Architecture diagrams | Generates 9 PNG diagrams via Python `diagrams` |
| `/mcp:validate` | Cross-validation | MCP vs AWS CLI accuracy check (>=99.5%) |
| `/security:scan` | Security gates | Trivy + Checkov + CDK Nag + npm audit |
| `/finops:cost` | Cost estimation | Infracost breakdown for all 4 stacks |
| `/docs:validate` | Docs validation | Build + page count + Playwright E2E |
| `/cdk:deploy` | CDK deployment | Multi-stack deployment with 35 checkpoints |

### ADLC Framework Stats

| Component | Count | Location |
|-----------|-------|----------|
| Agents | 9 | `.claude/agents/` |
| Commands | 78 | `.claude/commands/` |
| Skills | 128 | `.claude/skills/` |
| Constitution | 7 principles, 58 checkpoints | `.specify/memory/constitution.md` |

---

## 6. CDK Stacks (4 Total)

| Stack | CloudFormation ID | Purpose | Monthly Cost |
|-------|------------------|---------|-------------|
| AccountPool | `Sandbox-AccountPool` | Sandbox account lifecycle | ~$5 |
| IDC | `Sandbox-IDC` | IAM Identity Center + SAML | ~$0 |
| Data | `Sandbox-Data` | DynamoDB, S3, SES | ~$10-30 |
| Compute | `Sandbox-Compute` | Lambda, Step Functions, API GW | ~$20-100 |
| **Total** | | | **$36-149/mo** |

```bash
task synth                     # Synthesize all 4 stacks
task synth:stack -- Sandbox-Data  # Synthesize specific stack
task cost:estimate             # Infracost breakdown per stack
```

---

## 7. Production Deployment Checklist

Before deploying to AWS, run the production checklist:

```bash
task deploy:production-checklist
```

This orchestrates all pre-deployment gates:

| # | Gate | Task | Validates |
|---|------|------|----------|
| 1 | SSOT Pattern | `compose:validate` | Docker compose extends correctly |
| 2 | Legal Compliance | `legal:audit` | LICENSE + NOTICE + headers (Apache 2.0) |
| 3 | Security Scan | `security:scan` | Trivy + Checkov (CRITICAL/HIGH = BLOCK) |
| 4 | CDK Nag | `security:cdknag` | AWS Solutions rules (suppressions documented) |
| 5 | Cost Estimate | `cost:estimate` | Infracost < $200/mo (approval required if exceeded) |
| 6 | FinOps Tags | `finops:validate-tags` | FOCUS 1.3 (CostCenter, Environment, Project, Owner) |
| 7 | Tier 1 Tests | `test:tier1:docker` | 721 snapshot tests PASS |
| 8 | Tier 2 Tests | `test:tier2:docker` | LocalStack integration PASS |
| 9 | Definition of Done | `dod:tier1-2` | Local-first DoD checklist |
| 10 | Manager Review | `manager:review:full` | HITL sign-off |

### Constitutional Compliance

All deployments must satisfy 7 ADLC principles:

1. **Acceptable Agency** — HITL approval for deployments + cost > $100/mo
2. **Interoperability** — MCP standard, OAuth, least-privilege
3. **Evaluation-First** — 100% code coverage, >=95% agent behavior quality
4. **Hybrid Deployment** — LocalStack (Tier 2) validated before AWS (Tier 3)
5. **Observability** — Evidence logged to `tmp/aws-sandbox/`
6. **Governance** — 58 checkpoints before deployment
7. **Agent Engineering** — Orchestrator pattern (50-100 LOC agents)

---

## 8. Enterprise Vertical Quickstarts

Compliance-specific deployment guidance for regulated industries:

| Vertical | Compliance | Estimated Cost | Key Requirements |
|----------|-----------|---------------|-----------------|
| **FSI / Banking** | PCI-DSS v4.0 | ~$200/mo | Encryption at rest + transit, audit logging, VPC isolation |
| **Energy / Utilities** | NERC-CIP | ~$150/mo | Critical infrastructure protection, access control |
| **Airline / Aviation** | SOX | ~$150/mo | Financial controls, change management audit trail |
| **Telecom** | GDPR | ~$200/mo | Data residency (ap-southeast-2), consent management |
| **FMCG / Retail** | SOX | ~$100/mo | Financial reporting controls, inventory tracking |

### Vertical-Specific Security Gates

```bash
# All verticals — baseline security
task security:scan           # Trivy + Checkov
task security:cdknag         # AWS Solutions rules
task security:sast           # npm audit + license-checker

# FSI additional — encryption validation
task finops:validate-tags    # CostCenter tagging (PCI-DSS requirement)

# GDPR additional — data residency
# Verify region: ap-southeast-2 (Australia) or eu-west-1 (Ireland)
```

---

## 9. Troubleshooting

### Common Issues

| Problem | Diagnostic | Fix |
|---------|-----------|-----|
| Docker not running | `docker ps` → connection refused | Start Docker Desktop |
| LocalStack unhealthy | `task docker:health` → FAIL | `task docker:stop && task docker:start` |
| Port 4566 in use | `lsof -i :4566` | Kill process or change `LOCALSTACK_PORT` |
| CDK synth fails | `task synth` → asset error | `task clean && task build && task synth` |
| Node version mismatch | `docker exec sandbox-dev node -v` | Use Docker exec (container has Node 22) |
| MCP server timeout | `task mcp:status` → NOT RUNNING | Restart LocalStack: `task docker:start` |
| Frontend build fails | `task frontend:dev` → error | `docker exec sandbox-dev npm install` |

### Health Check Commands

```bash
task docker:health         # Container stats + versions
task docker:status         # Container up/down status
task localstack:status     # LocalStack service health
task mcp:status            # MCP config + endpoint health
task compose:validate      # SSOT pattern validation
```

---

## 10. Documentation & Next Steps

### Full Documentation (47+ pages)

Browse at: [nnthanh101.github.io/aws-sandbox](https://nnthanh101.github.io/aws-sandbox/)

| Section | Topics |
|---------|--------|
| [Architecture](/docs/architecture/) | Data flow, multi-cloud, CDK stacks, security |
| [Development](/docs/development/) | ADLC framework, testing tiers, contributing, local-first |
| [Governance](/docs/governance/) | ADLC constitution, compliance |
| [Operations](/docs/operations/) | Service quotas, monitoring |
| [Guide](/docs/guide/) | Configure, deploy, remove |

### Architecture Diagrams (9 PNG)

Generated via Python `diagrams` library:

```bash
task diagrams:generate     # Generate all 9 PNGs
task diagrams:validate     # Verify size >= 100KB each
```

| Diagram | File | Content |
|---------|------|---------|
| Enterprise Architecture | `enterprise_architecture.png` | AWS + Azure + Docker topology |
| Sandbox Components | `sandbox_components.png` | 4 CDK stacks overview |
| CDK Stack Dependencies | `cdk_stacks.png` | Stack dependency graph |
| Lambda Function Map | `lambda_map.png` | 21 Lambda handlers |
| Security Architecture | `security_architecture.png` | 5-layer defense model |
| AWS Organizations | `organizations.png` | Multi-account structure |
| MCP Architecture | `mcp_architecture.png` | 8 MCP server topology |
| ADLC Framework | `adlc_framework.png` | 9 agents + 77 commands |
| Cost Architecture | `cost_architecture.png` | Cost-annotated ($36-149/mo) |

### Essential Task Commands

```bash
# Development
task quickstart:dev            # One-command developer onboarding
task docker:start              # Start containers
task frontend:dev              # Vite dev server (port 5173)
task docs:dev                  # Docusaurus dev server (port 3001)

# Testing
task test:tier1:docker         # Snapshot tests (2-3s, $0)
task test:tier2:docker         # LocalStack integration (30-60s, $0)
task test:tier3                # Real AWS (5-10min, $5-10)
task docs:test                 # Playwright E2E (11+ tests)

# Quality Gates
task security:scan             # Trivy + Checkov
task cost:estimate             # Infracost breakdown
task legal:audit               # Apache 2.0 compliance
task dod:tier1-2               # Definition of Done

# Production
task deploy:production-checklist  # All pre-deployment gates
task manager:review:full          # HITL sign-off

# MCP
task mcp:local                 # Switch to LocalStack ($0)
task mcp:aws                   # Switch to real AWS
task mcp:status                # Health check
task mcp:cross-validate        # MCP vs CLI accuracy

# Full list
task --list                    # Show all available tasks
```

---

## Evidence

All operations produce evidence to `tmp/aws-sandbox/` (gitignored):

```
tmp/aws-sandbox/
├── test-results/          # Tier 1/2/3 test logs
├── synth-reports/         # CloudFormation synthesis logs
├── security-reports/      # Trivy, Checkov, CDK Nag output
├── cost-reports/          # Infracost estimates
├── coordination-logs/     # Agent scoring + coordination
├── evidence/              # Completion evidence
├── screenshots/           # Playwright evidence captures
├── build-logs/            # TypeScript compilation
├── health/                # Docker health checks
└── diagrams/              # Generated architecture PNGs
```

---

## Legal

- **License**: Apache 2.0 (LICENSE + NOTICE at repo root)
- **Attribution**: Based on Innovation Sandbox on AWS v1.1.8 by Amazon.com, Inc.
- **npm Package**: `sandbox-for-aws` (AWS Trademark Section 13 compliant)
- **Stack IDs**: `Sandbox-*` (renamed from upstream `InnovationSandbox-*`)

```bash
task legal:audit           # Verify compliance
```
