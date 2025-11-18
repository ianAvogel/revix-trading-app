# Revix Trading App - Quick Start for Developers

## Getting Started (First Time Setup)

### 1. Clone the Repository
```bash
git clone https://github.com/ianAvogel/revix-trading-app.git
cd revix-trading-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create `.env` file in root directory (copy from `.env.example`):
```bash
cp .env.example .env
```

Fill in your keys:
```env
# Database (already configured with Prisma Accelerate)
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_API_KEY"

# Prisma Optimize
OPTIMIZE_API_KEY="your_optimize_api_key"

# LLM Services (for AI Mentor)
GROQ_API_KEY=your_groq_key
ANTHROPIC_API_KEY=your_anthropic_key
OPENAI_API_KEY=your_openai_key

# NextAuth
NEXTAUTH_SECRET=generate_with: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
```

### 4. Generate Prisma Client
```bash
npx prisma generate
```

### 5. Apply Database Migrations (if needed)
```bash
npx prisma migrate deploy
```

### 6. Seed Database (Optional - sample data)
```bash
npx prisma db seed
```

### 7. Start Development Server
```bash
npm run dev
```

Server runs at: **http://localhost:3000**

---

## Available Scripts

```bash
# Start dev server (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio (database GUI)
npx prisma studio

# Run migrations
npx prisma migrate deploy

# Reset database (careful - deletes all data)
npx prisma db push --force-reset

# Seed database
npx prisma db seed
```

---

## Project Structure

```
revix-trading-app/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── trades/               # Trade execution
│   │   ├── signals/              # Signal management
│   │   ├── leaderboard/          # Leaderboard ranking
│   │   ├── tournaments/          # Tournament management
│   │   ├── portfolio/            # Portfolio data
│   │   ├── mentor/               # AI Mentor chat
│   │   ├── market/               # Market data
│   │   └── users/                # User settings
│   ├── (auth)/                   # Auth pages (login, signup)
│   ├── dashboard/                # Main dashboard
│   ├── portfolio/                # Portfolio & history
│   ├── signals/                  # Signal browsing
│   ├── leaderboard/              # Leaderboard & tournaments
│   ├── settings/                 # User settings
│   └── u/                        # Public profiles
├── components/                   # Reusable React components
│   ├── dashboard/                # Dashboard components
│   ├── landing/                  # Landing page components
│   ├── signals/                  # Signal components
│   ├── leaderboard/              # Leaderboard components
│   ├── mentor/                   # Mentor chat components
│   ├── portfolio/                # Portfolio components
│   ├── trade/                    # Trade modal components
│   ├── settings/                 # Settings components
│   └── ui/                       # shadcn/ui components
├── lib/                          # Utilities
│   ├── auth.ts                   # NextAuth config
│   ├── prisma.ts                 # Prisma client singleton
│   └── utils.ts                  # Helper functions
├── services/                     # Business logic
│   ├── trade-executor.ts         # Trade execution logic
│   ├── signal-service.ts         # Signal generation/fetching
│   ├── market-data.ts            # Market data fetching
│   ├── accelerate-cache.ts       # Accelerate cache strategies
│   └── example-accelerate-usage.ts  # Code examples
├── stores/                       # Zustand state management
├── types/                        # TypeScript type definitions
├── prisma/                       # Database
│   ├── schema.prisma             # Database schema
│   ├── migrations/               # Database migrations
│   └── seed.js                   # Seed data
└── docs/                         # Documentation
    ├── BUILD_PLAN.md             # Feature build plan
    ├── VALIDATION_CHECKLIST.md   # Testing checklist
    ├── ACCELERATE_SETUP.md       # Accelerate guide
    ├── PRISMA_OPTIMIZE_SETUP.md  # Optimize guide
    └── PRISMA_SETUP_COMPLETE.md  # Complete setup
```

---

## Key Technologies

- **Framework**: Next.js 15.5.6 (React 19, Server Components)
- **Database**: PostgreSQL via Prisma Accelerate
- **ORM**: Prisma 6.19.0
- **Authentication**: NextAuth.js 4.24.13
- **Styling**: Tailwind CSS 3.4.1
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion 12.23.24
- **State Management**: Zustand
- **API Clients**: Axios (for external APIs)
- **LLM**: Groq, Anthropic, OpenAI
- **Database Performance**: Prisma Accelerate + Optimize

---

## Database Schema Overview

13 core models:

- **User** - User accounts with auth
- **VirtualAccount** - Demo trading accounts ($50K each)
- **Position** - Open positions (crypto holdings)
- **Trade** - Executed trades
- **TradeAudit** - Immutable trade audit log
- **Signal** - AI trading signals
- **UserSignalAction** - User signal interactions (apply/ignore)
- **MentorConversation** - Chat history with AI mentor
- **LeaderboardEntry** - Ranking data
- **Tournament** - Trading competitions
- **TournamentEntry** - Tournament participation
- **MarketData** - Historical OHLCV data
- **HistoricalData** - Price history for backtesting

---

## API Endpoints Quick Reference

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/[...nextauth]` - NextAuth endpoints
- `POST /api/auth/guest` - Create guest session

### Trading
- `POST /api/trades/execute` - Place order
- `GET /api/trades/my-trades` - User's trades
- `POST /api/trades/export` - Export trades as CSV

### Portfolio
- `GET /api/portfolio/positions` - Open positions
- `GET /api/portfolio/history` - Closed trades

### Signals
- `GET /api/signals` - Browse signals
- `POST /api/signals/save` - Save signal to watchlist

### Mentor
- `POST /api/mentor/message` - Chat with AI mentor

### Market Data
- `GET /api/market/prices` - Current prices + history

