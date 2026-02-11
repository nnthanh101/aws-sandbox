// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0
import { z } from "zod";

import { ApprovedBySchema } from "sandbox-commons/data/lease/lease.js";
import { EventDetailTypes } from "sandbox-commons/events/index.js";
import { IsbEvent } from "sandbox-commons/sdk-clients/event-bridge-client.js";

export const LeaseApprovedEventSchema = z.object({
  leaseId: z.string(),
  approvedBy: ApprovedBySchema,
  userEmail: z.string().email(),
});

export class LeaseApprovedEvent implements IsbEvent {
  readonly DetailType = EventDetailTypes.LeaseApproved;
  readonly Detail: z.infer<typeof LeaseApprovedEventSchema>;

  constructor(eventData: z.infer<typeof LeaseApprovedEventSchema>) {
    this.Detail = eventData;
  }

  public static parse(eventDetail: unknown) {
    return new LeaseApprovedEvent(LeaseApprovedEventSchema.parse(eventDetail));
  }
}
