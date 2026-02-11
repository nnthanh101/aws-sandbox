// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0
import { z } from "zod";

import { AwsAccountIdSchema } from "sandbox-commons/data/common-schemas.js";
import { IsbOuSchema } from "sandbox-commons/data/sandbox-account/sandbox-account.js";
import { EventDetailTypes } from "sandbox-commons/events/index.js";
import { IsbEvent } from "sandbox-commons/sdk-clients/event-bridge-client.js";

export const AccountDriftEventSchema = z.object({
  accountId: AwsAccountIdSchema,
  actualOu: IsbOuSchema.optional(),
  expectedOu: IsbOuSchema.optional(),
});

export class AccountDriftDetectedAlert implements IsbEvent {
  readonly DetailType = EventDetailTypes.AccountDriftDetected;
  readonly Detail: z.infer<typeof AccountDriftEventSchema>;

  constructor(eventData: z.infer<typeof AccountDriftEventSchema>) {
    this.Detail = eventData;
  }

  public static parse(eventDetail: unknown) {
    return new AccountDriftDetectedAlert(
      AccountDriftEventSchema.parse(eventDetail),
    );
  }
}
