---
id: account-lifecycle
title: Account Lifecycle
sidebar_label: Account Lifecycle
sidebar_position: 4
---

# Account Lifecycle

The sandbox account lifecycle is managed by Step Functions state machines.

## Lifecycle States

```mermaid
stateDiagram-v2
    [*] --> Registered: Admin registers account
    Registered --> Available: Initial cleanup
    Available --> Leased: User request approved
    Leased --> Expiring: 24h before expiry
    Expiring --> Expired: Lease time ends
    Expired --> Cleaning: Auto-trigger
    Cleaning --> Available: Cleanup complete
    Leased --> Frozen: Budget exceeded
    Frozen --> Cleaning: Admin intervention
    Cleaning --> Quarantined: Cleanup failed
    Quarantined --> Cleaning: Admin retry
```

## Lease Workflow

```mermaid
graph TD
    REQ[Lease Request] --> VALIDATE{Validate Request}
    VALIDATE -->|Valid| CHECK{Available Account?}
    VALIDATE -->|Invalid| REJECT[Reject Request]
    CHECK -->|Yes| ASSIGN[Assign Account]
    CHECK -->|No| QUEUE[Queue Request]
    ASSIGN --> CONFIG[Configure Access]
    CONFIG --> NOTIFY[Send Notification]
    NOTIFY --> ACTIVE[Lease Active]
    ACTIVE --> MONITOR{Monitor}
    MONITOR -->|Budget OK| MONITOR
    MONITOR -->|Budget Exceeded| FREEZE[Freeze Account]
    MONITOR -->|Lease Expired| CLEANUP[Start Cleanup]
```

## Account Cleanup Process

When a lease expires, the cleanup state machine:

1. **Revoke Access** — Remove SSO permission set assignments
2. **Delete Resources** — Remove all user-created resources
3. **Verify Clean** — Confirm no resources remain
4. **Reset Account** — Restore to baseline configuration
5. **Return to Pool** — Mark as available

```mermaid
graph LR
    REVOKE[Revoke Access] --> DELETE[Delete Resources]
    DELETE --> VERIFY{Clean?}
    VERIFY -->|Yes| RESET[Reset Account]
    VERIFY -->|No| RETRY[Retry Delete]
    RETRY --> VERIFY
    RESET --> POOL[Return to Pool]
```

## Timing

| Event | Default Duration |
|-------|-----------------|
| Maximum lease | 30 days |
| Extension limit | 15 days |
| Expiry warning | 24 hours before |
| Cleanup timeout | 2 hours |
| Budget check interval | 1 hour |
