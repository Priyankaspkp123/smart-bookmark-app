# Smart Bookmark App

A real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS.

## Features

- Google OAuth authentication (no email/password)
- Add bookmarks with URL and title
- Private bookmarks per user
- Real-time updates across tabs
- Delete bookmarks
- Deployed on Vercel

## Tech Stack

- Next.js 15 (App Router)
- Supabase (Auth, Database, Realtime)
- Tailwind CSS
- TypeScript

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Authentication > Providers > Google and enable it
3. Add your Google OAuth credentials
4. In Authentication > URL Configuration, add:
   - Site URL: `http://localhost:3000` (for dev)
   - Redirect URLs: `http://localhost:3000/auth/callback`

### 3. Create Database Table

Run this SQL in Supabase SQL Editor:

```sql
create table bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  url text not null,
  title text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table bookmarks enable row level security;

-- Policy: Users can only see their own bookmarks
create policy "Users can view own bookmarks"
  on bookmarks for select
  using (auth.uid() = user_id);

-- Policy: Users can insert their own bookmarks
create policy "Users can insert own bookmarks"
  on bookmarks for insert
  with check (auth.uid() = user_id);

-- Policy: Users can delete their own bookmarks
create policy "Users can delete own bookmarks"
  on bookmarks for delete
  using (auth.uid() = user_id);

-- Enable realtime
alter publication supabase_realtime add table bookmarks;
```

### 4. Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these from Supabase Project Settings > API.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel project settings
4. Deploy
5. Update Supabase redirect URLs with your Vercel domain

## Problems Encountered and Solutions

### Problem 1: Real-time Updates Not Working
**Issue**: Bookmarks weren't syncing across tabs initially.

**Solution**: Enabled Supabase Realtime on the bookmarks table using `alter publication supabase_realtime add table bookmarks;` and set up proper channel subscriptions with user-specific filters.

### Problem 2: Google OAuth Redirect Loop
**Issue**: After Google sign-in, users were redirected back to login.

**Solution**: Created proper auth callback route at `/auth/callback` that exchanges the OAuth code for a session before redirecting to the home page.

### Problem 3: Row Level Security Blocking Queries
**Issue**: Users couldn't see their bookmarks even after authentication.

**Solution**: Implemented proper RLS policies that check `auth.uid() = user_id` for all operations, ensuring users can only access their own data.

### Problem 4: TypeScript Errors with Next.js 15
**Issue**: Async params in route handlers caused type errors.

**Solution**: Updated route handlers to properly await the params object as required by Next.js 15: `const { id } = await params`.

## Testing

1. Sign in with Google
2. Add a bookmark
3. Open the app in another tab - bookmark should appear instantly
4. Delete a bookmark - it should disappear in both tabs
5. Sign out and sign in with a different Google account - bookmarks should be private

## License

MIT
