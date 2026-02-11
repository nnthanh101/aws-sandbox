// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useQuery } from "@tanstack/react-query";

import { SettingService } from "./service";

export const useGetConfigurations = () => {
  return useQuery({
    queryKey: ["configurations"],
    queryFn: async () => await new SettingService().getConfigurations(),
  });
};
