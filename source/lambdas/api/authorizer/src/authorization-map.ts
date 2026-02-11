// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0
import { IsbRole } from "sandbox-commons/types/isb-types.js";

export type HttpMethod =
  | "OPTIONS"
  | "GET"
  | "HEAD"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "TRACE"
  | "CONNECT"
  | "ALL";

interface AuthorizationMapType {
  [path: string]: {
    [method in HttpMethod]?: IsbRole[];
  };
}

export const authorizationMap: AuthorizationMapType = {
  "/leases": {
    GET: ["Manager", "Admin", "User"],
    POST: ["User", "Manager", "Admin"],
  },
  "/leases/{param}": {
    PATCH: ["Manager", "Admin"],
    GET: ["User", "Manager", "Admin"],
  },
  "/leases/{param}/review": {
    POST: ["Manager", "Admin"],
  },
  "/leases/{param}/terminate": {
    POST: ["Manager", "Admin"],
  },
  "/leases/{param}/freeze": {
    POST: ["Manager", "Admin"],
  },
  "/leases/{param}/unfreeze": {
    POST: ["Manager", "Admin"],
  },
  "/leaseTemplates": {
    GET: ["User", "Manager", "Admin"],
    POST: ["Admin", "Manager"],
  },
  "/leaseTemplates/{param}": {
    GET: ["User", "Manager", "Admin"],
    DELETE: ["Admin", "Manager"],
    PUT: ["Admin", "Manager"],
  },
  "/configurations": {
    GET: ["Manager", "Admin", "User"],
  },
  "/accounts": {
    GET: ["Admin"],
    POST: ["Admin"],
  },
  "/accounts/{param}": {
    GET: ["Admin"],
  },
  "/accounts/{param}/retryCleanup": {
    POST: ["Admin"],
  },
  "/accounts/{param}/eject": {
    POST: ["Admin"],
  },
  "/accounts/unregistered": {
    GET: ["Admin"],
  },
};
