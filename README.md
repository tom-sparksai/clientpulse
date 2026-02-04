# ClientPulse 🚀

A real-time agency dashboard for client management built with Next.js 15, Supabase, and Tailwind CSS.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)

## Features

✨ **Project Management** - Create and track projects with status, progress, and deadlines  
👥 **Client Portal** - Give clients their own portal link to view projects and communicate  
💬 **Real-time Chat** - Instant messaging between team and clients (powered by Supabase Realtime)  
✅ **Task Tracking** - Manage tasks with real-time status updates  
📄 **Invoicing** - Create, track, and manage invoices  
🔐 **Authentication** - Secure auth with Supabase Auth  
🏢 **Multi-agency** - Each signup creates their own agency workspace

## Quick Start

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier works)

### 1. Clone & Install

```bash
git clone https://github.com/tom-sparksai/clientpulse.git
cd clientpulse
npm install
```

### 2. Set Up Supabase

1. Create a new project at [app.supabase.com](https://app.supabase.com)
2. Go to **Settings > API** and copy your:
   - Project URL
   - anon/public key

3. Create `.env.local`:

```bash
cp .env.example .env.local
```

4. Fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set Up Database

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the contents of `supabase/schema.sql`
3. Paste and run the SQL

This creates all tables, indexes, RLS policies, and triggers.

### 4. Run the App

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login & signup pages
│   ├── auth/callback/   # OAuth callback handler
│   ├── client/[token]/  # Client portal (public)
│   └── dashboard/       # Main dashboard
│       ├── clients/     # Client management
│       ├── invoices/    # Invoice management
│       ├── projects/    # Project management
│       └── settings/    # User & agency settings
├── components/
│   └── dashboard/       # Dashboard components
│       ├── sidebar.tsx
│       ├── project-chat.tsx
│       ├── task-list.tsx
│       └── invoice-actions.tsx
└── lib/
    ├── supabase/        # Supabase clients
    ├── database.types.ts
    └── utils.ts
```

## Key Features Explained

### Real-time Chat

Messages are synced in real-time using Supabase Realtime subscriptions:

```typescript
supabase
  .channel(`project-${projectId}-messages`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `project_id=eq.${projectId}`,
  }, handleNewMessage)
  .subscribe()
```

### Client Portal

Each client gets a unique portal link (`/client/[token]`) where they can:
- View their projects and progress
- Chat with the agency team
- See task status updates

### Row Level Security

All data is protected with Supabase RLS policies:
- Users can only see data from their agency
- Clients can only access their own projects via portal token
- Admins have additional delete permissions

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Real-time:** Supabase Realtime
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React
- **TypeScript:** Full type safety

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |
| `NEXT_PUBLIC_APP_URL` | Your app's base URL |

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Database Schema

See `supabase/schema.sql` for the complete schema including:
- Tables: agencies, users, clients, projects, tasks, messages, files, invoices
- RLS policies for secure multi-tenant access
- Triggers for auto-updating timestamps
- Function to auto-create user profiles on signup

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Other Platforms

Works with any platform that supports Next.js:
- Railway
- Render
- Netlify
- Self-hosted

## Contributing

PRs welcome! Please follow the existing code style.

## License

MIT

---

Built with ❤️ by [SparksAI](https://sparksai.in)
