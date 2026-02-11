// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import { EventDetailTypes } from "sandbox-commons/events/index.js";

export const SubscribedEmailEvents = [
  EventDetailTypes.LeaseRequested,
  EventDetailTypes.LeaseApproved,
  EventDetailTypes.LeaseDenied,
  EventDetailTypes.LeaseTerminated,
  EventDetailTypes.LeaseFrozen,
  EventDetailTypes.LeaseUnfrozen,
  EventDetailTypes.AccountCleanupFailure,
  EventDetailTypes.AccountDriftDetected,
  EventDetailTypes.LeaseBudgetThresholdBreachedAlert,
  EventDetailTypes.LeaseDurationThresholdBreachedAlert,
  EventDetailTypes.GroupCostReportGenerated,
  EventDetailTypes.GroupCostReportGeneratedFailure,
];

export type EmailEventName = (typeof SubscribedEmailEvents)[number];

export function isSubscribedEmailEvent(eventName: string): boolean {
  return SubscribedEmailEvents.includes(eventName as EmailEventName);
}
