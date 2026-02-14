---
id: saml-application
title: Set Up SAML 2.0 Application
sidebar_label: SAML Application
sidebar_position: 2
---

# Set Up SAML 2.0 Application

Create a SAML 2.0 application in IAM Identity Center to enable SSO-based access to the Sandbox for AWS web portal.

:::caution
Complete these steps in the **management account** where AWS IAM Identity Center is configured. Ensure you are in your home region (`ap-southeast-2`).
:::

## Prerequisites

You need these values from the **Sandbox-IDC** stack outputs:

| Value | Description | How to Get |
|-------|-------------|-----------|
| **ACS URL** | Assertion Consumer Service URL | IDC stack output `AcsUrl` |
| **Entity ID** | SAML Entity ID | IDC stack output `EntityId` |

```bash
# Get from IDC stack outputs
aws cloudformation describe-stacks \
  --stack-name Sandbox-IDC \
  --region ap-southeast-2 \
  --query "Stacks[0].Outputs[?OutputKey=='AcsUrl' || OutputKey=='EntityId']"
```

## Step 1: Create the Application

1. Sign in to the **management account**
2. Open the [IAM Identity Center console](https://console.aws.amazon.com/singlesignon/)
3. In the navigation pane, choose **Applications**
4. Choose **Add application**
5. Select **I have an application I want to set up** → **SAML 2.0**
6. Choose **Next**

## Step 2: Configure SAML Settings

Enter the following:

| Field | Value |
|-------|-------|
| **Display name** | `Sandbox for AWS` |
| **Description** | `Self-service sandbox account management portal` |
| **Application ACS URL** | Paste the `AcsUrl` from IDC stack outputs |
| **Application SAML audience** | Paste the `EntityId` from IDC stack outputs |

## Step 3: Configure Attribute Mappings

Map the following attributes so the portal can identify users:

| Application attribute | Maps to | Format |
|----------------------|---------|--------|
| `Subject` | `${user:subject}` | `emailAddress` |
| `email` | `${user:email}` | `unspecified` |
| `name` | `${user:name}` | `unspecified` |
| `groups` | `${user:groups}` | `unspecified` |

## Step 4: Download SAML Metadata

1. After creating the application, download the **IAM Identity Center SAML metadata file**
2. Save it — you'll upload this to the hub account in a later step

:::tip
The metadata file is an XML document containing the Identity Center certificate and SSO endpoints. Keep it secure.
:::

## Step 5: Assign Users

You must assign users or groups to the application before they can access it:

1. On the application page, choose the **Assigned users** tab
2. Choose **Assign users**
3. Select the users or groups that should access the portal
4. Choose **Assign users**

:::info
User assignment is covered in detail in the [Identity Center Users](/docs/guide/configure/identity-center) section. You can assign users now or in the next step.
:::

## Verification

After setup, verify the application appears in the Identity Center portal:

1. Open the IAM Identity Center **User portal URL** (found in IAM Identity Center settings)
2. Sign in as an assigned user
3. Verify `Sandbox for AWS` appears in the application list

The application won't function fully until all configuration steps are complete, but it should be visible.
