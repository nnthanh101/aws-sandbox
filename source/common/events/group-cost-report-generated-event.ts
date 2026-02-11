// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import { EventDetailTypes } from "sandbox-commons/events/index.js";
import { IsbEvent } from "sandbox-commons/sdk-clients/event-bridge-client.js";
import { z } from "zod";

export const GroupCostReportGeneratedEventSchema = z.object({
  reportMonth: z.string(), // e.g., "2024-01"
  fileName: z.string(),
  bucketName: z.string(),
  timestamp: z.string(),
});

export class GroupCostReportGeneratedEvent implements IsbEvent {
  readonly DetailType = EventDetailTypes.GroupCostReportGenerated;
  readonly Detail: z.infer<typeof GroupCostReportGeneratedEventSchema>;

  constructor(eventData: z.infer<typeof GroupCostReportGeneratedEventSchema>) {
    this.Detail = eventData;
  }

  public static parse(eventDetail: unknown) {
    return new GroupCostReportGeneratedEvent(
      GroupCostReportGeneratedEventSchema.parse(eventDetail),
    );
  }
}
