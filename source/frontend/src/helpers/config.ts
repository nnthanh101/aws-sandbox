// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

type ConfigData = {
  ApiUrl: string;
};

export const config: ConfigData = {
  ApiUrl: import.meta.env.VITE_API_URL ?? `${window.location.origin}/api`,
};
