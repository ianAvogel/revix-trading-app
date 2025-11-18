# Feature Validation Checklist - Run This First

Use this checklist to verify what's currently working in the Revix Trading App.

**Instructions**: 
1. Start dev server: `npm run dev`
2. Go through each feature
3. Check off what works
4. Note any issues
5. Report status to guide next build priorities

---

## Landing Page (`/`)

- [ ] Hero section visible with gradient background
- [ ] Headline: "Revix - Paper-trade crypto with $50K + an AI Mentor"
- [ ] Subheadline: "Real-time markets • Zero risk • Learn with AI coach"
- [ ] "Start Trading with $50K Demo" button clicks → routes to `/signup`
- [ ] "Watch 30s Tour" button opens modal
- [ ] Tour modal displays (video or placeholder)
- [ ] Tour modal closes on click/escape
- [ ] Page responsive at mobile (320px) and desktop (1440px)

**Status**: _____ **Issues**: _____

---

## Authentication

### Signup Flow (`/signup`)

- [ ] Signup page loads
- [ ] Email input accepts text
- [ ] Password input accepts text
- [ ] "Continue as guest" toggle visible
- [ ] Submit button triggers form submission
- [ ] Success redirects to `/dashboard`
- [ ] Error shows inline (try duplicate email)
- [ ] OAuth buttons visible (Google)

**Status**: _____ **Issues**: _____

### Login (`/login`)

- [ ] Login page accessible
- [ ] Email + password fields work
- [ ] Submit logs in existing user
- [ ] Redirects to `/dashboard`
- [ ] Error handling for wrong credentials

**Status**: _____ **Issues**: _____

### NextAuth Integration

- [ ] `/api/auth/[...nextauth]` responds
- [ ] Session created after signup
- [ ] Session accessible in browser cookies
- [ ] `useSession()` works in components

**Status**: _____ **Issues**: _____

---

## Dashboard (`/dashboard`)

### Layout & Navigation

- [ ] Dashboard loads after auth
- [ ] Top nav visible with Revix logo
- [ ] Navigation links visible (Portfolio, Trade, Signals, Learn, Leaderboard)
- [ ] User avatar dropdown in top-right
- [ ] Left sidebar shows virtual account card
- [ ] Center area shows chart widget
- [ ] Right sidebar shows mentor card

**Status**: _____ **Issues**: _____

### Portfolio Card (Left Sidebar)

- [ ] Shows "Demo Account" or user account name
- [ ] Displays Equity: $50,000 (or real balance)
- [ ] Displays Cash: $50,000 (or real)
- [ ] Displays ROI: 0% (or real)
- [ ] Shows quick action buttons

**Status**: _____ **Issues**: _____

### Chart Widget (Center)

- [ ] Chart container visible
- [ ] Timeframe selector (1m, 5m, 1h, 1d) visible
- [ ] Chart renders (even with placeholder data)
- [ ] Signal toggle checkboxes present
- [ ] Clicking chart opens expanded modal (test if applicable)

**Status**: _____ **Issues**: _____

### Mentor Card (Right Sidebar)

- [ ] Card displays
- [ ] Shows signal headline
- [ ] Shows confidence badge
- [ ] Shows brief explanation
- [ ] "Apply" button clickable
- [ ] "Ignore" button clickable

**Status**: _____ **Issues**: _____

### Activity Feed (Bottom)

- [ ] Activity feed section visible
- [ ] Shows recent trades (if any exist)
- [ ] Shows recent signals (if any exist)
- [ ] Updates in real-time (or shows placeholder)

**Status**: _____ **Issues**: _____

---

## Trading

### Trade Modal

- [ ] Accessible from Dashboard (mentor card "Apply" or nav "Trade")
- [ ] Modal opens and displays form
- [ ] Pair selector visible and functional
- [ ] Buy/Sell toggle works
- [ ] Market/Limit toggle works
- [ ] Amount input accepts numbers
- [ ] Amount slider synchronized with input
- [ ] Advanced options (slippage) visible
- [ ] Preview box shows estimated price
- [ ] Preview box shows fees
- [ ] Confirm button disabled until valid
- [ ] Confirm button enabled when valid
- [ ] Submit creates trade (check via API or portfolio page)

**Status**: _____ **Issues**: _____

### Trade Execution API (`POST /api/trades/execute`)

```bash
curl -X POST http://localhost:3000/api/trades/execute \
  -H "Content-Type: application/json" \
  -d '{"pair":"BTC","side":"BUY","quantity":"0.1","price":"45000","accountId":"ACCOUNT_ID"}'
```

- [ ] API endpoint responds with 200 OK
- [ ] Returns trade object with ID, timestamp, status
- [ ] Trade record created in database
- [ ] Trade audit log entry created
- [ ] Position updated

