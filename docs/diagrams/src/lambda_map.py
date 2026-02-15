"""D7: Lambda Function Map — 21 Lambda handlers by category with event sources."""

import os

from diagrams import Cluster, Diagram, Edge
from diagrams.aws.compute import Lambda
from diagrams.aws.database import Dynamodb
from diagrams.aws.integration import Eventbridge, StepFunctions
from diagrams.aws.network import APIGateway

OUTPUT_DIR = os.environ.get("DIAGRAMS_OUTPUT_DIR", "../static/diagrams")

with Diagram(
    "Lambda Function Map — Sandbox for AWS",
    filename=f"{OUTPUT_DIR}/lambda_map",
    show=False,
    direction="TB",
    graph_attr={"fontsize": "14", "pad": "0.5"},
):
    apigw = APIGateway("API Gateway")
    sf = StepFunctions("Step Functions")
    eb = Eventbridge("EventBridge")
    ddb = Dynamodb("DynamoDB")

    with Cluster("API Handlers (6)"):
        accounts = Lambda("accounts-handler")
        leases = Lambda("leases-handler")
        lease_tpl = Lambda("lease-templates-handler")
        configs = Lambda("configurations-handler")
        authorizer = Lambda("authorizer-handler")
        sso = Lambda("sso-handler")

    with Cluster("Account Lifecycle (4)"):
        lifecycle = Lambda("lifecycle-manager")
        drift = Lambda("drift-monitoring")
        lease_mon = Lambda("lease-monitoring")
        cleanup = Lambda("initialize-cleanup")

    with Cluster("Observability (5)"):
        cost_rpt = Lambda("cost-reporting")
        group_cost = Lambda("group-cost-reporting")
        log_sub = Lambda("log-subscription")
        log_archive = Lambda("log-archiving")
        deploy_summary = Lambda("deployment-summary")

    with Cluster("Custom Resources (4)"):
        deploy_uuid = Lambda("deployment-uuid")
        idc_config = Lambda("idc-configurer")
        json_parser = Lambda("json-param-parser")
        cost_tags = Lambda("cost-tag-activator")

    with Cluster("Other (2)"):
        email = Lambda("email-notification")
        secret = Lambda("secret-rotator")

    apigw >> Edge(label="REST") >> [accounts, leases, lease_tpl, configs, authorizer, sso]
    sf >> Edge(label="orchestrate") >> [cleanup, lifecycle]
    eb >> Edge(label="schedule") >> [drift, lease_mon, cost_rpt]
    accounts >> ddb
    leases >> ddb
