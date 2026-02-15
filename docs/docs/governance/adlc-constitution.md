---
id: adlc-constitution
title: ADLC Constitution
sidebar_label: ADLC Constitution
sidebar_position: 3
---

# ADLC Constitution v1.2.0

The Agent Development Lifecycle Constitution defines 7 non-negotiable principles with 58 checkpoints that govern all agent behavior in the Sandbox for AWS project.

## Constitutional Governance Model

```mermaid
graph TD
    subgraph "Constitution (Immutable)"
        P1[I. Acceptable Agency]
        P2[II. Interoperability]
        P3[III. Evaluation-First]
        P4[IV. Hybrid Deployment]
        P5[V. Observability]
        P6[VI. Governance]
        P7[VII. Agent Engineering]
    end

    subgraph "Enforcement"
        GATES[35 Quality Gates]
        CHECKS[58 Checkpoints]
        HOOKS[PreToolUse Hooks]
    end

    subgraph "Agents"
        PO[product-owner]
        CA[cloud-architect]
        SPEC[7 Specialists]
    end

    P1 & P2 & P3 & P4 & P5 & P6 & P7 --> GATES
    GATES --> CHECKS
    CHECKS --> HOOKS
    HOOKS -->|enforce| PO & CA & SPEC

    style P1 fill:#f99,stroke:#333
    style P3 fill:#9f9,stroke:#333
    style P6 fill:#99f,stroke:#333
```

## The 7 Principles

### Principle I: Acceptable Agency

**HITL approval required** for actions with irreversible consequences.

| Action | Approval Required | Rationale |
|--------|------------------|-----------|
| `git commit/push` | Always | Version control authority = HITL |
| AWS deployment (Tier 3) | Always | Real infrastructure cost |
| Cost > $100/month | Always | Budget governance |
| npm publish | Always | Public package release |
| File creation/edit | Automatic | Reversible, local-only |
| Test execution | Automatic | Safe, idempotent |

### Principle II: Interoperability

Standard protocols and least-privilege access.

- **MCP Protocol** for all tool integrations (8 servers configured)
- **OAuth / SAML 2.0** for identity (IAM Identity Center)
- **Least privilege** IAM roles per Lambda function
- **SPDX** license identifiers in all source files

### Principle III: Evaluation-First

Test before deploy. Measure before claiming.

```mermaid
graph LR
    CODE[Write Code] --> T1[Tier 1<br/>Snapshots<br/>2-3s, free]
    T1 -->|pass| T2[Tier 2<br/>LocalStack<br/>30-60s, free]
    T2 -->|pass| T3[Tier 3<br/>Real AWS<br/>5-10min, ~$50/mo]
    T3 -->|pass| DEPLOY[Deploy]
    T1 -->|fail| CODE
    T2 -->|fail| CODE
    T3 -->|fail| CODE
```

**Targets**:
- Code coverage: 100% for new code
- Agent behavior quality: >=95%
- MCP cross-validation accuracy: >=99.5%

### Principle IV: Hybrid Deployment

Local-first, cloud-second. Three deployment tiers.

| Tier | Environment | Cost | Use Case |
|------|------------|------|----------|
| Local | Docker + LocalStack | $0 | Daily development |
| Staging | AWS Sandbox Account | ~$50/mo | Pre-production validation |
| Production | AWS Hub Account | Variable | Live enterprise platform |

### Principle V: Observability

MELT telemetry — Metrics, Events, Logs, Traces.

- All agent actions logged to `tmp/aws-sandbox/`
- Test results captured with timestamps
- Evidence files required for completion claims
- CloudWatch metrics for production monitoring

### Principle VI: Governance

Constitutional checkpoints before deployment.

```mermaid
graph TD
    subgraph "Pre-Deployment Gates"
        G1[G1: Business<br/>Validation]
        G2[G2: Technical<br/>Design]
        G3[G3: Security<br/>Scan]
        G4[G4: Cost<br/>Estimate]
        G5[G5: Test<br/>Results]
    end

    subgraph "Deployment"
        DEPLOY[CDK Deploy /<br/>Terraform Apply]
    end

    subgraph "Post-Deployment"
        G6[G6: Health<br/>Check]
        G7[G7: Evidence<br/>Collection]
    end

    G1 --> G2 --> G3 --> G4 --> G5 --> DEPLOY
    DEPLOY --> G6 --> G7
```

### Principle VII: Agent Engineering

Orchestrator pattern — agents are small (50-100 LOC), focused, composable.

| Constraint | Value | Rationale |
|-----------|-------|-----------|
| Agent size | 50-100 LOC | Keep focused, avoid monolith agents |
| Skill reuse | Composition over inheritance | Share via skill references |
| PDCA limit | 3-7 cycles | Prevent infinite loops |
| Evidence | Required | No NATO (No Action, Talk Only) |

## Checkpoint Matrix

| # | Checkpoint | Principle | Severity |
|---|-----------|-----------|----------|
| 1 | HITL approval for git operations | I | BLOCKING |
| 2 | HITL approval for deployments | I | BLOCKING |
| 3 | HITL approval for cost > $100/mo | I | BLOCKING |
| 4 | MCP protocol for tool integration | II | HIGH |
| 5 | SPDX license headers | II | MEDIUM |
| 6 | Tier 1 tests pass | III | BLOCKING |
| 7 | Tier 2 tests pass (pre-deploy) | III | HIGH |
| 8 | Cross-validation >=99.5% | III | HIGH |
| 9 | Docker-first development | IV | HIGH |
| 10 | LocalStack for integration tests | IV | HIGH |
| 11 | Evidence in tmp/ path | V | BLOCKING |
| 12 | Coordination logs present | V | BLOCKING |
| 13 | Security scan clean | VI | HIGH |
| 14 | Cost estimate approved | VI | HIGH |
| 15 | Agent under 100 LOC | VII | MEDIUM |

:::note
The full 58-checkpoint matrix is maintained in `.specify/memory/constitution.md`. This page shows the top 15 critical checkpoints.
:::

## Compliance Validation

Run constitutional compliance checks:

```bash
# Validate all constitutional checkpoints
speckit.constitution:validate

# Lint framework files
speckit.constitution:lint

# Enforce for current session
speckit.constitution:enforce
```
