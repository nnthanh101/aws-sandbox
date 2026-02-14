---
id: troubleshooting
title: Troubleshooting
sidebar_label: Troubleshooting
sidebar_position: 3
---

# Troubleshooting

Common issues and solutions for Sandbox for AWS.

## Deployment Issues

### CDK Bootstrap Failed

**Symptom**: `CDKToolkit stack does not exist`

**Solution**:
```bash
npx cdk bootstrap aws://ACCOUNT_ID/ap-southeast-2 \
  --profile your-hub-profile
```

### Stack Deployment Timeout

**Symptom**: Stack creation stuck in `CREATE_IN_PROGRESS`

**Solution**:
1. Check CloudFormation events for the specific resource causing the delay
2. Common culprits: Lambda function bundling, custom resources
3. Ensure Docker is running (required for Lambda bundling)

### Identity Center Not Found

**Symptom**: `Identity Center instance not found in region`

**Solution**: IAM Identity Center must be enabled in the management account before deploying the IDC stack. Verify:
```bash
aws sso-admin list-instances --region ap-southeast-2
```

## Runtime Issues

### Account Cleanup Stuck

**Symptom**: Account stays in `CLEANING` state for over 2 hours

**Solution**:
1. Check the Step Functions execution in the AWS Console
2. Look for failed states in the execution history
3. Common cause: Resources with deletion protection enabled
4. Manual intervention: Delete protected resources, then retry

### User Cannot Access Sandbox

**Symptom**: User gets 403 after SSO login

**Solution**:
1. Verify the user is assigned to the SAML application in Identity Center
2. Check the permission set is attached to the sandbox account
3. Verify the lease is in `ACTIVE` state in DynamoDB

### API Returns 500

**Symptom**: Web portal shows server error

**Solution**:
1. Check Lambda function logs:
```bash
aws logs tail /aws/lambda/Sandbox-Compute --since 1h --region ap-southeast-2
```
2. Common causes: DynamoDB throttling, missing environment variables, IAM permission issues

## Local Development Issues

### Docker Container Won't Start

**Symptom**: `sandbox-dev` container exits immediately

**Solution**:
```bash
task docker:status
docker logs sandbox-dev
```

### LocalStack Health Check Fails

**Symptom**: `curl localhost:4566/_localstack/health` returns error

**Solution**:
```bash
task localstack:stop
task localstack:start
task localstack:status
```

### Tier 1 Tests Fail After Changes

**Symptom**: Snapshot tests fail after code changes

**Solution**: If the changes are intentional, update the snapshots:
```bash
docker exec sandbox-dev npm test -- --update
```
