// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0
import * as process from "node:process";

import { IsbServices } from "sandbox-commons/isb-services/index.js";
import { IsbUser } from "sandbox-commons/types/isb-types.js";
import { fromTemporaryIsbIdcCredentials } from "sandbox-commons/utils/cross-account-roles.js";

export class User {
  public static async getIsbUser(
    email: string,
  ): Promise<Omit<IsbUser, "userId"> | undefined> {
    const idcService = IsbServices.idcService(
      {
        ISB_NAMESPACE: process.env.ISB_NAMESPACE!,
        USER_AGENT_EXTRA: process.env.USER_AGENT_EXTRA!,
      },
      fromTemporaryIsbIdcCredentials({
        INTERMEDIATE_ROLE_ARN: process.env.INTERMEDIATE_ROLE_ARN!,
        IDC_ROLE_ARN: process.env.IDC_ROLE_ARN!,
        USER_AGENT_EXTRA: process.env.USER_AGENT_EXTRA!,
      }),
    );
    const isbUser = await idcService.getUserFromEmail(email);
    if (!isbUser) {
      return undefined;
    }
    return {
      displayName: isbUser.displayName,
      userName: isbUser.userName,
      email: isbUser.email,
      roles: isbUser.roles,
    };
  }
}
