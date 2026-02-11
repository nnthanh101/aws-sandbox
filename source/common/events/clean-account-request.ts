// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0
import z from "zod";

import { AwsAccountIdSchema } from "sandbox-commons/data/common-schemas.js";
import { EventDetailTypes } from "sandbox-commons/events/index.js";
import { IsbEvent } from "sandbox-commons/sdk-clients/event-bridge-client.js";

export const CleanAccountRequestSchema = z.object({
  accountId: AwsAccountIdSchema,
  reason: z.string(),
});

export class CleanAccountRequest implements IsbEvent {
  readonly DetailType = EventDetailTypes.CleanAccountRequest;
  readonly Detail: z.infer<typeof CleanAccountRequestSchema>;

  constructor(eventData: z.infer<typeof CleanAccountRequestSchema>) {
    this.Detail = eventData;
  }

  public static parse(eventDetail: unknown) {
    return new CleanAccountRequest(
      CleanAccountRequestSchema.parse(eventDetail),
    );
  }
}
