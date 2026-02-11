// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0
import z from "zod";

import { AwsAccountIdSchema } from "sandbox-commons/data/common-schemas.js";
import { EventDetailTypes } from "sandbox-commons/events/index.js";
import { IsbEvent } from "sandbox-commons/sdk-clients/event-bridge-client.js";

export const AccountCleanupFailureEventSchema = z.object({
  accountId: AwsAccountIdSchema,
  cleanupExecutionContext: z.object({
    stateMachineExecutionArn: z.string(),
    stateMachineExecutionStartTime: z.string(),
  }),
});

export class AccountCleanupFailureEvent implements IsbEvent {
  readonly DetailType = EventDetailTypes.AccountCleanupFailure;
  readonly Detail: z.infer<typeof AccountCleanupFailureEventSchema>;

  constructor(eventData: z.infer<typeof AccountCleanupFailureEventSchema>) {
    this.Detail = eventData;
  }

  public static parse(eventDetail: unknown) {
    return new AccountCleanupFailureEvent(
      AccountCleanupFailureEventSchema.parse(eventDetail),
    );
  }
}
