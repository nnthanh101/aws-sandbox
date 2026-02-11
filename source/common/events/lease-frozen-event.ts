// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0
import z from "zod";

import {
  AwsAccountIdSchema,
  FreeTextSchema,
} from "sandbox-commons/data/common-schemas.js";
import { LeaseKeySchema } from "sandbox-commons/data/lease/lease.js";
import { EventDetailTypes } from "sandbox-commons/events/index.js";
import { IsbEvent } from "sandbox-commons/sdk-clients/event-bridge-client.js";

export const LeaseFrozenReasonTypeSchema = z.enum([
  "Expired",
  "BudgetExceeded",
  "ManuallyFrozen",
]);

export const LeaseFrozenByDurationSchema = z.object({
  type: z.literal(LeaseFrozenReasonTypeSchema.enum.Expired),
  triggeredDurationThreshold: z.number().gt(0),
  leaseDurationInHours: z.number().gt(0),
});

export const LeaseFrozenByBudgetSchema = z.object({
  type: z.literal(LeaseFrozenReasonTypeSchema.enum.BudgetExceeded),
  triggeredBudgetThreshold: z.number().gt(0),
  budget: z.number().optional(),
  totalSpend: z.number(),
});

export const LeaseFrozenManualSchema = z.object({
  type: z.literal(LeaseFrozenReasonTypeSchema.enum.ManuallyFrozen),
  comment: FreeTextSchema,
});

export const LeaseFrozenReasonSchema = z.discriminatedUnion("type", [
  LeaseFrozenByDurationSchema,
  LeaseFrozenByBudgetSchema,
  LeaseFrozenManualSchema,
]);

export type LeaseFrozenReason = z.infer<typeof LeaseFrozenReasonSchema>;

export const LeaseFrozenEventSchema = z.object({
  leaseId: LeaseKeySchema,
  accountId: AwsAccountIdSchema,
  reason: LeaseFrozenReasonSchema,
});

export class LeaseFrozenEvent<
  T extends z.infer<typeof LeaseFrozenReasonTypeSchema> = z.infer<
    typeof LeaseFrozenReasonTypeSchema
  >,
> implements IsbEvent
{
  readonly DetailType = EventDetailTypes.LeaseFrozen;
  readonly Detail: z.infer<typeof LeaseFrozenEventSchema> & {
    reason: { type: T };
  };

  constructor(
    eventData: z.infer<typeof LeaseFrozenEventSchema> & { reason: { type: T } },
  ) {
    this.Detail = eventData;
  }

  public isType<R extends T>(t: R): this is LeaseFrozenEvent<R> {
    return this.Detail.reason.type === t;
  }

  public static parse(eventDetail: unknown) {
    return new LeaseFrozenEvent(LeaseFrozenEventSchema.parse(eventDetail));
  }
}
