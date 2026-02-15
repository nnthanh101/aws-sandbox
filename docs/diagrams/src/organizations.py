"""D9: AWS Organizations Structure — Management -> Hub -> Sandbox OU -> account pool."""

import os

from diagrams import Cluster, Diagram, Edge
from diagrams.aws.management import Organizations
from diagrams.aws.security import SingleSignOn
from diagrams.generic.compute import Rack

OUTPUT_DIR = os.environ.get("DIAGRAMS_OUTPUT_DIR", "../../static/diagrams")

with Diagram(
    "AWS Organizations — Sandbox Account Structure",
    filename=f"{OUTPUT_DIR}/organizations",
    show=False,
    direction="TB",
    graph_attr={"fontsize": "14", "pad": "0.5"},
):
    with Cluster("AWS Organizations"):
        mgmt = Organizations("Management Account\n(AWS Organizations root)")

        with Cluster("Organizational Units"):
            with Cluster("Infrastructure OU"):
                hub = Rack("Hub Account\n(Sandbox platform)")
                idc = SingleSignOn("IAM Identity\nCenter")

            with Cluster("Sandbox OU"):
                scp = Rack("SCPs Applied\n(deny dangerous services)")
                with Cluster("Account Pool"):
                    acct1 = Rack("Sandbox-001\n(available)")
                    acct2 = Rack("Sandbox-002\n(leased)")
                    acct3 = Rack("Sandbox-003\n(cleaning)")
                    acct4 = Rack("Sandbox-..N\n(pool)")

    mgmt >> Edge(label="governs") >> hub
    mgmt >> Edge(label="applies SCPs") >> scp
    hub >> Edge(label="manages") >> idc
    hub >> Edge(label="provisions/cleans") >> acct1
    scp >> Edge(style="dashed") >> [acct1, acct2, acct3, acct4]
