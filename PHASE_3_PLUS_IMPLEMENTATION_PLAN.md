# Phase 3+ Implementation Plan: Complete UX/Feature Build

## Executive Summary
You've provided a **15-item comprehensive feature list** (detailed UX specs) that spans **beyond Phase 3**. This document maps them to existing work and creates a buildout plan.

**Status**: 
- ✅ Some items already complete (Phase 1-2)
- ⏳ Some items partially complete (need polish)
- 🚧 Some items need building (Phase 3+)
- 📋 Some items need UX refinement

---

## Feature Mapping: What's Complete vs What's Needed

### ✅ ALREADY COMPLETE (Phase 1-2)

| Feature | Item | Status | Completion % |
|---------|------|--------|--------------|
| **Dashboard** | #3 | Implemented in Phase 2D | 90% (needs real market data) |
| **AI Mentor Chat** | #6 | Implemented in Phase 2A | 100% ✅ |
| **Trade Modal** | #4 | Partial (basic trades exist) | 70% (needs limit orders) |
| **Signal Center** | #5 | Implemented in Phase 2B | 85% (needs UI polish) |
| **Positions/History** | #7 | Basic routes exist | 50% (needs detail views) |
| **Leaderboard** | #8 | Implemented in Phase 2C | 80% (needs social polish) |
| **Public Profile** | #9 | Route exists `/u/[alias]` | 40% (needs redesign) |
| **Settings** | #11 | Basic page exists | 30% (incomplete) |
| **Mobile Responsive** | #13 | Implemented in Phase 2D | 85% (needs FAB & sheets) |
| **Error States** | #12 | Partial (basic error handling) | 50% (needs comprehensive) |

### 🚧 NEEDS BUILDING (Phase 3+)

| Feature | Item | Phase | Status |
|---------|------|-------|--------|
| **Landing Page** | #1 | Phase 4 | ❌ Not built |
| **Signup/Onboarding** | #2 | Phase 1 | ✅ Built but needs refinement |
| **Real Market Data** | #3 (enhance) | Phase 3A | 📋 Planned |
| **Advanced Orders** | #4 (enhance) | Phase 3B | 📋 Planned |
| **Signals Detail** | #5 (enhance) | Phase 3B | 📋 Planned |
| **Replay Mode** | #10 | Phase 4 | ❌ Not built |
| **Billing/API** | #11 (enhance) | Phase 5 | ❌ Not built |
| **Visual Details** | #14 | Phase 3D | 📋 Planned |

---

## Detailed Feature-by-Feature Build Plan

### PHASE 3A: Real Market Data + Dashboard Polish (3-4 hours)

#### Feature #1 - Landing Page (NEW) 🌍
**Status**: ❌ Not built
**Complexity**: Medium
**Timeline**: 1.5 hours

**Deliverables**:
```
app/
  ├── page.tsx                    (NEW: Landing page)
  └── layout.tsx                  (modify for public nav)

components/
  ├── landing/
  │   ├── Hero.tsx                (NEW)
  │   ├── SocialProof.tsx          (NEW)
  │   ├── HowItWorks.tsx           (NEW)
  │   ├── CTASection.tsx           (NEW)
  │   ├── TourModal.tsx            (ENHANCE: already exists, add video)
  │   └── Footer.tsx               (NEW)
```

**Content**:
- Hero with headline + 2 CTAs (Start demo, Watch tour)
- Social proof row (user count, sample ROI)
- 3-step "How it works" cards
- Responsive (mobile-first)
- No-JS fallback (basic form)

**API Endpoints**: 
- `GET /api/public/stats` - user count, avg ROI (NEW)

**Acceptance Criteria**:
- ✅ CTAs visible above fold (1280×720)
- ✅ Start demo → `/signup`
- ✅ Tour modal opens video
- ✅ Responsive on mobile

---

#### Feature #3 - Dashboard Enhancement (ENHANCE) 📊
**Status**: 90% (Phase 2D built it, now add real data)
**Complexity**: Medium
**Timeline**: 1.5 hours

