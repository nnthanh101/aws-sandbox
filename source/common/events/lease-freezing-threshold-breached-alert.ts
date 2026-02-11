// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0
import { EventDetailTypes } from "sandbox-commons/events/index.js";
import { LeaseFrozenEventSchema } from "sandbox-commons/events/lease-frozen-event.js";
import { IsbEvent } from "sandbox-commons/sdk-clients/event-bridge-client.js";
import z from "zod";

export const LeaseFreezingEventSchema = LeaseFrozenEventSchema;

export class LeaseFreezingThresholdBreachedAlert implements IsbEvent {
  readonly DetailType = EventDetailTypes.LeaseFreezingThresholdBreachedAlert;
  readonly Detail: z.infer<typeof LeaseFreezingEventSchema>;

  constructor(eventData: z.infer<typeof LeaseFreezingEventSchema>) {
    this.Detail = eventData;
  }

  public static parse(eventDetail: unknown) {
    return new LeaseFreezingThresholdBreachedAlert(
      LeaseFreezingEventSchema.parse(eventDetail),
    );
  }
}
