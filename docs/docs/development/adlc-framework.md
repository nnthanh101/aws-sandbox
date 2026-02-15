---
id: adlc-framework
title: ADLC Framework
sidebar_label: ADLC Framework
sidebar_position: 4
---

# ADLC Framework v3.2.0

The Agent Development Lifecycle (ADLC) is an enterprise coordination framework for AI-assisted software development. It manages a team of 9 specialized agents orchestrated by a single HITL (Human-In-The-Loop) manager.

## Agent Coordination Flow

```mermaid
graph TD
    HITL[HITL Manager<br/>1 T-Shape Human]

    subgraph "Coordination Layer"
        PO[product-owner<br/>Business validation]
        CA[cloud-architect<br/>Technical design]
    end

    subgraph "Specialist Agents"
        FE[frontend-docs-engineer<br/>Docusaurus + React]
        INFRA[infrastructure-engineer<br/>CDK + Terraform]
        K8S[kubernetes-engineer<br/>K3D + K3S]
        QA[qa-engineer<br/>3-tier testing]
        SEC[security-compliance<br/>Trivy + Checkov]
        OBS[observability-engineer<br/>MELT telemetry]
        META[meta-engineering<br/>Framework + MCP]
    end

    HITL -->|delegates| PO
    PO -->|approves| CA
    CA -->|dispatches| FE & INFRA & K8S & QA & SEC & OBS & META

    FE & INFRA & K8S & QA & SEC & OBS & META -->|evidence| HITL

    style PO fill:#f9f,stroke:#333,stroke-width:2px
    style CA fill:#bbf,stroke:#333,stroke-width:2px
```

## PDCA Autonomous Cycle

Every agent task follows the Plan-Do-Check-Act cycle with configurable limits:

```mermaid
graph LR
    P[Plan<br/>Analyze requirements<br/>Design approach] --> D[Do<br/>Execute implementation<br/>Create artifacts]
    D --> C[Check<br/>Validate output<br/>Run tests]
    C --> A{Act<br/>Quality >=99.5%?}
    A -->|Yes| DONE[Complete<br/>Evidence logged]
    A -->|No, cycle < max| P
    A -->|No, cycle >= max| HITL[Escalate to<br/>HITL Manager]

    style DONE fill:#9f9,stroke:#333
    style HITL fill:#ff9,stroke:#333
```

### PDCA Cycle Limits

| Context | Max Cycles | Escalation |
|---------|-----------|------------|
| Tier 1+2 Testing | 3 | HITL review |
| Full Test Suite | 7 | HITL review |
| Framework Changes | 5 | HITL approval |
| Diagram Generation | 3 | HITL review |

## Framework Components

| Component | Count | Location |
|-----------|-------|----------|
| Agents | 9 | `.claude/agents/` |
| Commands | 77 | `.claude/commands/` |
| Skills | 125 | `.claude/skills/` |
| Templates | 6 | `.claude/templates/` |
| Rules | 4 | `.claude/rules/` |

### Agent Roster

| Agent | Role | Primary Skills |
|-------|------|---------------|
| **product-owner** | Business validation, requirements | INVEST scoring, 5W1H analysis |
| **cloud-architect** | Technical design, deployment | AWS Well-Architected, ADRs |
| **frontend-docs-engineer** | UI + documentation | Docusaurus, React, Cloudscape |
| **infrastructure-engineer** | IaC implementation | CDK TypeScript, Terraform HCL |
| **kubernetes-engineer** | Container orchestration | K3D (Docker), K3S (SSH) |
| **qa-engineer** | Quality assurance | 3-tier testing, cross-validation |
| **security-compliance** | Security + governance | Trivy, Checkov, CDK Nag |
| **observability-engineer** | Monitoring + telemetry | MELT, SLOs, error budgets |
| **meta-engineering** | Framework extension | MCP servers, agent design |

### Command Categories

| Category | Count | Examples |
|----------|-------|---------|
| `cdk:*` | 12 | `cdk:synth`, `cdk:deploy`, `cdk:test` |
| `terraform:*` | 12 | `terraform:deploy`, `terraform:test` |
| `finops:*` | 10 | `finops:aws-monthly`, `finops:analyze` |
| `docs:*` | 3 | `docs:validate`, `docs:cross-validate` |
| `security:*` | 2 | `security:sast`, `security:prompt-injection` |
| `k3d:*` / `k3s:*` | 12 | `k3d:deploy`, `k3s:test` |
| `speckit.*` | 10 | `speckit.specify`, `speckit.implement` |
| Other | 16 | `mcp:validate`, `platform:bootstrap` |

## Enterprise Coordination Protocol

The coordination protocol is **BLOCKING** — no specialist can execute without prior approval:

```mermaid
sequenceDiagram
    participant HITL as HITL Manager
    participant PO as product-owner
    participant CA as cloud-architect
    participant SPEC as Specialist Agent

    HITL->>PO: Task request
    PO->>PO: Business validation<br/>INVEST scoring
    PO->>CA: Approved requirements
    CA->>CA: Technical design<br/>ADR + deployment strategy
    CA->>SPEC: Dispatch with constraints
    SPEC->>SPEC: PDCA execution<br/>(max N cycles)
    SPEC->>CA: Evidence + artifacts
    CA->>PO: Completion report
    PO->>HITL: Summary for review
```

### Anti-Patterns (BLOCKED)

| Anti-Pattern | Description | Detection |
|-------------|-------------|-----------|
| `STANDALONE_EXECUTION` | Specialist executes without coordination | No `product-owner-*.json` in evidence |
| `NATO_VIOLATION` | Claims completion without evidence | No files in `tmp/` |
| `SKIP_EVIDENCE` | Completes without artifacts | Missing evidence path |

## Evidence Structure

All agent work produces evidence in standardized paths:

```
tmp/aws-sandbox/
├── coordination-logs/          # Agent coordination
│   ├── product-owner-YYYY-MM-DD.json
│   └── cloud-architect-YYYY-MM-DD.json
├── test-results/               # Test execution
│   ├── tier1/
│   ├── tier2/
│   └── tier3/
├── evidence/                   # Final evidence
│   └── feature-name-YYYY-MM-DD.md
└── research/                   # Research outputs
    └── RQ*-answer-YYYY-MM-DD.md
```

## MCP Integration

The framework leverages 8 MCP servers for real-time AWS API access:

| MCP Server | Purpose |
|------------|---------|
| `awslabs.cdk-toolkit` | CDK Nag checks, best practices |
| `awslabs.cloudformation` | Template validation |
| `awslabs.iam` | Policy analysis, SCP validation |
| `awslabs.cost-explorer` | FOCUS 1.3 cost tracking |
| `awslabs.lambda-tool` | Function debugging |
| `awslabs.cloudwatch` | Metrics, logs, alarms |
| `awslabs.terraform-mcp` | Registry integration |
| `playwright-automation` | E2E testing + screenshots |