### Leaderboard
- `GET /api/leaderboard` - Ranked users

### Tournaments
- `GET /api/tournaments` - Active tournaments
- `POST /api/tournaments` - Create tournament
- `POST /api/tournaments/:id/join` - Join tournament

### User
- `GET /api/accounts/me` - Current user's account
- `GET /api/users/preferences` - User preferences
- `PUT /api/users/preferences` - Update preferences

---

## Development Workflow

### 1. Create Feature Branch
```bash
git checkout -b feature/feature-name
```

### 2. Make Changes
- Edit components, API routes, database schema
- Test locally with `npm run dev`
- Check no TypeScript errors: `npm run build`

### 3. Commit & Push
```bash
git add .
git commit -m "feat: add feature description"
git push -u origin feature/feature-name
```

### 4. Create Pull Request
- Go to https://github.com/ianAvogel/revix-trading-app
- Create PR from your branch to `main`
- Add description of changes
- Include any testing notes

### 5. Code Review & Merge
- Address any feedback
- Squash commits if needed
- Merge to `main`

### 6. Deploy
- Staging: automatic on merge to `main`
- Production: manual deployment

---

## Testing Checklist

Before committing, verify:

- [ ] `npm run build` passes (no TypeScript errors)
- [ ] Dev server starts: `npm run dev`
- [ ] Feature works locally at localhost:3000
- [ ] All API endpoints tested (use provided curl commands)
- [ ] No console errors or warnings
- [ ] Responsive at mobile (320px) and desktop (1440px)
- [ ] Form validation works
- [ ] Error handling shows user-friendly messages

---

## Debugging Tips

### Check Database
```bash
# Open Prisma Studio
npx prisma studio

# See database URL
echo $DATABASE_URL
```

### Check API Response
```bash
# Test any endpoint
curl http://localhost:3000/api/leaderboard
curl http://localhost:3000/api/signals
curl http://localhost:3000/api/accounts/me
```

### View Logs
```bash
# Check server logs (running `npm run dev`)
# Look for errors in terminal where server started

# Check browser console (F12)
# Look for network errors in DevTools Network tab
```

### Reset Database (Be Careful!)
```bash
# Delete all data and reseed
npx prisma db push --force-reset
npx prisma db seed

# Or just reset schema
npx prisma migrate reset
```

---

## Common Issues & Fixes

### Issue: `DATABASE_URL not found`
**Fix**: Create `.env` file with valid DATABASE_URL

### Issue: Prisma client not generated
**Fix**: Run `npx prisma generate`

### Issue: Port 3000 already in use
**Fix**: Kill process on port 3000
```bash
# Linux/Mac
lsof -i :3000
kill -9 PID

# Windows
netstat -ano | findstr :3000
taskkill /PID PID /F
```

### Issue: Database connection refused
**Fix**: Check DATABASE_URL and network connection
```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

### Issue: TypeScript errors in build
**Fix**: Run type check and fix errors
```bash
npx tsc --noEmit
npm run lint
```

### Issue: Hot reload not working
**Fix**: Restart dev server
```bash
# Ctrl+C to stop
npm run dev  # restart
```

---

## Monitoring & Observability

### Prisma Optimize Dashboard
- URL: https://cloud.prisma.io
- Monitor query performance
- Check for N+1 query patterns
- Review recommendations

### Error Tracking (Optional)
- Sentry can be configured for production error tracking
- Check `.env` for `SENTRY_DSN` if needed

### Database Metrics
- Prisma Optimize tracks query count, duration, cache hits
- Accelerate provides connection pooling metrics

---

## Feature Development Guide

### Adding a New Page

1. Create `app/yourfeature/page.tsx`:
```tsx
import dynamic from "next/dynamic"
const YourComponent = dynamic(() => import("@/components/yourfeature/YourComponent"))

export default function YourFeaturePage() {
  return <YourComponent />
}
```

2. Create `components/yourfeature/YourComponent.tsx`:
```tsx
"use client"
export default function YourComponent() {
  return <div>Your feature here</div>
}
```

3. Update navigation in `components/dashboard/DashboardShell.tsx`

### Adding an API Route

1. Create `app/api/yourfeature/route.ts`:
```ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"

export async function GET(req: NextRequest) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  
  // Your logic
  return NextResponse.json({ data: [] })
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  // Your logic
  return NextResponse.json({ success: true })
}
```

2. Test with curl:
```bash
curl http://localhost:3000/api/yourfeature
curl -X POST http://localhost:3000/api/yourfeature -H "Content-Type: application/json" -d '{}'
```

### Adding a Database Model

1. Update `prisma/schema.prisma`:
```prisma
model YourModel {
  id String @id @default(cuid())
  name String
  createdAt DateTime @default(now())
}
```

2. Create migration:
```bash
npx prisma migrate dev --name add_your_model
```

3. Regenerate client:
```bash
npx prisma generate
```

---

## Performance Targets

- Initial page load: <2.5s on 4G
- API response time: <500ms
- Interaction latency: <200ms
- Lighthouse score: >80

Monitor in Prisma Optimize dashboard for actual metrics.

---

## Next Steps

1. Run `VALIDATION_CHECKLIST.md` to see what works
2. Follow `BUILD_PLAN.md` for Phase 1 priorities
3. Create feature branches for each task
4. Push to GitHub regularly
5. Check Prisma Optimize for performance metrics

---

## Need Help?

- **Documentation**: See `BUILD_PLAN.md` for detailed feature specs
- **API Reference**: See API Endpoints section above
- **Validation**: Use `VALIDATION_CHECKLIST.md` to test features
- **Database**: Open `npx prisma studio` to inspect data
- **Errors**: Check server terminal and browser console (F12)

---

**Good luck building! 🚀**