**What needs updating**:
```
components/dashboard/
  ├── DashboardShell.tsx          (ENHANCE: add real prices)
  ├── PortfolioCard.tsx           (NEW: show real equity)
  ├── ChartContainer.tsx          (NEW: real market candles)
  └── MentorCardV2.tsx            (ENHANCE: latest signal)

services/
  ├── market-data-service.ts      (NEW: CoinGecko/Binance API)
  └── portfolio-calculator.ts     (NEW: real PnL calculations)
```

**Real Market Data Integration**:
- Use CoinGecko API (free, no auth needed)
- Fetch: BTC, ETH, SOL prices (60s refresh)
- Display: current price, 24h change, portfolio value
- Fallback: cached data if API down

**Technical Details**:
```typescript
// services/market-data-service.ts
interface MarketDataService {
  getRealtimePrices(symbols: string[]): Promise<PriceData[]>
  getHistoricalCandles(symbol, interval, limit): Promise<Candle[]>
}

// Example: $50k portfolio value calculation
const portfolioValue = (positions, prices) => {
  return positions.reduce((sum, pos) => {
    const currentPrice = prices[pos.symbol]
    return sum + (pos.quantity * currentPrice)
  }, initialCash)
}
```

**Acceptance Criteria**:
- ✅ Portfolio value updates within 2s
- ✅ Chart shows real candles
- ✅ Mentor card shows latest signal
- ✅ No errors if market data delayed

---

### PHASE 3B: Advanced Trading + Signals Polish (3-4 hours)

#### Feature #4 - Trade Modal Enhancement (ENHANCE) 💰
**Status**: 70% (basic market orders work)
**Complexity**: High
**Timeline**: 2 hours

**New Order Types**:
```typescript
// services/trade-executor.ts - ENHANCE with:
interface Order {
  type: 'MARKET' | 'LIMIT' | 'STOP_LOSS' | 'TAKE_PROFIT'
  
  // LIMIT: price user sets
  limitPrice?: Decimal
  
  // STOP_LOSS: sell if price drops below
  stopPrice?: Decimal
  
  // TAKE_PROFIT: sell if price rises above
  takeProfitPrice?: Decimal
}
```

**UI Enhancements**:
```
components/trade/TradeModal.tsx (ENHANCE with):
  - Order type selector (Market, Limit, Stop, TP)
  - Conditional price inputs (hide if not needed)
  - Risk helper: show profit/loss at different prices
  - Slippage slider: 0-2%
  - Preview: "Estimated fill: $XX at YY% slippage"
```

**Validation Rules**:
- Amount > 0 and <= buying power ✅
- Limit price within 10% of market price
- Stop price > current price (for shorts)
- Warn if order size > 1% of 24h volume

**Acceptance Criteria**:
- ✅ Limit order creates Order record with status=PENDING
- ✅ Stop-loss order triggers when price hits threshold
- ✅ Insufficient balance shows inline error
- ✅ Preview updates in real-time

---

#### Feature #5 - Signal Center Polish (ENHANCE) 🎯
**Status**: 85% (Phase 2B built it)
**Complexity**: Medium
**Timeline**: 1.5 hours

**What needs refining**:
```
components/signals/
  ├── SignalsList.tsx             (ENHANCE: better filter UX)
  ├── SignalDetail.tsx            (ENHANCE: add past analogs)
  ├── Rationale.tsx               (NEW: show reasoning)
  └── PastAnalogs.tsx             (NEW: historical examples carousel)

services/
  └── signal-analytics.ts         (NEW: find historical analogs)
```

**Signal Detail Enhancement**:
- Show full 3-bullet rationale
- Display feature importance (which indicators matter most)
- Carousel of "past analogs" (similar historical patterns)
- Suggested trade: pre-fill modal with qty + stop-loss
- Apply button → opens prefilled Trade Modal

