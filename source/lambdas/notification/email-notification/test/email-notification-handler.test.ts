// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import {
  GlobalConfig,
  GlobalConfigSchema,
} from "sandbox-commons/data/global-config/global-config.js";
import { AccountCleanupFailureEventSchema } from "sandbox-commons/events/account-cleanup-failure-event.js";
import { AccountDriftEventSchema } from "sandbox-commons/events/account-drift-detected-alert.js";
import { GroupCostReportGeneratedEventSchema } from "sandbox-commons/events/group-cost-report-generated-event.js";
import { GroupCostReportGenerationFailureEventSchema } from "sandbox-commons/events/group-cost-report-generated-failure-event.js";
import { EventDetailTypes } from "sandbox-commons/events/index.js";
import { LeaseApprovedEventSchema } from "sandbox-commons/events/lease-approved-event.js";
import { LeaseBudgetThresholdTriggeredEventSchema } from "sandbox-commons/events/lease-budget-threshold-breached-alert.js";
import { LeaseDeniedEventSchema } from "sandbox-commons/events/lease-denied-event.js";
import { LeaseExpirationAlertEventSchema } from "sandbox-commons/events/lease-duration-threshold-breached-alert.js";
import { LeaseFrozenEventSchema } from "sandbox-commons/events/lease-frozen-event.js";
import { LeaseRequestedEventSchema } from "sandbox-commons/events/lease-requested-event.js";
import { LeaseTerminatedEventSchema } from "sandbox-commons/events/lease-terminated-event.js";
import { LeaseUnfrozenEventSchema } from "sandbox-commons/events/lease-unfrozen-event.js";
import { EmailEventName } from "sandbox-commons/isb-services/notification/email-events.js";
import { EmailService } from "sandbox-commons/isb-services/notification/email-service.js";
import {
  EmailNotificationEnvironment,
  EmailNotificationEnvironmentSchema,
} from "sandbox-commons/lambda/environments/email-notification-lambda-environment.js";
import { ValidatedEnvironment } from "sandbox-commons/lambda/middleware/environment-validator.js";
import { ContextWithConfig } from "sandbox-commons/lambda/middleware/isb-config-middleware.js";
import { generateSchemaData } from "sandbox-commons/test/generate-schema-data.js";
import {
  createEventBridgeEvent,
  mockContext,
} from "sandbox-commons/test/lambdas/fixtures.js";
import {
  bulkStubEnv,
  mockAppConfigMiddleware,
} from "sandbox-commons/test/lambdas/utils.js";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { z } from "zod";

const testEnv = generateSchemaData(EmailNotificationEnvironmentSchema);

let mockedGlobalConfig: GlobalConfig;
let mockedContext: ContextWithConfig &
  ValidatedEnvironment<EmailNotificationEnvironment>;
let handler: typeof import("sandbox-email-notification/email-notification-handler.js").handler;

const emailServiceSpy = vi
  .spyOn(EmailService.prototype, "sendNotificationEmail")
  .mockReturnValue(Promise.resolve());

beforeAll(async () => {
  bulkStubEnv(testEnv);
  mockedGlobalConfig = generateSchemaData(GlobalConfigSchema, {
    notification: { emailFrom: "test@example.com" },
  });
  mockedContext = mockContext(testEnv, mockedGlobalConfig);
  handler = (
    await import(
      "sandbox-email-notification/email-notification-handler.js"
    )
  ).handler;
});
beforeEach(() => {
  mockAppConfigMiddleware(mockedGlobalConfig);
});
afterEach(() => {
  vi.clearAllMocks();
});
afterAll(() => {
  vi.unstubAllEnvs();
});

