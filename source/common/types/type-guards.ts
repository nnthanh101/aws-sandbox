// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

//useful for exhaustiveness checking
export function assertNever(_value: never): never {
  throw new Error(`Received unexpected value.`);
}
