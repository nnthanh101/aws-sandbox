// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0
import z from "zod";

import { AwsAccountIdSchema } from "sandbox-commons/data/common-schemas.js";
import { LeaseKeySchema } from "sandbox-commons/data/lease/lease.js";
import { EventDetailTypes } from "sandbox-commons/events/index.js";
import { IsbEvent } from "sandbox-commons/sdk-clients/event-bridge-client.js";

export const LeaseUnfrozenEventSchema = z.object({
  leaseId: LeaseKeySchema,
  accountId: AwsAccountIdSchema,
  maxBudget: z.number().optional(),
  leaseDurationInHours: z.number().optional(),
  reason: z.string(),
});

export class LeaseUnfrozenEvent implements IsbEvent {
  readonly DetailType = EventDetailTypes.LeaseUnfrozen;
  readonly Detail: z.infer<typeof LeaseUnfrozenEventSchema>;

  constructor(eventData: z.infer<typeof LeaseUnfrozenEventSchema>) {
    this.Detail = eventData;
  }

  public static parse(eventDetail: unknown) {
    return new LeaseUnfrozenEvent(LeaseUnfrozenEventSchema.parse(eventDetail));
  }
}
