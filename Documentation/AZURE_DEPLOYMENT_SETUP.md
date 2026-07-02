# Azure Deployment Guide for Visitation Backend

## Overview

This guide explains how to properly configure and deploy the Visitation Backend to Azure Web App using GitHub Actions.

## Prerequisites

- Azure subscription
- Azure Web App created (e.g., `visitation-backend`)
- GitHub Actions workflow configured (main_visitation-backend.yml)
- Publish profile secret set in GitHub

## Critical Configuration Variables

The application requires these environment variables/application settings to run in Azure:

### 1. Database Connection String
- **Variable Name**: `DBSETTINGS__CONNECTIONSTRING`
- **Required**: YES - Deployment will fail without this
- **Value**: Your Azure SQL Server connection string
- **Example**: `Server=tcp:yourserver.database.windows.net,1433;Initial Catalog=VisitTrackingDB;Persist Security Info=False;User ID=sqladmin;Password=YourPassword;Encrypt=True;Connection Timeout=30;`

### 2. Frontend URL
- **Variable Name**: `APPSETTINGS__BASEFRONTENDURL`
- **Required**: NO - Falls back to default if missing
- **Value**: `https://visitation-app-neon.vercel.app`

### 3. JWT Secret Key
- **Variable Name**: `JWT__KEY`
- **Required**: YES - JWT authentication will fail without this
- **Value**: A secure random string (generate a strong key)
- **Security**: Use Azure Key Vault to store this securely

### 4. Twilio Credentials
- **Variable Names**: `TWILIO__ACCOUNTSID`, `TWILIO__AUTHTOKEN`
- **Required**: Only if SMS features are used
- **Value**: Your Twilio account credentials
- **Security**: Use Azure Key Vault

## Setting Up Azure Application Settings

### Option 1: Azure Portal (Recommended for Secrets)

1. Go to your Azure Web App in the Azure Portal
2. Navigate to **Settings > Configuration**
3. Click **New application setting** for each variable:
   - Name: `DBSETTINGS__CONNECTIONSTRING`
   - Value: Your SQL connection string
   - Click "OK"

4. Repeat for other variables (JWT__KEY, TWILIO__ACCOUNTSID, etc.)
5. Click **Save** at the top

### Option 2: Azure CLI

```bash
az webapp config appsettings set --resource-group <rg-name> --name visitation-backend --settings \
  DBSETTINGS__CONNECTIONSTRING="your-connection-string" \
  JWT__KEY="your-jwt-key" \
  TWILIO__ACCOUNTSID="your-twilio-sid" \
  TWILIO__AUTHTOKEN="your-twilio-token"
```

### Option 3: Using Azure Key Vault (More Secure)

1. Create an Azure Key Vault
2. Add secrets (connection string, JWT key, etc.)
3. Enable Managed Identity on your Web App
4. Grant the Web App access to the Key Vault
5. Update appsettings.Production.json to reference Key Vault

## Troubleshooting 500 Errors

### Check Application Logs

1. In Azure Portal, go to your Web App
2. Navigate to **Monitoring > Log stream**
3. Restart the app and watch for startup errors
4. Look for "InvalidOperationException" messages

### Common Issues

**Error: "Database connection string is missing"**
- **Cause**: DBSETTINGS__CONNECTIONSTRING not set in Application Settings
- **Fix**: Add the variable with your SQL connection string

**Error: "JWT key is missing"**
- **Cause**: JWT__KEY not set in Application Settings
- **Fix**: Add JWT__KEY with a secure random string

**Error: "Could not connect to database"**
- **Cause**: Connection string is invalid or SQL Server is not accessible
- **Fix**: Verify the connection string and ensure Azure Web App can access your SQL Server

### Debugging Steps

1. **Enable Application Insights** (optional but recommended)
   - Navigate to your Web App
   - Click **Application Insights** in the sidebar
   - Enable it to track errors and performance

2. **Check the publish profile is correct**
   - The GitHub Actions workflow uses `AZUREAPPSERVICE_PUBLISHPROFILE_*`
   - Ensure this secret is configured in GitHub repository settings

3. **Verify .NET version**
   - The workflow uses .NET 9.x
   - Ensure your Azure Web App supports .NET 9

## Post-Deployment Checklist

- [ ] Database connection string is configured
- [ ] JWT key is configured and secure
- [ ] Twilio credentials are configured (if using SMS)
- [ ] Frontend URL is configured correctly
- [ ] No 500 errors when accessing endpoints
- [ ] CORS is working (frontend can call backend)
- [ ] Authentication tokens are being issued
- [ ] Database queries are returning data

## Reverting a Bad Deployment

If deployment breaks the application:

1. **Using Azure Portal**:
   - Go to your Web App
   - Select **Deployment > Deployment slots** (if available)
   - Swap slots to revert to previous version

2. **Using GitHub**:
   - Revert the commit that caused the issue
   - Push to main branch
   - GitHub Actions will automatically redeploy

## Local Testing Before Deployment

Before pushing to Azure, test locally:

```bash
cd visitation-backend

# Build and publish
dotnet publish -c Release -o ./publish

# Test with environment variables set
$env:DBSETTINGS__CONNECTIONSTRING="your-connection-string"
$env:JWT__KEY="your-key"
$env:ASPNETCORE_ENVIRONMENT="Production"

# Run the published app
./publish/visitation-backend.exe
```

## Automatic Deployment Flow

When you push to the `main` branch:

1. GitHub Actions triggers the workflow (`main_visitation-backend.yml`)
2. Code is built with `dotnet build --configuration Release`
3. App is published to a temporary directory
4. Artifact is uploaded
5. Deployment job downloads artifact
6. App is deployed to Azure Web App using publish profile
7. App starts with Azure Application Settings injected as environment variables

## Environment Variable Naming Convention

.NET uses a special convention for environment variables:
- Colon `:` in configuration keys becomes `__` in environment variable names
- `Jwt:Key` → `JWT__KEY`
- `DBSettings:ConnectionString` → `DBSETTINGS__CONNECTIONSTRING`
- `Twilio:AccountSid` → `TWILIO__ACCOUNTSID`

## Next Steps

- [ ] Set up Application Insights for monitoring
- [ ] Configure Azure Key Vault for sensitive data
- [ ] Set up automated backups for the database
- [ ] Configure HTTPS/SSL certificates
- [ ] Set up continuous deployment for other environments (staging)
