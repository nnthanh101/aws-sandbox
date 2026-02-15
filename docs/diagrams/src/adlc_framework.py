"""D16: ADLC Framework Component Map — 9 agents, 79 commands, 128 skills topology."""

import os

from diagrams import Cluster, Diagram, Edge
from diagrams.generic.compute import Rack
from diagrams.onprem.client import User
from diagrams.programming.language import Python

OUTPUT_DIR = os.environ.get("DIAGRAMS_OUTPUT_DIR", "../static/diagrams")

with Diagram(
    "ADLC Framework v3.2.0 — Component Architecture",
    filename=f"{OUTPUT_DIR}/adlc_framework",
    show=False,
    direction="TB",
    graph_attr={"fontsize": "14", "pad": "0.5"},
):
    hitl = User("HITL Manager\n(1 T-Shape)")

    with Cluster("Coordination Layer"):
        po = Python("product-owner\n(business validation)")
        ca = Python("cloud-architect\n(technical design)")

    with Cluster("Specialist Agents (7)"):
        fe = Rack("frontend-docs-engineer\nDocusaurus + React")
        infra = Rack("infrastructure-engineer\nCDK + Terraform")
        k8s = Rack("kubernetes-engineer\nK3D + K3S")
        qa = Rack("qa-engineer\n3-tier testing")
        sec = Rack("security-compliance\nTrivy + Checkov")
        obs = Rack("observability-engineer\nMELT telemetry")
        meta = Rack("meta-engineering\nFramework + MCP")

    with Cluster("Framework Components"):
        with Cluster("79 Commands"):
            cmds = Rack("cdk:* terraform:* finops:*\ndocs:* security:* k3d:*\n79 commands")
        with Cluster("128 Skills"):
            skills = Rack("development/* learning/*\noperations/* governance/*\n128 skills")
        with Cluster("Constitution"):
            constitution = Rack("7 Principles\n58 Checkpoints\n35 Quality Gates")

    hitl >> Edge(label="delegates") >> po
    po >> Edge(label="approves") >> ca
    ca >> Edge(label="dispatches") >> [fe, infra, k8s, qa, sec, obs, meta]
    fe >> Edge(style="dashed") >> cmds
    qa >> Edge(style="dashed") >> skills
    po >> Edge(label="enforces") >> constitution
