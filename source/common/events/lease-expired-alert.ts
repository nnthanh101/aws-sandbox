// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0
import z from "zod";

import { AwsAccountIdSchema } from "sandbox-commons/data/common-schemas.js";
import { LeaseKeySchema } from "sandbox-commons/data/lease/lease.js";
import { EventDetailTypes } from "sandbox-commons/events/index.js";
import { IsbEvent } from "sandbox-commons/sdk-clients/event-bridge-client.js";

export const LeaseExpiredEventSchema = z.object({
  leaseId: LeaseKeySchema,
  accountId: AwsAccountIdSchema,
  leaseExpirationDate: z.string().datetime(),
});

export class LeaseExpiredAlert implements IsbEvent {
  readonly DetailType = EventDetailTypes.LeaseExpiredAlert;
  readonly Detail: z.infer<typeof LeaseExpiredEventSchema>;

  constructor(eventData: z.infer<typeof LeaseExpiredEventSchema>) {
    this.Detail = eventData;
  }

  public static parse(eventDetail: unknown) {
    return new LeaseExpiredAlert(LeaseExpiredEventSchema.parse(eventDetail));
  }
}
