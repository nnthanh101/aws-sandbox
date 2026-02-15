"""D8: Security Architecture — 5-layer defense + Trivy + Checkov + CDK Nag scanning tools."""

import os

from diagrams import Cluster, Diagram, Edge
from diagrams.aws.management import Cloudtrail
from diagrams.aws.network import CloudFront
from diagrams.aws.security import SingleSignOn, KMS, WAF
from diagrams.generic.compute import Rack
from diagrams.onprem.monitoring import Grafana
from diagrams.onprem.security import Trivy
from diagrams.programming.language import Python

OUTPUT_DIR = os.environ.get("DIAGRAMS_OUTPUT_DIR", "../../static/diagrams")

with Diagram(
    "Security Architecture — 5-Layer Defense",
    filename=f"{OUTPUT_DIR}/security_architecture",
    show=False,
    direction="TB",
    graph_attr={"fontsize": "14", "pad": "0.5"},
):
    with Cluster("Layer 1: Perimeter"):
        waf = WAF("AWS WAF\nRate limiting + Geo-block")
        cf = CloudFront("CloudFront\nHTTPS only")

    with Cluster("Layer 2: Identity"):
        idc = SingleSignOn("IAM Identity Center\nSAML 2.0 SSO")
        rbac = Rack("RBAC\nAdmin / Manager / User")

    with Cluster("Layer 3: Authorization"):
        scp = Rack("Service Control\nPolicies (SCPs)")
        iam = Rack("IAM Policies\nLeast Privilege")
        pb = Rack("Permission\nBoundaries")

    with Cluster("Layer 4: Data Protection"):
        kms = KMS("KMS\nEncryption at Rest")
        tls = Rack("TLS 1.2+\nIn Transit")

    with Cluster("Layer 5: Monitoring & Audit"):
        ct = Cloudtrail("CloudTrail\nAPI Audit")
        cw = Grafana("CloudWatch\nMetrics + Alarms")

    with Cluster("Shift-Left Security Scanning"):
        trivy = Trivy("Trivy\nContainer + IaC")
        checkov = Python("Checkov\nCFN Security")
        cdk_nag = Rack("CDK Nag\nBuild-time Rules")

    waf >> cf >> idc >> rbac
    scp >> iam >> pb
    kms - tls
    ct - cw

    # Scanning feeds into layers
    trivy >> Edge(label="scans", style="dashed") >> cf
    checkov >> Edge(label="validates", style="dashed") >> scp
    cdk_nag >> Edge(label="enforces", style="dashed") >> iam
