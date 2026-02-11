// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0
import { z } from "zod";

import { AwsAccountIdSchema } from "sandbox-commons/data/common-schemas.js";
import { LeaseKeySchema } from "sandbox-commons/data/lease/lease.js";
import { EventDetailTypes } from "sandbox-commons/events/index.js";
import { IsbEvent } from "sandbox-commons/sdk-clients/event-bridge-client.js";

export const LeaseBudgetExceededEventSchema = z.object({
  leaseId: LeaseKeySchema,
  accountId: AwsAccountIdSchema,
  budget: z.number(),
  totalSpend: z.number(),
});

export class LeaseBudgetExceededAlert implements IsbEvent {
  readonly DetailType = EventDetailTypes.LeaseBudgetExceededAlert;
  readonly Detail: z.infer<typeof LeaseBudgetExceededEventSchema>;

  constructor(eventData: z.infer<typeof LeaseBudgetExceededEventSchema>) {
    this.Detail = eventData;
  }

  public static parse(eventDetail: unknown) {
    return new LeaseBudgetExceededAlert(
      LeaseBudgetExceededEventSchema.parse(eventDetail),
    );
  }
}