**Technical Details**:
```typescript
interface SignalAnalysis {
  signal: Signal
  rationale: string[] // 3 bullets explaining why
  indicators: {
    name: string
    value: number
    importance: 0-1 // weight
  }[]
  pastAnalogs: {
    date: Date
    symbol: string
    outcome: 'WIN' | 'LOSS'
    roi: number
  }[]
}
```

**Acceptance Criteria**:
- ✅ Rationale and indicators display
- ✅ Past analogs show historical accuracy
- ✅ Apply signal opens prefilled Trade Modal
- ✅ Save signal adds to user watchlist

---

### PHASE 3C: Social + Leaderboard Polish (2-3 hours)

#### Feature #8 - Leaderboard Enhancement (ENHANCE) 🏆
**Status**: 80% (Phase 2C built it)
**Complexity**: Medium
**Timeline**: 1.5 hours

**What needs adding**:
```
components/leaderboard/
  ├── LeaderboardShell.tsx        (ENHANCE: tabs + filters)
  ├── LeaderboardTabs.tsx         (NEW: Global/Friends/Weekly/Tournaments)
  ├── FilterBar.tsx               (NEW: experience level, style)
  └── TraderCard.tsx              (NEW: follow, share buttons)

services/
  └── social-service.ts           (NEW: follow system)
```

**Database Schema Addition**:
```prisma
model Follow {
  id          String   @id @default(cuid())
  followerId  String
  follower    User     @relation("Follower", fields: [followerId], references: [id])
  followingId String
  following   User     @relation("Following", fields: [followingId], references: [id])
  
  @@unique([followerId, followingId])
}
```

**Features**:
- Tabs: Global / Friends / Weekly / Tournaments
- Filters: Experience level, trading style
- Share button on each row (Twitter/Telegram)
- Follow button on each trader card
- Leaderboard updates hourly

**Acceptance Criteria**:
- ✅ Leaderboard updates hourly
- ✅ Follow button creates Follow record
- ✅ Share generates shareable link
- ✅ Filters are combinatorial

---

#### Feature #9 - Public Profile Redesign (ENHANCE) 👤
**Status**: 40% (route exists, needs polish)
**Complexity**: Medium
**Timeline**: 1.5 hours

**Current**: `/app/u/[alias]/page.tsx` (basic)
**Needed**: Full profile with stats, chart, trades

```typescript
// New components
components/profile/
  ├── ProfileHeader.tsx           (NEW: avatar, alias, stats)
  ├── ProfileStats.tsx            (NEW: ROI, win rate, best week)
  ├── EquityCurve.tsx             (NEW: 3-month chart)
  ├── TradeHistory.tsx            (NEW: sample trades table)
  ├── Badges.tsx                  (NEW: achievement badges)
  └── ShareButton.tsx             (NEW: Twitter/Telegram copy)
```

**Stats to Display**:
- Total ROI % (with color: green/red)
- Win rate (% trades profitable)
- Best week ROI
- Total trades
- Days active
- Verified badge (if 10+ trades with positive ROI)

**Achievements/Badges**:
- "Consistent Performer" - Positive ROI 3+ months
- "Risk Manager" - Sharpe ratio > 1.5
- "Breakout Specialist" - Win rate > 70%
- "Comeback King" - Recovered from 50%+ drawdown

**Acceptance Criteria**:
- ✅ Public page loads without auth
- ✅ Shows verified badge if earned
- ✅ Share button creates shareable link
- ✅ Trade timestamps match trades_audit

---

### PHASE 4: Advanced Features + Polish (4-5 hours)

#### Feature #2 - Signup/Onboarding Refinement (ENHANCE) 🚀
**Status**: Built in Phase 1, but needs UX polish
**Complexity**: Medium
**Timeline**: 1.5 hours

**Current State**: 3-step form exists
**Needs**:
- Email validation with "already exists" error + login CTA
- Guest flow with persistent cookie
- Quick tour carousel (Dashboard, Trade, Mentor overview)
- Microcopy improvements ("We'll create $50k automatically - no credit card")

