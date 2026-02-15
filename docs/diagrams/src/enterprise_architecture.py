"""D1: Enterprise High-Level Architecture — Multi-cloud: AWS (CDK) + Azure (Terraform) + local Docker."""

import os

from diagrams import Cluster, Diagram, Edge
from diagrams.aws.compute import Lambda
from diagrams.aws.database import Dynamodb
from diagrams.aws.integration import StepFunctions
from diagrams.aws.management import Organizations
from diagrams.aws.network import APIGateway, CloudFront
from diagrams.aws.security import SingleSignOn, KMS
from diagrams.aws.storage import S3
from diagrams.generic.compute import Rack
from diagrams.onprem.container import Docker
from diagrams.onprem.iac import Terraform
from diagrams.programming.framework import React

OUTPUT_DIR = os.environ.get("DIAGRAMS_OUTPUT_DIR", "../static/diagrams")

with Diagram(
    "Enterprise Architecture — Sandbox for AWS",
    filename=f"{OUTPUT_DIR}/enterprise_architecture",
    show=False,
    direction="TB",
    graph_attr={"fontsize": "14", "pad": "0.5"},
):
    with Cluster("Local Development (Docker)"):
        dev = Docker("sandbox-dev\nNode 22 + CDK v2")
        localstack = Docker("LocalStack\nAWS Emulation")
        dev >> Edge(label="Tier 2") >> localstack

    with Cluster("AWS Cloud (CDK v2)"):
        with Cluster("Hub Account"):
            cf = CloudFront("CloudFront")
            apigw = APIGateway("API Gateway")
            lambdas = Lambda("21 Lambdas")
            sf = StepFunctions("Step Functions")
            ddb = Dynamodb("DynamoDB")
            s3 = S3("S3 Assets")
            kms = KMS("KMS")
            idc = SingleSignOn("Identity Center")

        with Cluster("AWS Organizations"):
            org = Organizations("Management")
            sandbox_ou = Rack("Sandbox OU\nAccount Pool")

        cf >> apigw >> lambdas >> sf
        lambdas >> ddb
        sf >> ddb
        sf >> org >> sandbox_ou
        ddb >> kms
        s3 >> kms

    with Cluster("Azure Cloud (Terraform)"):
        tf = Terraform("Terraform\nHCL Modules")

    with Cluster("Documentation"):
        docs = React("Docusaurus\nGitHub Pages")

    dev >> Edge(label="CDK synth") >> cf
    dev >> Edge(label="plan/apply") >> tf
    dev >> Edge(label="npm run build") >> docs
