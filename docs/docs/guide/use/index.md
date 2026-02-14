---
id: use-index
title: Use the Solution
sidebar_label: Use
sidebar_position: 4
slug: /guide/use
---

# Use the Solution

Sandbox for AWS supports three user personas, each with different capabilities and access levels.

## Personas

| Persona | Capabilities | Access Level |
|---------|-------------|-------------|
| [Administrator](/docs/guide/use/administrator) | Full platform management, account registration, SCP configuration | Hub account admin |
| [Manager](/docs/guide/use/manager) | Approve/deny requests, extend leases, view reports | Portal manager role |
| [End-User](/docs/guide/use/end-user) | Request sandbox, access AWS Console via SSO, view lease status | Portal user role |

## Typical Workflow

```mermaid
sequenceDiagram
    participant U as End-User
    participant P as Portal
    participant M as Manager
    participant S as System

    U->>P: Request sandbox account
    P->>M: Notification — new request
    M->>P: Approve request
    P->>S: Provision sandbox
    S->>U: Sandbox ready (email + portal)
    U->>S: Access via SSO
    Note over U,S: Lease duration (configurable)
    S->>U: Lease expiring soon
    S->>S: Lease expires — cleanup
    S->>U: Account recycled
```

## Tutorials

1. [Use as an administrator](/docs/guide/use/administrator)
2. [Use as a manager](/docs/guide/use/manager)
3. [Use as an end-user](/docs/guide/use/end-user)
