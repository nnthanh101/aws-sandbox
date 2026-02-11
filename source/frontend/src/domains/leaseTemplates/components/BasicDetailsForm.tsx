// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import { componentTypes } from "@aws-northstar/ui";
import { useNavigate } from "react-router-dom";

import { LeaseTemplate } from "sandbox-commons/data/lease-template/lease-template";
import { Form } from "sandbox-frontend/components/Form";
import { basicFormFields } from "sandbox-frontend/domains/leaseTemplates/formFields/basic";
import { getVisibilityOption } from "sandbox-frontend/domains/leaseTemplates/helpers";
import { useUpdateLeaseTemplate } from "sandbox-frontend/domains/leaseTemplates/hooks";
import { LeaseTemplateFormData } from "sandbox-frontend/domains/leaseTemplates/types";

interface BasicDetailsFormProps {
  leaseTemplate: LeaseTemplate;
}

export const BasicDetailsForm = ({ leaseTemplate }: BasicDetailsFormProps) => {
  const navigate = useNavigate();

  const { mutateAsync: updateLeaseTemplate, isPending: isUpdating } =
    useUpdateLeaseTemplate();

  const onSubmit = async (data: any) => {
    const { visibility, ...rest } = data as LeaseTemplateFormData;
    await updateLeaseTemplate({
      ...rest,
      visibility: visibility.value, // Extract just the value from the option object
    });
    navigate("/lease_templates");
  };

  const onCancel = () => {
    navigate("/lease_templates");
  };

  const formFields = basicFormFields();

  return (
    <Form
      insideTab
      keepDirtyOnReinitialize
      isSubmitting={isUpdating}
      onCancel={onCancel}
      onSubmit={onSubmit}
      initialValues={{
        ...leaseTemplate,
        visibility: getVisibilityOption(leaseTemplate.visibility),
      }}
      schema={{
        submitLabel: "Update Basic Details",
        fields: [
          {
            component: componentTypes.SUB_FORM,
            ...formFields,
          },
        ],
      }}
    />
  );
};