describe("email-notification-handler", () => {
  type TestInput = { eventName: EmailEventName; schema: z.ZodSchema<any> };
  type RequiredTestCases = {
    [K in EmailEventName]: {
      eventName: K;
      schema: z.ZodSchema<any>;
    };
  };

  const testCases: RequiredTestCases = {
    [EventDetailTypes.LeaseRequested]: {
      eventName: EventDetailTypes.LeaseRequested,
      schema: LeaseRequestedEventSchema,
    },
    [EventDetailTypes.LeaseApproved]: {
      eventName: EventDetailTypes.LeaseApproved,
      schema: LeaseApprovedEventSchema,
    },
    [EventDetailTypes.LeaseDenied]: {
      eventName: EventDetailTypes.LeaseDenied,
      schema: LeaseDeniedEventSchema,
    },
    [EventDetailTypes.LeaseTerminated]: {
      eventName: EventDetailTypes.LeaseTerminated,
      schema: LeaseTerminatedEventSchema,
    },
    [EventDetailTypes.LeaseFrozen]: {
      eventName: EventDetailTypes.LeaseFrozen,
      schema: LeaseFrozenEventSchema,
    },
    [EventDetailTypes.LeaseUnfrozen]: {
      eventName: EventDetailTypes.LeaseUnfrozen,
      schema: LeaseUnfrozenEventSchema,
    },
    [EventDetailTypes.AccountCleanupFailure]: {
      eventName: EventDetailTypes.AccountCleanupFailure,
      schema: AccountCleanupFailureEventSchema,
    },
    [EventDetailTypes.AccountDriftDetected]: {
      eventName: EventDetailTypes.AccountDriftDetected,
      schema: AccountDriftEventSchema,
    },
    [EventDetailTypes.LeaseBudgetThresholdBreachedAlert]: {
      eventName: EventDetailTypes.LeaseBudgetThresholdBreachedAlert,
      schema: LeaseBudgetThresholdTriggeredEventSchema,
    },
    [EventDetailTypes.LeaseDurationThresholdBreachedAlert]: {
      eventName: EventDetailTypes.LeaseDurationThresholdBreachedAlert,
      schema: LeaseExpirationAlertEventSchema,
    },
    [EventDetailTypes.GroupCostReportGenerated]: {
      eventName: EventDetailTypes.GroupCostReportGenerated,
      schema: GroupCostReportGeneratedEventSchema,
    },
    [EventDetailTypes.GroupCostReportGeneratedFailure]: {
      eventName: EventDetailTypes.GroupCostReportGeneratedFailure,
      schema: GroupCostReportGenerationFailureEventSchema,
    },
  };

  const testInputs = Object.values(testCases);
  it.each(testInputs)(
    "should send email for all subscribed events, $eventName",
    async ({ eventName, schema }: TestInput) => {
      const isbEvent = generateSchemaData(schema);
      const emailEvent = createEventBridgeEvent(eventName, isbEvent);
      await handler(emailEvent, mockedContext);
      expect(emailServiceSpy).toHaveBeenCalled();
    },
  );

  it("should throw error for unsubscribed event when email is configured", async () => {
    const emailEvent = createEventBridgeEvent("InvalidEvent", {});
    await expect(handler(emailEvent, mockedContext)).rejects.toThrow(Error);
    expect(emailServiceSpy).not.toHaveBeenCalled();
  });

  it("should exit early for unsubscribed event when email is not configured", async () => {
    const configWithoutEmail = {
      ...mockedGlobalConfig,
      notification: { emailFrom: undefined },
    };
    const contextWithoutEmail = mockContext(testEnv, configWithoutEmail);
    mockAppConfigMiddleware(configWithoutEmail);

    const emailEvent = createEventBridgeEvent("InvalidEvent", {});

    // Should not throw, just exit early
    await handler(emailEvent, contextWithoutEmail);

    expect(emailServiceSpy).not.toHaveBeenCalled();
  });

  describe("when email notifications are disabled", () => {
    it("should exit early when emailFrom is undefined", async () => {
      const configWithoutEmail = {
        ...mockedGlobalConfig,
        notification: { emailFrom: undefined },
      };
      const contextWithoutEmail = mockContext(testEnv, configWithoutEmail);
      mockAppConfigMiddleware(configWithoutEmail);

      const isbEvent = generateSchemaData(LeaseApprovedEventSchema);
      const emailEvent = createEventBridgeEvent(
        EventDetailTypes.LeaseApproved,
        isbEvent,
      );

      await handler(emailEvent, contextWithoutEmail);

      expect(emailServiceSpy).not.toHaveBeenCalled();
    });

    it("should exit early when emailFrom is empty string", async () => {
      const configWithEmptyEmail = {
        ...mockedGlobalConfig,
        notification: { emailFrom: "" },
      };
      const contextWithEmptyEmail = mockContext(testEnv, configWithEmptyEmail);
      mockAppConfigMiddleware(configWithEmptyEmail);

      const isbEvent = generateSchemaData(LeaseApprovedEventSchema);
      const emailEvent = createEventBridgeEvent(
        EventDetailTypes.LeaseApproved,
        isbEvent,
      );

      await handler(emailEvent, contextWithEmptyEmail);

      expect(emailServiceSpy).not.toHaveBeenCalled();
    });

    it("should send email when emailFrom is properly configured", async () => {
      // This test ensures the normal flow still works
      const isbEvent = generateSchemaData(LeaseApprovedEventSchema);
      const emailEvent = createEventBridgeEvent(
        EventDetailTypes.LeaseApproved,
        isbEvent,
      );

      await handler(emailEvent, mockedContext);

      expect(emailServiceSpy).toHaveBeenCalled();
    });
  });
});
