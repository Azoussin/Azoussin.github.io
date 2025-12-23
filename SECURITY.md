# VAUL AI Security Documentation

## Overview

VAUL AI implements comprehensive security measures to protect user data and ensure secure operations. This document outlines the security features implemented in the application.

## Authentication

### Supabase Auth
- **Provider**: Supabase Authentication
- **Method**: Email and password authentication
- **Session Management**: Automatic session refresh via middleware
- **Protected Routes**: All internal routes require authentication

### Middleware Protection
The application uses Next.js middleware to:
- Check authentication status on every request
- Redirect unauthenticated users to `/login`
- Redirect authenticated users away from auth pages to `/dashboard`
- Refresh user sessions automatically

## Row Level Security (RLS)

All database tables have Row Level Security enabled with strict policies:

### Notes Table
```sql
-- Users can only view their own notes
CREATE POLICY "Users can view their own notes"
  ON notes FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only create notes for themselves
CREATE POLICY "Users can create their own notes"
  ON notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own notes
CREATE POLICY "Users can update their own notes"
  ON notes FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can only delete their own notes
CREATE POLICY "Users can delete their own notes"
  ON notes FOR DELETE
  USING (auth.uid() = user_id);
```

### Files Table
```sql
-- Users can only view their own files
CREATE POLICY "Users can view their own files"
  ON files FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only create file records for themselves
CREATE POLICY "Users can create their own files"
  ON files FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own file records
CREATE POLICY "Users can update their own files"
  ON files FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can only delete their own files
CREATE POLICY "Users can delete their own files"
  ON files FOR DELETE
  USING (auth.uid() = user_id);
```

### AI History Table
```sql
-- Users can only view their own AI conversation history
CREATE POLICY "Users can view their own ai_history"
  ON ai_history FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only create AI history for themselves
CREATE POLICY "Users can create their own ai_history"
  ON ai_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own AI history
CREATE POLICY "Users can update their own ai_history"
  ON ai_history FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can only delete their own AI history
CREATE POLICY "Users can delete their own ai_history"
  ON ai_history FOR DELETE
  USING (auth.uid() = user_id);
```

## Storage Security

### Supabase Storage RLS
File storage in the `vault` bucket uses folder-based isolation:

```sql
-- Users can only upload files to their own folder
CREATE POLICY "Users can upload their own files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'vault' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can only view files in their own folder
CREATE POLICY "Users can view their own files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'vault' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can only delete files in their own folder
CREATE POLICY "Users can delete their own files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'vault' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
```

## API Security

### OpenAI API
- API key stored securely in environment variables
- Server-side only (never exposed to client)
- Rate limiting through OpenAI's built-in mechanisms
- Conversation history saved with user_id association

### API Routes
All API routes verify authentication before processing requests:
```typescript
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()

if (!user) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}
```

## Environment Variables

### Required Variables
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

### Security Best Practices
- Never commit `.env.local` or `.env` files
- Use `.env.example` as a template
- Rotate API keys regularly
- Use different keys for development and production
- Store production keys in secure environment variable systems (Vercel, DigitalOcean, etc.)

## Data Encryption

### At Rest
- All data stored in Supabase is encrypted at rest
- Files in Supabase Storage are encrypted

### In Transit
- All connections use HTTPS/TLS
- Supabase connections are encrypted
- OpenAI API calls use HTTPS

## Client-Side Security

### CSRF Protection
- Next.js middleware handles CSRF protection
- Cookie-based sessions with secure flags

### XSS Prevention
- React automatically escapes output
- No dangerouslySetInnerHTML used
- Content Security Policy headers (can be configured in next.config.ts)

## Audit and Monitoring

### Logging
- All database queries are logged by Supabase
- API calls to OpenAI are logged
- Authentication events are tracked by Supabase Auth

### Monitoring Recommendations
1. Enable Supabase Auth logs
2. Monitor API usage in OpenAI dashboard
3. Set up alerts for unusual activity
4. Regular security audits of RLS policies

## Compliance

### GDPR Considerations
- Users can delete their own data
- Data is isolated per user
- Clear data ownership model

### Data Retention
- Users control their data lifecycle
- Deletion cascades to related records
- Storage files can be deleted by users

## Security Checklist

Before deploying to production:

- [ ] Set strong, unique environment variables
- [ ] Enable 2FA on Supabase account
- [ ] Review and test all RLS policies
- [ ] Configure rate limiting on API routes
- [ ] Set up monitoring and alerting
- [ ] Review Supabase Auth settings
- [ ] Test authentication flows
- [ ] Verify file upload restrictions
- [ ] Check CORS settings
- [ ] Enable Supabase's additional security features

## Incident Response

In case of a security incident:

1. Immediately rotate all API keys
2. Review Supabase logs for unauthorized access
3. Check RLS policies for potential bypasses
4. Notify affected users if data was compromised
5. Document the incident and response
6. Update security measures to prevent recurrence

## Updates and Patches

- Regularly update npm dependencies
- Monitor security advisories for Next.js, Supabase, and OpenAI
- Subscribe to security bulletins from all service providers
- Test updates in staging before production deployment

## Contact

For security concerns or to report vulnerabilities, please contact the development team through appropriate channels.

---

Last updated: December 2025
