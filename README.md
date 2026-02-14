---
# Smart Bookmark App

A full-stack real-time bookmark manager built with **Next.js (App Router)** and **Supabase**.

Users can sign in with Google, save private bookmarks, delete them, and see updates reflected instantly across multiple tabs using Supabase Realtime.
---

## Live Demo

**Live URL:**
`https://smartbookmarkmanager.vercel.app/login`

### How to Test

1. Click **Continue with Google**
2. Log in with your Google account
3. Add a bookmark
4. Open another tab and log in
5. Add/delete a bookmark in one tab
6. Watch the other tab update instantly (Realtime sync)

---

## Tech Stack

**Frontend**

- Next.js (App Router)
- TypeScript
- Tailwind CSS

**Backend**

- Supabase Auth (Google OAuth)
- Supabase Postgres Database
- Supabase Realtime (WebSockets)
- Row Level Security (RLS)

**Deployment**

- Vercel

---

## Architecture Overview

### Authentication Flow

The app uses Supabase as an OAuth broker:

```
App → Supabase → Google → Supabase → App
```

1. User clicks Google login
2. Supabase redirects to Google
3. Google authenticates and redirects back to Supabase
4. Supabase exchanges OAuth code for session
5. Supabase redirects to `/auth/callback`
6. App finalizes session using `exchangeCodeForSession`
7. User is redirected to dashboard

This ensures OAuth secrets are never exposed to the browser.

---

### Server + Client Separation

- `lib/supabase-browser.ts` → Client-side Supabase instance
- `lib/supabase-server.ts` → Server-side Supabase instance
- `/auth/callback` → Exchanges OAuth code for session securely

---

### Realtime Flow

- Dashboard subscribes to `postgres_changes`
- On insert/delete events → triggers refetch
- All open tabs update automatically
- Filtered by `user_id` for isolation

---

## Folder Structure

```
app/
  login/page.tsx
  dashboard/page.tsx
  auth/callback/route.ts
components/
  BookmarkForm.tsx
  BookmarkList.tsx
lib/
  supabase-browser.ts
  supabase-server.ts
```

---

## Database Design

### Table: `bookmarks`

| Column     | Type      |
| ---------- | --------- |
| id         | uuid      |
| user_id    | uuid      |
| title      | text      |
| url        | text      |
| created_at | timestamp |

Each bookmark belongs to a specific authenticated user.

---

## Row Level Security (RLS)

RLS is enabled to ensure complete user isolation.

Example policy:

```sql
(auth.uid() = user_id)
```

Policies exist for:

- SELECT
- INSERT
- DELETE

This guarantees:

- Users cannot view others' bookmarks
- Users cannot modify others' bookmarks
- Multi-tenant security is enforced at database level

---

## Realtime Implementation

Supabase Realtime is enabled via:

- Publication: `supabase_realtime`
- Table added to publication

Client subscribes to:

```ts
supabase
  .channel('bookmarks-realtime')
  .on('postgres_changes', {...})
  .subscribe()
```

On event → refetch bookmarks.

---

## Challenges Faced & Solutions

### 1. OAuth Redirect Mismatch

Google required Supabase callback URL:

```
https://<project>.supabase.co/auth/v1/callback
```

Solution: Added it to Google Console redirect URIs.

---

### 2. Missing `/auth/callback`

Login worked inconsistently without code exchange.
Solution: Created `app/auth/callback/route.ts` and used:

```
exchangeCodeForSession(code)
```

---

### 3. RLS Insert Not Working

Insert succeeded but returned null.
Cause: Missing INSERT policy.
Solution: Added proper RLS policy.

---

### 4. Realtime Not Triggering

Realtime subscription was active but no updates.
Cause: Table not added to `supabase_realtime` publication.
Solution: Added table to publication in Supabase dashboard.

---

### 5. Vercel OAuth Failure

Production login failed.
Cause: Missing environment variables and redirect URLs.
Solution:

- Added env vars in Vercel
- Set Supabase Site URL
- Configured Google redirect URIs
- Redeployed

---

### 6. TypeScript State Inference Errors

`never[]` state errors when setting bookmarks.
Solution: Explicitly typed state:

```ts
useState<Bookmark[]>([])
```

---

## Security Considerations

- OAuth secrets handled only by Supabase
- RLS ensures strict data isolation
- No direct database access from frontend
- Environment variables secured in Vercel
- Authenticated-only access to dashboard

---

## Environment Variables

Required:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

## Local Setup

1. Clone repository
2. Install dependencies:

```
npm install
```

3. Add environment variables
4. Run:

```
npm run dev
```

---

## Deployment Notes

For production:

1. Add Supabase callback URL to Google:

```
https://<project>.supabase.co/auth/v1/callback
```

2. Add your Vercel URL to:
   - Google redirect URIs
   - Supabase redirect URLs
   - Supabase Site URL

3. Add environment variables in Vercel

4. Redeploy

---

## Author

Krishna Dwivedi

---