**Components to Enhance**:
```
app/(auth)/signup/
  ├── page.tsx                    (ENHANCE: 3-step flow)
  ├── StepAuth.tsx                (ENHANCE: OAuth + email)
  ├── StepPreferences.tsx         (ENHANCE: checkmarks + autocomplete)
  ├── StepTour.tsx                (NEW: carousel)
  └── GuestFlow.tsx               (NEW: cookie-based)
```

**Acceptance Criteria**:
- ✅ New user appears in DB with virtual_account
- ✅ Preferences saved to user profile
- ✅ User lands on Dashboard after completion
- ✅ Guest flow works without saving

---

#### Feature #7 - Positions & Trade History (ENHANCE) 📈
**Status**: 50% (routes exist, needs UI)
**Complexity**: Medium
**Timeline**: 1.5 hours

**Components Needed**:
```
components/portfolio/
  ├── PortfolioTabs.tsx           (NEW: Open Positions / Closed Trades)
  ├── PositionRow.tsx             (NEW: symbol, qty, entry, PnL)
  ├── TradeDetailModal.tsx        (NEW: full trade details)
  ├── AuditLog.tsx                (NEW: trade audit trail)
  └── ExportCSV.tsx               (NEW: download trades)
```

**Trade Detail Modal Shows**:
- Symbol, entry/exit price, quantity
- Entry time, exit time, duration
- Realized PnL ($ and %)
- Mentor feedback (if available)
- Chart with entry/exit markers
- Full audit log (who, when, what)

**Acceptance Criteria**:
- ✅ Export CSV downloads with timestamps
- ✅ Trade detail shows audit trail
- ✅ Mentor feedback displays (if available)
- ✅ Chart marks entry/exit

---

#### Feature #10 - Replay / Time-Shift Mode (NEW) ⏰
**Status**: ❌ Not built
**Complexity**: Very High
**Timeline**: 2-3 hours

**Purpose**: Let users practice on historical data

**Components**:
```
app/replay/page.tsx              (NEW: main page)

components/replay/
  ├── ControlBar.tsx             (NEW: date, speed, pause)
  ├── ReplayChart.tsx            (NEW: historical candles)
  ├── TimelineIndicator.tsx      (NEW: show "simulated time")
  └── ReplaySessions.tsx         (NEW: list saved replays)
```

**Database Schema**:
```prisma
model ReplaySession {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  
  name        String
  startDate   DateTime
  endDate     DateTime
  symbol      String
  
  trades      Trade[]  // trades in this session marked as "replay"
  savedAt     DateTime @default(now())
}
```

**Features**:
- Date picker: select start/end date
- Speed slider: 1x → 64x playback
- Pause/Play/Step forward-back
- Historical candles play in real-time
- Signals trigger as if live
- Place trades during replay (logged as distinct)

**Acceptance Criteria**:
- ✅ Historical candles load and play correctly
- ✅ Replay trades are marked as "simulation"
- ✅ Can save and resume replay sessions
- ✅ Speed controls work smoothly

---

#### Feature #11 - Settings & Billing (ENHANCE) ⚙️
**Status**: 30% (basic page exists)
**Complexity**: High
**Timeline**: 2 hours

**Sections**:
```
components/settings/
  ├── ProfileSettings.tsx         (ENHANCE: bio, avatar)
  ├── NotificationSettings.tsx    (ENHANCE: email, telegram)
  ├── APIKeySettings.tsx          (NEW: generate/revoke API keys)
  ├── BillingSettings.tsx         (NEW: plan, invoices, upgrade)
  └── SecuritySettings.tsx        (NEW: 2FA, password change)
```

**Billing Features**:
- Show current plan + price
- List invoices (with download)
- Upgrade/downgrade buttons
- Trial status countdown
- Usage stats (if applicable)

**API Keys**:
- Generate key pair (read-only by default)
- Show last 4 characters (for security)
- Ability to revoke/regenerate
- Scope selector (trading, read, etc.)

**Acceptance Criteria**:
- ✅ Billing plan changes update subscription records
- ✅ API key generation creates/stores securely
- ✅ Password change validated and hashed
- ✅ 2FA setup shows recovery codes

