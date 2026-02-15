"""D6: CDK Stack Dependency Graph — 4 stacks with ~85 CloudFormation resources."""

import os

from diagrams import Cluster, Diagram, Edge
from diagrams.aws.compute import Lambda
from diagrams.aws.database import Dynamodb
from diagrams.aws.engagement import SES
from diagrams.aws.integration import Eventbridge, StepFunctions
from diagrams.aws.management import Organizations, SystemsManager
from diagrams.aws.network import APIGateway, CloudFront
from diagrams.aws.security import SingleSignOn, KMS, WAF
from diagrams.aws.storage import S3

OUTPUT_DIR = os.environ.get("DIAGRAMS_OUTPUT_DIR", "../static/diagrams")

with Diagram(
    "CDK Stack Dependencies — Sandbox for AWS",
    filename=f"{OUTPUT_DIR}/cdk_stacks",
    show=False,
    direction="LR",
    graph_attr={"fontsize": "14", "pad": "0.5"},
):
    with Cluster("Sandbox-AccountPool\n(Foundation)", graph_attr={"style": "dashed"}):
        org = Organizations("Organizations")
        pool_lambda = Lambda("Pool Manager")
        pool_ssm = SystemsManager("SSM\n/sandbox/pool/*")

    with Cluster("Sandbox-IDC\n(Identity)", graph_attr={"style": "dashed"}):
        idc = SingleSignOn("Identity Center")
        idc_ssm = SystemsManager("SSM\n/sandbox/idc/*")

    with Cluster("Sandbox-Data\n(Storage)", graph_attr={"style": "dashed"}):
        ddb = Dynamodb("3 DynamoDB\nTables")
        s3 = S3("4 S3 Buckets")
        ses = SES("SES")
        kms = KMS("KMS Key")

    with Cluster("Sandbox-Compute\n(Application)", graph_attr={"style": "dashed"}):
        cf = CloudFront("CloudFront")
        waf = WAF("WAF")
        apigw = APIGateway("API Gateway")
        lambdas = Lambda("21 Lambda\nFunctions")
        sf = StepFunctions("1 State Machine\n(AccountCleaner)")
        eb = Eventbridge("EventBridge\nRules")

    # Stack dependencies (Compute depends on all others)
    lambdas >> Edge(label="reads", style="dashed") >> ddb
    sf >> Edge(label="reads", style="dashed") >> ddb
    sf >> Edge(label="sends", style="dashed") >> ses
    lambdas >> Edge(label="validates", style="dashed") >> idc
    sf >> Edge(label="manages", style="dashed") >> org
    pool_lambda >> Edge(label="exports", style="dashed") >> pool_ssm
    idc >> Edge(label="exports", style="dashed") >> idc_ssm
    ddb >> Edge(label="encrypted by") >> kms
    s3 >> Edge(label="encrypted by") >> kms
