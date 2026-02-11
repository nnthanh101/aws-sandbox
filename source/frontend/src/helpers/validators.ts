// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

export const validateNumber = (val: any) => {
  if (isNaN(val) || val.toString() === "") {
    return "Please enter a valid number.";
  }
  if (val === 0) {
    return "Please enter a number larger than 0";
  }
};
