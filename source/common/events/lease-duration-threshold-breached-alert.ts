// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0
import { z } from "zod";

import { AwsAccountIdSchema } from "sandbox-commons/data/common-schemas.js";
import { ThresholdActionSchema } from "sandbox-commons/data/lease-template/lease-template.js";
import { LeaseKeySchema } from "sandbox-commons/data/lease/lease.js";
import { EventDetailTypes } from "sandbox-commons/events/index.js";
import { IsbEvent } from "sandbox-commons/sdk-clients/event-bridge-client.js";

export const LeaseExpirationAlertEventSchema = z.object({
  leaseId: LeaseKeySchema,
  accountId: AwsAccountIdSchema,
  triggeredDurationThreshold: z.number().gt(0),
  leaseDurationInHours: z.number().gt(0),
  actionRequested: ThresholdActionSchema,
});

export class LeaseDurationThresholdBreachedAlert implements IsbEvent {
  readonly DetailType = EventDetailTypes.LeaseDurationThresholdBreachedAlert;
  readonly Detail: z.infer<typeof LeaseExpirationAlertEventSchema>;

  constructor(eventData: z.infer<typeof LeaseExpirationAlertEventSchema>) {
    this.Detail = eventData;
  }

  public static parse(eventDetail: unknown) {
    return new LeaseDurationThresholdBreachedAlert(
      LeaseExpirationAlertEventSchema.parse(eventDetail),
    );
  }
}
