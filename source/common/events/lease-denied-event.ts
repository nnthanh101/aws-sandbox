// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0
import z from "zod";

import { EventDetailTypes } from "sandbox-commons/events/index.js";
import { IsbEvent } from "sandbox-commons/sdk-clients/event-bridge-client.js";

export const LeaseDeniedEventSchema = z.object({
  leaseId: z.string(),
  deniedBy: z.string().email(),
  userEmail: z.string().email(),
});

export class LeaseDeniedEvent implements IsbEvent {
  readonly DetailType = EventDetailTypes.LeaseDenied;
  readonly Detail: z.infer<typeof LeaseDeniedEventSchema>;

  constructor(eventData: z.infer<typeof LeaseDeniedEventSchema>) {
    this.Detail = eventData;
  }

  public static parse(eventDetail: unknown) {
    return new LeaseDeniedEvent(LeaseDeniedEventSchema.parse(eventDetail));
  }
}
