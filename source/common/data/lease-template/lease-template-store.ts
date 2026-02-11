// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0
import {
  OptionalItem,
  PaginatedQueryResult,
  PutResult,
  SingleItemResult,
} from "sandbox-commons/data/common-types.js";
import { LeaseTemplate } from "sandbox-commons/data/lease-template/lease-template.js";
import { Transaction } from "sandbox-commons/utils/transactions.js";

export abstract class LeaseTemplateStore {
  abstract create(leaseTemplate: LeaseTemplate): Promise<LeaseTemplate>;

  abstract update(
    leaseTemplate: LeaseTemplate,
    expected?: LeaseTemplate,
  ): Promise<PutResult<LeaseTemplate>>;

  transactionalUpdate(
    leaseTemplate: LeaseTemplate,
  ): Transaction<PutResult<LeaseTemplate>> {
    return new Transaction({
      beginTransaction: async () => {
        return this.update(leaseTemplate);
      },
      rollbackTransaction: async (putResult) => {
        await this.update(
          putResult.oldItem as LeaseTemplate,
          putResult.newItem,
        );
      },
    });
  }

  abstract delete(uuid: string): Promise<OptionalItem>;

  abstract findAll(props?: {
    pageIdentifier?: string;
    pageSize?: number;
  }): Promise<PaginatedQueryResult<LeaseTemplate>>;

  abstract get(uuid: string): Promise<SingleItemResult<LeaseTemplate>>;

  abstract findByManager(props: {
    manager: string;
    pageIdentifier?: string;
  }): Promise<PaginatedQueryResult<LeaseTemplate>>;
}