**Status**: _____ **Issues**: _____

---

## Portfolio & History

### Portfolio Page (`/portfolio`)

- [ ] Page loads
- [ ] Shows list of open positions (if any)
- [ ] Shows list of closed trades (if any)
- [ ] Each trade shows: symbol, qty, entry, exit, PnL
- [ ] Can click trade to see details
- [ ] Detail modal shows audit log
- [ ] Export CSV button downloads file

**Status**: _____ **Issues**: _____

### Portfolio APIs

```bash
# Get positions
curl http://localhost:3000/api/portfolio/positions

# Get history
curl http://localhost:3000/api/portfolio/history

# Export trades
curl http://localhost:3000/api/trades/export
```

- [ ] `/api/portfolio/positions` returns array of positions
- [ ] `/api/portfolio/history` returns array of closed trades
- [ ] `/api/trades/export` downloads CSV

**Status**: _____ **Issues**: _____

---

## Signals

### Signals Page (`/signals`)

- [ ] Page loads
- [ ] Signal list visible
- [ ] Filters visible (symbol, confidence)
- [ ] List items show: time, symbol, direction, confidence
- [ ] Click item → opens detail drawer
- [ ] Detail shows full explanation
- [ ] "Apply" button prefills trade modal
- [ ] "Save" button adds to watchlist

**Status**: _____ **Issues**: _____

### Signals API

```bash
curl http://localhost:3000/api/signals
curl http://localhost:3000/api/signals?symbol=BTC&confidence_min=0.7
```

- [ ] `/api/signals` returns array of signals
- [ ] Includes: symbol, direction (BUY/SELL), confidence, rationale
- [ ] Filters work (symbol, confidence)

**Status**: _____ **Issues**: _____

---

## AI Mentor

### Mentor Chat (`/mentor` or drawer)

- [ ] Chat component visible (drawer or full-screen)
- [ ] Message input visible
- [ ] Quick prompts visible (Why did I lose?, Suggest risk reduction, etc.)
- [ ] Can type and submit question
- [ ] Mentor responds within 5s
- [ ] Response shows actionable advice
- [ ] Action buttons work (e.g., "Create stop-loss")

**Status**: _____ **Issues**: _____

### Mentor API

```bash
curl -X POST http://localhost:3000/api/mentor/message \
  -H "Content-Type: application/json" \
  -d '{"question":"Why did I lose on that trade?","context":"account","accountId":"ACCOUNT_ID"}'
```

- [ ] `/api/mentor/message` accepts POST
- [ ] Returns advice within 5s
- [ ] Includes action buttons
- [ ] Rate limiting works (10/hour)

**Status**: _____ **Issues**: _____

---

## Leaderboard

### Leaderboard Page (`/leaderboard`)

- [ ] Page loads
- [ ] Tabs visible: Global / Friends / Weekly
- [ ] List shows: rank, alias, ROI, max drawdown
- [ ] Can sort/filter
- [ ] Share button works (social copy)
- [ ] Click user → opens public profile (if available)

**Status**: _____ **Issues**: _____

### Leaderboard API

```bash
curl "http://localhost:3000/api/leaderboard?view=global"
curl "http://localhost:3000/api/leaderboard?view=weekly"
```

- [ ] `/api/leaderboard` returns ranked list
- [ ] Includes ROI, max drawdown, risk score
- [ ] Filters by view work

**Status**: _____ **Issues**: _____

---

## Tournaments

### Tournament List

- [ ] Visible on leaderboard or dedicated page
- [ ] Shows active tournaments
- [ ] Join button triggers modal or direct join
- [ ] Can create tournament (admin or user button)
- [ ] Tournament modal accepts name, rules, dates

**Status**: _____ **Issues**: _____

### Tournament APIs

```bash
curl http://localhost:3000/api/tournaments
curl -X POST http://localhost:3000/api/tournaments \
  -H "Content-Type: application/json" \
  -d '{"name":"Crypto Challenge","startTime":"2025-11-25T00:00:00Z","endTime":"2025-12-02T00:00:00Z"}'

curl -X POST http://localhost:3000/api/tournaments/TOURNAMENT_ID/join \
  -H "Content-Type: application/json" \
  -d '{"accountId":"ACCOUNT_ID"}'
```

- [ ] `/api/tournaments` returns list
- [ ] `POST /api/tournaments` creates tournament
- [ ] `POST /api/tournaments/:id/join` registers user

**Status**: _____ **Issues**: _____

---

## Market Data

### Market Data API

```bash
curl "http://localhost:3000/api/market/prices?symbols=BTC,ETH"
curl "http://localhost:3000/api/market/prices?symbol=BTC&timeframe=1h"
```

