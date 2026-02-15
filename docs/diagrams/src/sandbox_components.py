"""D2: Sandbox-for-AWS Component Diagram — 4 CDK stacks with AWS service icons."""

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
    "Sandbox for AWS — Component Architecture",
    filename=f"{OUTPUT_DIR}/sandbox_components",
    show=False,
    direction="TB",
    graph_attr={"fontsize": "14", "pad": "0.5"},
):
    with Cluster("Sandbox-Compute Stack"):
        waf = WAF("AWS WAF")
        cf = CloudFront("CloudFront\nDistribution")
        apigw = APIGateway("REST API\nGateway")
        s3web = S3("Web Assets\nBucket")

        with Cluster("Lambda Functions (21)"):
            api_lambdas = Lambda("API Handlers\n(accounts, leases)")
            lifecycle_lambdas = Lambda("Lifecycle\n(cleanup, rotate)")
            auth_lambdas = Lambda("Auth\n(SAML, token)")

        sf = StepFunctions("1 State Machine\n(AccountCleaner)")
        eb = Eventbridge("EventBridge\nScheduler")

    with Cluster("Sandbox-Data Stack"):
        ddb = Dynamodb("DynamoDB\n(accounts, leases, lease-templates)")
        s3data = S3("Data Bucket\n(artifacts, logs)")
        ses = SES("SES\n(notifications)")
        kms = KMS("KMS\n(encryption)")

    with Cluster("Sandbox-IDC Stack"):
        idc = SingleSignOn("IAM Identity\nCenter")
        ssm = SystemsManager("SSM Parameters\n(SAML config)")

    with Cluster("Sandbox-AccountPool Stack"):
        org = Organizations("AWS Organizations")
        pool = Lambda("Account Pool\nManager")

    waf >> cf >> s3web
    cf >> apigw >> api_lambdas
    api_lambdas >> sf
    api_lambdas >> ddb
    sf >> ddb
    sf >> ses
    sf >> pool >> org
    eb >> lifecycle_lambdas >> sf
    auth_lambdas >> idc
    idc >> ssm
    ddb >> kms
    s3data >> kms
