"""D12: MCP Server Topology — 8 MCP servers matching .mcp.json names exactly."""

import os

from diagrams import Cluster, Diagram, Edge
from diagrams.generic.compute import Rack
from diagrams.onprem.client import User
from diagrams.programming.language import Python

OUTPUT_DIR = os.environ.get("DIAGRAMS_OUTPUT_DIR", "../static/diagrams")

with Diagram(
    "MCP Server Topology — Claude Code Integration",
    filename=f"{OUTPUT_DIR}/mcp_architecture",
    show=False,
    direction="LR",
    graph_attr={"fontsize": "14", "pad": "0.5"},
):
    claude = User("Claude Code\n(Orchestrator)")

    with Cluster("AWS Labs MCP Servers (stdio)"):
        cdk_toolkit = Python("awslabs.cdk-toolkit\nCDK Nag, best practices")
        cloudformation = Python("awslabs.cloudformation\nTemplate validation")
        iam = Python("awslabs.iam\nPolicy analysis, SCP")
        cost_explorer = Python("awslabs.cost-explorer\nFOCUS 1.3 cost tracking")
        lambda_tool = Python("awslabs.lambda-tool\nFunction debugging")
        cloudwatch = Python("awslabs.cloudwatch\nMetrics, logs, alarms")
        terraform_mcp = Python("awslabs.terraform-mcp\nRegistry integration")

    with Cluster("Testing MCP Servers (stdio)"):
        playwright = Rack("playwright-automation\nE2E + screenshots")

    with Cluster("AWS Services"):
        aws_cdk = Rack("CDK v2\nCloudFormation")
        aws_iam = Rack("IAM + SCPs\nOrganizations")
        aws_cost = Rack("Cost Explorer\nBilling")
        aws_lambda = Rack("Lambda\n21 functions")
        aws_cw = Rack("CloudWatch\nLogs + Metrics")

    claude >> Edge(label="uvx") >> [cdk_toolkit, cloudformation, iam, cost_explorer, lambda_tool, cloudwatch, terraform_mcp]
    claude >> Edge(label="npx") >> playwright

    cdk_toolkit >> Edge(style="dashed") >> aws_cdk
    cloudformation >> Edge(style="dashed") >> aws_cdk
    iam >> Edge(style="dashed") >> aws_iam
    cost_explorer >> Edge(style="dashed") >> aws_cost
    lambda_tool >> Edge(style="dashed") >> aws_lambda
    cloudwatch >> Edge(style="dashed") >> aws_cw