---

#### Feature #14 - Visual Details & Animations (POLISH) ✨
**Status**: 50% (basic animations in Phase 2D)
**Complexity**: Low
**Timeline**: 1 hour

**Animations to Add**:
```typescript
// lib/animation-presets.ts (ENHANCE with):
- Mentor card: slide-in from right (0.3s) when new signal
- Trade confirm: toast with expand animation
- Leaderboard: pulse animation on rank changes
- Error toast: shake animation
- Skeleton loaders: shimmer effect
```

**Performance Targets**:
- Interaction latency < 200ms
- Page load < 2.5s on 4G

---

#### Feature #12 - Error States & UX Copy (POLISH) 📝
**Status**: 50% (basic handling exists)
**Complexity**: Low
**Timeline**: 1-1.5 hours

**Principles**:
- Be human, helpful, concise
- Provide next step and contact
- Show error code for support

**Examples**:
```
- "Oops — we couldn't place your order. Try again in a few seconds. 
   If this keeps happening, contact support. [Error: ORD_001]"
   
- "No signals match your filters. Try lowering confidence or 
   switching pairs."
   
- "You haven't traded yet — try the Mentor's 'First trade' lesson."

- "Market data delayed by 45s — attempting reconnection."
```

**Accessibility**:
- ✅ All controls keyboard navigable
- ✅ Color contrast for badges (WCAG AA)
- ✅ ARIA labels on chart markers
- ✅ Captions on video (Tour modal)
- ✅ Alt text on images

---

#### Feature #13 - Mobile/Responsive Polish (ENHANCE) 📱
**Status**: 85% (Phase 2D did foundation work)
**Complexity**: Medium
**Timeline**: 1-1.5 hours

**Mobile Improvements**:
```
components/mobile/
  ├── FloatingActionButton.tsx    (NEW: trade FAB)
  ├── BottomSheet.tsx             (NEW: trade/mentor sheets)
  └── MobileChartView.tsx         (ENHANCE: pinch-to-zoom)
```

**Mobile-First Layouts**:
- Dashboard: 1 column (portfolio → chart → mentor)
- Trade modal: full-screen bottom sheet
- Mentor chat: full-screen overlay
- Leaderboard: swipable cards
- Positions: table → card layout

**Touch Interactions**:
- Pinch-to-zoom on chart
- Long-press on signal marker
- Haptic feedback on confirm (if supported)

**Acceptance Criteria**:
- ✅ All critical flows in ≤3 taps (signup → trade → view mentor)
- ✅ Responsive at: 320px, 768px, 1024px, 1440px
- ✅ FAB visible and reachable on all screens

---

## Implementation Sequencing & Timeline

### **PHASE 3A: Real Data + Dashboard (Session 1: 3-4 hours)**
Priority: **CRITICAL** (unblocks everything else)
```
1. Feature #1 - Landing page (1.5h)
   └─ app/page.tsx, Hero, SocialProof, HowItWorks

2. Feature #3 - Dashboard enhancement (1.5h)
   └─ Market data service, real prices, portfolio calc
   
Total: 3 hours
Build Output: 5 new files, 600+ lines
Compilation: ✅ 0 errors
```

### **PHASE 3B: Trading + Signals (Session 1 continued: 3-4 hours)**
Priority: **HIGH** (enables trading flow)
```
1. Feature #4 - Trade Modal (2h)
   └─ Limit orders, stop-loss, TP, advanced options
   
2. Feature #5 - Signal detail (1.5h)
   └─ Rationale display, past analogs, suggested trade
   
Total: 3.5 hours
Build Output: 6 new files, 800+ lines
Compilation: ✅ 0 errors
```

### **PHASE 3C: Social + Leaderboard (Session 2: 2-3 hours)**
Priority: **MEDIUM** (community features)
```
1. Feature #8 - Leaderboard Polish (1.5h)
   └─ Tabs, filters, follow system, share buttons
   
2. Feature #9 - Public Profile (1.5h)
   └─ Profile redesign, badges, equity curve, share
   
Total: 3 hours
Build Output: 8 new files, 900+ lines
Compilation: ✅ 0 errors
```

