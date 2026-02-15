"""D19: Cost-Aware Architecture — Monthly cost annotations on AWS resources ($36-149/mo reference)."""

import os

from diagrams import Cluster, Diagram, Edge
from diagrams.aws.compute import Lambda
from diagrams.aws.database import Dynamodb
from diagrams.aws.integration import StepFunctions
from diagrams.aws.management import Organizations
from diagrams.aws.network import APIGateway, CloudFront
from diagrams.aws.security import SingleSignOn, KMS
from diagrams.aws.storage import S3
from diagrams.onprem.container import Docker

OUTPUT_DIR = os.environ.get("DIAGRAMS_OUTPUT_DIR", "../../static/diagrams")

with Diagram(
    "Cost-Aware Architecture — Sandbox for AWS",
    filename=f"{OUTPUT_DIR}/cost_architecture",
    show=False,
    direction="TB",
    graph_attr={"fontsize": "14", "pad": "0.5"},
):
    with Cluster("Local Development ($0/mo)"):
        dev = Docker("sandbox-dev\nNode 22 + CDK v2")
        localstack = Docker("LocalStack\nTier 2 Free")

    with Cluster("Hub Account ($36-149/mo)"):
        with Cluster("Edge Layer (~$5-15/mo)"):
            cf = CloudFront("CloudFront\n~$5-10/mo")
            apigw = APIGateway("API Gateway\n~$3-5/mo")

        with Cluster("Compute Layer (~$10-50/mo)"):
            lambdas = Lambda("21 Lambdas\n~$5-20/mo\n(128-512MB)")
            sf = StepFunctions("Step Functions\n~$5-30/mo")

        with Cluster("Data Layer (~$15-60/mo)"):
            ddb = Dynamodb("DynamoDB\n~$8-25/mo\n(on-demand)")
            s3 = S3("S3 Assets\n~$2-5/mo")
            kms = KMS("KMS\n~$5-30/mo\n(per-key)")

        with Cluster("Identity (Free Tier)"):
            idc = SingleSignOn("Identity Center\n$0")

    with Cluster("AWS Organizations"):
        org = Organizations("Management\nAccount")

    # Flow with cost annotations
    cf >> Edge(label="HTTPS") >> apigw
    apigw >> Edge(label="invoke") >> lambdas
    lambdas >> Edge(label="orchestrate") >> sf
    lambdas >> Edge(label="CRUD") >> ddb
    sf >> Edge(label="lifecycle") >> org
    ddb >> Edge(label="encrypt") >> kms
    s3 >> Edge(label="encrypt") >> kms

    # Local dev flow
    dev >> Edge(label="Tier 2\n$0", style="dashed") >> localstack
    dev >> Edge(label="CDK deploy\nTier 3", style="dashed") >> cf
