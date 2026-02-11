// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0
import { RemovalPolicy, Stack } from "aws-cdk-lib";
import { Key } from "aws-cdk-lib/aws-kms";
import { Construct } from "constructs";

import { isDevMode } from "sandbox-infrastructure/helpers/deployment-mode";

export class IsbKmsKeys {
  private static instances: { [key: string]: Key } = {};
  public static get(
    scope: Construct,
    namespace: string,
    keyId: string | undefined = undefined,
  ): Key {
    const isbKeyId = keyId ?? Stack.of(scope).stackName;
    if (!IsbKmsKeys.instances[isbKeyId]) {
      IsbKmsKeys.instances[isbKeyId] = new Key(
        Stack.of(scope),
        `IsbKmsKey-${isbKeyId}`,
        {
          enableKeyRotation: true,
          description: `Encryption Key for Innovation Sandbox: ${isbKeyId}`,
          alias: `AwsSolutions/Sandbox/${namespace}/${isbKeyId}`,
          removalPolicy: isDevMode(scope)
            ? RemovalPolicy.DESTROY
            : RemovalPolicy.RETAIN,
        },
      );
    }
    return IsbKmsKeys.instances[isbKeyId]!;
  }
}