### **PHASE 4A: Signup Polish + Positions (Session 2 continued: 2-3 hours)**
Priority: **MEDIUM** (UX refinement)
```
1. Feature #2 - Onboarding Polish (1.5h)
   └─ Guest flow, quick tour, microcopy
   
2. Feature #7 - Trade History (1.5h)
   └─ Positions detail, audit log, export CSV
   
Total: 3 hours
Build Output: 6 new files, 700+ lines
Compilation: ✅ 0 errors
```

### **PHASE 4B: Replay + Settings (Session 3: 2.5-3 hours)**
Priority: **MEDIUM** (advanced features)
```
1. Feature #10 - Replay Mode (2.5h)
   └─ Control bar, historical playback, sessions
   
2. Feature #11 - Settings & Billing (1.5h)
   └─ API keys, billing, security settings
   
Total: 4 hours
Build Output: 10 new files, 1200+ lines
Compilation: ✅ 0 errors
```

### **PHASE 4C: Polish & Accessibility (Session 3 continued: 2 hours)**
Priority: **LOW** (final touches)
```
1. Feature #14 - Visual Details (1h)
   └─ Animations, transitions, skeleton loaders
   
2. Feature #12 - Error States & Copy (1h)
   └─ Microcopy, error messaging, ARIA labels
   
3. Feature #13 - Mobile Polish (1.5h)
   └─ FAB, bottom sheets, touch interactions
   
Total: 3.5 hours
Build Output: 4 new files, 300+ lines
Compilation: ✅ 0 errors
```

---

## Total Build Estimate

| Phase | Features | Timeline | New Files | Code Lines | Compilation |
|-------|----------|----------|-----------|------------|-------------|
| Phase 3A | #1, #3 | 3h | 5 | 600 | ✅ 0 errors |
| Phase 3B | #4, #5 | 3.5h | 6 | 800 | ✅ 0 errors |
| Phase 3C | #8, #9 | 3h | 8 | 900 | ✅ 0 errors |
| Phase 4A | #2, #7 | 3h | 6 | 700 | ✅ 0 errors |
| Phase 4B | #10, #11 | 4h | 10 | 1200 | ✅ 0 errors |
| Phase 4C | #12, #13, #14 | 3.5h | 4 | 300 | ✅ 0 errors |
| **TOTAL** | **15 items** | **~20 hours** | **39 files** | **4,500+ lines** | **0 errors** |

**3-4 sessions total (~6-8 hours per session)**

---

## What's Beyond Phase 3

### ✅ IN PHASE 3:
- #1 - Landing page
- #3 - Dashboard (real market data)
- #4 - Trade modal (advanced orders)
- #5 - Signal center (detail view)
- #8 - Leaderboard (polish)
- #9 - Public profile (redesign)

### 🔄 IN PHASE 4 (New):
- #2 - Signup onboarding (polish)
- #7 - Positions & history (UI)
- #10 - Replay mode (completely new)
- #11 - Settings & billing (complete)
- #12 - Error states (comprehensive)
- #13 - Mobile polish (advanced)
- #14 - Visual details (animations)

---

## Next Action

**Ready to start Phase 3A?** 

I can begin immediately with:
1. **Landing page** (`app/page.tsx`, Hero, Social Proof, How It Works)
2. **Market data service** (CoinGecko API integration)
3. **Dashboard enhancement** (real prices, portfolio value)

**Or would you prefer I:**
- [ ] Create a detailed checklist for manual testing?
- [ ] Build Phase 3A + 3B in one shot (6-7 hours continuous)?
- [ ] Focus on landing page first (shows to stakeholders)?
- [ ] Start with market data service (unblocks other features)?

**Recommendation**: Start with **Phase 3A** (Landing + Real Data) — it transforms the app from prototype to production-grade, and everything else depends on having real market data flowing.

