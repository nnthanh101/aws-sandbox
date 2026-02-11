// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0
import z from "zod";

import { FreeTextSchema } from "sandbox-commons/data/common-schemas.js";
import { LeaseKeySchema } from "sandbox-commons/data/lease/lease.js";
import { EventDetailTypes } from "sandbox-commons/events/index.js";
import { IsbEvent } from "sandbox-commons/sdk-clients/event-bridge-client.js";

export const LeaseRequestedEventSchema = z.object({
  leaseId: LeaseKeySchema,
  comments: FreeTextSchema.optional(),
  userEmail: z.string().email(),
  requiresManualApproval: z.boolean(),
});

export class LeaseRequestedEvent extends IsbEvent {
  override readonly DetailType = EventDetailTypes.LeaseRequested;
  override readonly Detail: z.infer<typeof LeaseRequestedEventSchema>;

  constructor(eventData: z.infer<typeof LeaseRequestedEventSchema>) {
    super();
    this.Detail = eventData;
  }

  public static parse(eventDetail: unknown) {
    return new LeaseRequestedEvent(
      LeaseRequestedEventSchema.parse(eventDetail),
    );
  }
}
