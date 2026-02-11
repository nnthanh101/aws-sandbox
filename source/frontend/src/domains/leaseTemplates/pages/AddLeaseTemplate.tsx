// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import { componentTypes } from "@aws-northstar/ui";
import { useNavigate } from "react-router-dom";

import { ErrorPanel } from "sandbox-frontend/components/ErrorPanel";
import { Form } from "sandbox-frontend/components/Form";
import { Loader } from "sandbox-frontend/components/Loader";
import { showSuccessToast } from "sandbox-frontend/components/Toast";
import { basicFormFields } from "sandbox-frontend/domains/leaseTemplates/formFields/basic";
import { budgetFields } from "sandbox-frontend/domains/leaseTemplates/formFields/budget";
import { durationFields } from "sandbox-frontend/domains/leaseTemplates/formFields/duration";
import { getVisibilityOption } from "sandbox-frontend/domains/leaseTemplates/helpers";
import { useAddLeaseTemplate } from "sandbox-frontend/domains/leaseTemplates/hooks";
import {
  LeaseTemplateFormData,
  NewLeaseTemplate,
} from "sandbox-frontend/domains/leaseTemplates/types";
import { useGetConfigurations } from "sandbox-frontend/domains/settings/hooks";
import { useBreadcrumb } from "sandbox-frontend/hooks/useBreadcrumb";
import { useEffect } from "react";
import { costReportFields } from "../formFields/costReport";

export const AddLeaseTemplate = () => {
  const navigate = useNavigate();
  const setBreadcrumb = useBreadcrumb();

  const { mutateAsync: addLeaseTemplate, isPending: isSaving } =
    useAddLeaseTemplate();

  // get global settings
  const {
    data: config,
    isLoading: isLoadingConfig,
    isError: isConfigError,
    refetch: refetchConfig,
    error,
  } = useGetConfigurations();

  useEffect(() => {
    setBreadcrumb([
      { text: "Home", href: "/" },
      { text: "Lease Templates", href: "/lease_templates" },
      { text: "Add a New Lease Template", href: "/lease_templates/new" },
    ]);
  }, []);

  const onSubmit = async (data: any) => {
    const {
      maxBudgetEnabled,
      maxSpend,
      maxDurationEnabled,
      leaseDurationInHours,
      visibility,
      costReportGroupEnabled,
      selectedCostReportGroup,
      ...rest
    } = data as LeaseTemplateFormData;

    const leaseTemplate: NewLeaseTemplate = {
      ...rest,
      maxSpend: maxBudgetEnabled ? maxSpend : undefined,
      leaseDurationInHours: maxDurationEnabled
        ? leaseDurationInHours
        : undefined,
      visibility: visibility.value,
      costReportGroup: costReportGroupEnabled
        ? selectedCostReportGroup?.value
        : undefined,
    };

    await addLeaseTemplate(leaseTemplate);
    showSuccessToast("New lease template added successfully.");
    navigate("/lease_templates");
  };

  const onCancel = () => {
    navigate("/lease_templates");
  };

  if (isLoadingConfig) {
    return <Loader />;
  }

  if (isConfigError) {
    return (
      <ErrorPanel
        description="There was a problem loading global configuration settings."
        retry={refetchConfig}
        error={error as Error}
      />
    );
  }

  return (
    <Form
      onSubmit={onSubmit}
      onCancel={onCancel}
      isSubmitting={isSaving}
      initialValues={{
        requiresApproval: true,
        maxBudgetEnabled: true,
        maxDurationEnabled: true,
        costReportGroupEnabled: false,
        visibility: getVisibilityOption("PRIVATE"),
      }}
      schema={{
        header: "Add a New Lease Template",
        description:
          "Give your users a new way to access a temporary AWS account.",
        fields: [
          {
            component: componentTypes.WIZARD,
            name: "wizard",
            allowSkipTo: true,
            fields: [
              { ...basicFormFields() },
              {
                ...budgetFields({ globalMaxBudget: config?.leases.maxBudget }),
              },
              {
                ...durationFields({
                  globalMaxDuration: config?.leases.maxDurationHours,
                }),
              },
              {
                ...costReportFields({
                  costReportGroups: config?.costReportGroups,
                  requireCostReportGroup: config?.requireCostReportGroup,
                }),
              },
            ],
          },
        ],
      }}
    />
  );
};
