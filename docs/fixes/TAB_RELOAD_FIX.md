# Tab Reload Fix Documentation

## Problem

The web application was reloading/re-rendering when users switched browser tabs, causing a poor user experience and potential loss of form data or application state.

## Root Cause

This issue was caused by NextAuth.js automatically refetching session data when the browser tab regains focus (becomes visible again). This behavior is enabled by default in NextAuth.js to ensure session validity but can cause unwanted page reloads.

## Solution Implemented

### 1. Session Configuration (`lib/session-config.ts`)

- Disabled automatic session refetch on window focus
- Disabled session refetch when offline
- Set refetch interval to 0 to prevent automatic polling
- Configured session to be cached for 5 minutes

### 2. Updated NextAuth Configuration (`lib/auth.ts`)

- Increased session max age to 24 hours
- Set session update age to 1 hour to reduce frequent updates

### 3. Updated All SessionProvider Instances

Modified all layout files to use the new session configuration:

- `app/client/layout.tsx`
- `app/admin/layout.tsx`
- `app/coordinador/layout.tsx`
- `app/empresa/layout.tsx`
- `app/redirect/layout.tsx`
- `app/login/layout.tsx`
- `app/vacantes/layout.tsx`

### 4. Created StableSessionProvider (`components/StableSessionProvider.tsx`)

- Memoized SessionProvider component to prevent unnecessary re-renders
- Applies the session configuration automatically

### 5. Added Client-Side Prevention (`app/layout.tsx`)

- Added a script that intercepts NextAuth session API calls
- Prevents automatic session updates when tab becomes visible
- Runs before React hydration to ensure early prevention

### 6. Enhanced Middleware (`middleware.ts`)

- Added error handling to prevent infinite redirect loops
- Made API calls more resilient to failures

## Files Modified

- `lib/session-config.ts` (new)
- `lib/auth.ts`
- `components/StableSessionProvider.tsx` (new)
- `lib/prevent-tab-reload.ts` (new)
- `hooks/useVisibilityChange.ts` (new)
- `docs/TAB_RELOAD_FIX.md` (new)
- `app/layout.tsx`
- `middleware.ts`
- All layout files with SessionProvider

## Testing

After implementing these changes:

1. Open the application in a browser
2. Switch to another tab and wait a few seconds
3. Switch back to the application tab
4. Verify that the page doesn't reload or lose state

## Benefits

- Improved user experience with no unexpected reloads
- Better performance by reducing unnecessary API calls
- Preserved form data and application state when switching tabs
- Maintained security by keeping session validation active when needed
