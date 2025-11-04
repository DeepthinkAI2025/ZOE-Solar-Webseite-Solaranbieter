# GitHub Secrets Configuration for Google Business Profile Integration

## Required Secrets

You need to configure the following secrets in your GitHub repository settings:

### 1. GOOGLE_OAUTH_ACCESS_TOKEN
- **Description**: OAuth access token for Google Business Profile API
- **How to get**:
  1. Go to Google Cloud Console
  2. Enable Google Business Profile API
  3. Create OAuth 2.0 credentials
  4. Generate access token with appropriate scopes
- **Required scopes**: `https://www.googleapis.com/auth/business.manage`

### 2. BUSINESS_ACCOUNT_ID
- **Description**: Google Business Account ID
- **How to get**:
  1. Go to Google Business Profile
  2. Navigate to Account settings
  3. Find your Account ID
- **Format**: Numeric string (e.g., "1234567890123456789")

## How to Add Secrets to GitHub Repository

1. Go to your GitHub repository
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. Add each secret listed above

## Security Notes

- Never commit these secrets to your repository
- Use environment-specific tokens
- Rotate tokens regularly
- Monitor token usage

## Troubleshooting

If you see "Context access might be invalid" errors:
1. Ensure all secrets are properly configured in GitHub
2. Check that secret names match exactly (case-sensitive)
3. Verify tokens are valid and not expired
4. Make sure the workflow has proper permissions

## Workflow Permissions

The workflow requires these permissions:
- `contents: write` - to commit updates
- `actions: read` - to read secrets
- `pull-requests: write` - for potential PR updates