- [ ] `/api/market/prices` returns price data
- [ ] Includes current price, high, low, volume
- [ ] Supports multiple symbols
- [ ] Returns chart history (OHLCV)

**Status**: _____ **Issues**: _____

---

## Settings

### Settings Page (`/settings`)

- [ ] Page loads
- [ ] Profile section visible (name, email, avatar)
- [ ] Notifications section (email, telegram toggles)
- [ ] API Keys section (generate, revoke)
- [ ] Billing section (plan, invoices)
- [ ] Security section (password, 2FA)
- [ ] Can update preferences
- [ ] Can generate API keys

**Status**: _____ **Issues**: _____

### Preferences API

```bash
curl http://localhost:3000/api/users/preferences
curl -X PUT http://localhost:3000/api/users/preferences \
  -H "Content-Type: application/json" \
  -d '{"experienceLevel":"Intermediate","preferredAssets":["BTC","ETH"]}'
```

- [ ] `GET /api/users/preferences` returns user prefs
- [ ] `PUT /api/users/preferences` updates prefs

**Status**: _____ **Issues**: _____

---

## Public Profile

### Public Profile Page (`/u/:alias`)

- [ ] Route loads (e.g., `/u/demo-user`)
- [ ] Shows user avatar, alias
- [ ] Shows public stats (ROI, best week)
- [ ] Shows sample trades (with timestamps)
- [ ] Share buttons present (Twitter, Telegram)
- [ ] Privacy toggle works (hides data if private)

**Status**: _____ **Issues**: _____

---

## User Account

### Me Endpoint

```bash
curl http://localhost:3000/api/accounts/me
```

- [ ] `/api/accounts/me` returns current user account
- [ ] Includes: id, userId, name, balance, equity, ROI

**Status**: _____ **Issues**: _____

---

## Error Handling

- [ ] Try invalid signup (duplicate email) → shows error
- [ ] Try insufficient balance in trade → shows error
- [ ] Try invalid price in limit order → shows error
- [ ] Network error shows graceful fallback message
- [ ] 404 page shows for missing routes
- [ ] 500 error page shows for server errors

**Status**: _____ **Issues**: _____

---

## Responsive Design

Test each section at breakpoints:

### Mobile (320px)
- [ ] All text readable
- [ ] Buttons/inputs large enough
- [ ] Navigation collapses to hamburger (if applicable)
- [ ] No horizontal scroll

**Status**: _____ **Issues**: _____

### Tablet (768px)
- [ ] Layout adjusts (single or two-column)
- [ ] All elements visible and functional

**Status**: _____ **Issues**: _____

### Desktop (1024px+)
- [ ] Full layout visible
- [ ] All sections rendered

**Status**: _____ **Issues**: _____

---

## Performance

```bash
# Check build
npm run build

# Check Lighthouse
npm install -g lighthouse
lighthouse http://localhost:3000 --view
```

- [ ] Build completes without errors
- [ ] Lighthouse score >80 on desktop
- [ ] Initial load <2.5s on 4G (throttled)
- [ ] Interaction response <200ms

**Status**: _____ **Issues**: _____

---

## Database & API Health

### Check Prisma Accelerate Connection

```bash
npx prisma studio  # Opens Prisma Studio if online
curl http://localhost:3000/api/leaderboard  # Any route that hits DB
```

- [ ] Database connection working
- [ ] Queries returning data
- [ ] No connection pool errors

**Status**: _____ **Issues**: _____

### Check Prisma Optimize

- [ ] Go to https://cloud.prisma.io
- [ ] Check "Queries" tab
- [ ] Verify queries are being recorded
- [ ] Check for N+1 query patterns

**Status**: _____ **Issues**: _____

---

## Summary

### Features Ready for Production (Check ✅)
- [ ] Landing page
- [ ] Auth (signup/login)
- [ ] Dashboard
- [ ] Trade execution
- [ ] Portfolio & history
- [ ] Signals
- [ ] Mentor chat
- [ ] Leaderboard
- [ ] Tournaments
- [ ] Market data
- [ ] Settings
- [ ] Public profiles
- [ ] Error handling
- [ ] Mobile responsive
- [ ] Performance optimized

### Features Needing Work (Note ⚠️)
- _____
- _____
- _____

### Critical Issues (Note 🔴)
- _____
- _____
- _____

### Next Steps
1. Fix critical issues
2. Complete features marked ⚠️
3. Run full acceptance test suite
4. Deploy to staging
5. QA review
6. Deploy to production

---

**Validation Date**: _____  
**Tester**: _____  
**Status**: Ready for Phase 1 / Needs Phase 2 Work / Production Ready
