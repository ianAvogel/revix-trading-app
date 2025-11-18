# Revix Trading App - Build Validation & Completion Plan

**Date**: November 18, 2025  
**Status**: Architecture Complete, Features Partially Implemented  
**Objective**: Complete all 15 feature categories for MVP launch

---

## Part 1: Current Implementation Status

### ✅ Already Implemented

| Feature | Status | Coverage | Notes |
|---------|--------|----------|-------|
| **1. Landing Page** | ✅ 80% | Hero, CTA, Tour modal | Needs social proof row, how-it-works cards, footer |
| **2. Signup/Onboarding** | ✅ 60% | Auth flow exists | Needs 3-step wizard, preferences UI, tour carousel |
| **3. Dashboard** | ✅ 50% | Layout shell exists | Needs chart integration, mentor card, activity feed |
| **4. Trade Modal** | ✅ 40% | Component exists | Needs validation, preview box, risk helper |
| **5. Signal Center** | ✅ 30% | Routes exist | Needs filter UI, list view, detail drawer |
| **6. AI Mentor Chat** | ✅ 20% | Route exists | Needs chat UI, context toggle, quick prompts |
| **7. Portfolio/History** | ✅ 60% | Routes exist | Needs UI shell, export CSV, filters |
| **8. Leaderboard** | ✅ 50% | Route + component | Needs tournament logic, weekly views |
| **9. Public Profile** | ⚠️ 10% | Route exists | Needs UI, privacy controls, share buttons |
| **10. Replay/Time-Shift** | ✅ 0% | Not started | MVP v2 feature - queue for later |
| **11. Settings** | ✅ 0% | Route shell exists | Needs preferences, billing, API keys, security |
| **12. Error States** | ⚠️ 30% | Partial error handling | Needs comprehensive error displays, microcopy |
| **13. Mobile Responsive** | ⚠️ 40% | Tailwind responsive classes | Needs mobile-specific optimizations |
| **14. Animations** | ✅ 0% | No Framer Motion yet | Added to dependencies - needs implementation |
| **15. Performance** | ✅ 90% | Prisma + Accelerate optimized | Build passing, Optimize monitoring active |

**Overall**: ~35% feature complete, ~65% remaining

### ✅ Infrastructure (Complete)

- ✅ Next.js 15 setup
- ✅ Prisma ORM with 13 models
- ✅ PostgreSQL via Accelerate
- ✅ NextAuth.js authentication
- ✅ 19 API routes scaffolded
- ✅ Tailwind CSS + shadcn/ui
- ✅ Framer Motion installed
- ✅ TypeScript strict mode
- ✅ Prisma Optimize monitoring
- ✅ Git + GitHub (ianAvogel/revix-trading-app)

---

## Part 2: MVP Feature Priority & Build Order

### Phase 1: Critical Path (Week 1-2)
**Goal**: Get app to MVP launch state - deployable product with core trading flow

#### 1.1 Signup → Dashboard → Trade → History flow (100% UX)
- [ ] **Complete Signup/Onboarding (3-step wizard)**
  - Step 1: Email/Password + OAuth
  - Step 2: Experience level + Assets selection + Notifications
  - Step 3: Quick carousel tour
  - Deliverable: New user → VirtualAccount auto-created
  
- [ ] **Complete Dashboard**
  - Portfolio card: Equity, Cash, ROI, Quick actions
  - Chart integration (TradingView Lightweight or simple canvas)
  - Mentor card: Latest signal + confidence + CTA
  - Activity feed: Recent trades + signals
  - Deliverable: Real-time equity updates
  
- [ ] **Complete Trade Modal**
  - Order form: Pair, Buy/Sell, Market/Limit, Amount, Advanced
  - Preview box: Estimated price, fees, slippage
  - Validation: Amount check, limit price check
  - Confirmation & execution logging
  - Deliverable: Place order → Trade created + audit log
  
- [ ] **Portfolio/Trade History UI**
  - Tabbed: Open Positions / Closed Trades
  - List + Detail modal with audit log
  - Export CSV button
  - Deliverable: View trades + export

**Time**: 5-7 days | **Resources**: 1-2 engineers

---

#### 1.2 API Refinement & Data Models
- [ ] **Verify/Update Prisma schema**
  - Check Position model for open/closed state tracking
  - Add execution_price, slippage_realized to Trade
  - Add mentor_feedback to Trade (optional for MVP)
  - Deliverable: Schema matches trade execution flow
  
- [ ] **Implement Trade Execution API** (`POST /api/trades/execute`)
  - Validate order (balance, size, price)
  - Generate execution with realistic slippage
  - Log to trades_audit with server timestamp
  - Update position and virtual_account equity
  - Return execution details to frontend
  - Deliverable: Tested endpoint in staging
  
- [ ] **Implement Positions API** (`GET /api/portfolio/positions`)
  - Return open positions with current market price
  - Calculate unrealized PnL
  - Deliverable: Dashboard chart and position list fed
  
- [ ] **Implement Market Data API** (`GET /api/market/prices`)
  - Return latest price for pair + chart history
  - Consider caching strategy (Accelerate)
  - Deliverable: Chart data populates

**Time**: 3-4 days | **Resources**: 1 backend engineer

---

#### 1.3 Signal System MVP
- [ ] **Implement Signal Fetching** (`GET /api/signals`)
  - Return latest signals filtered by user preferences
  - Include confidence, symbol, direction, rationale
  - Deliverable: Mentor card shows top signal
  
- [ ] **Save Signal** (`POST /api/signals/save`)
  - Add signal to user watchlist
  - Deliverable: Users can save signals

**Time**: 2 days | **Resources**: 1 backend engineer

---

#### 1.4 Landing Page Polish
- [ ] Add social proof row (user count, avg ROI, media logos)
- [ ] Add "How it works" 3-card section
- [ ] Add footer with links
- [ ] Add skeleton loaders for slow connections
- [ ] Deliverable: Production-ready landing

**Time**: 1-2 days | **Resources**: 1 frontend engineer

**Phase 1 Total**: ~10-15 days, 2 engineers

---

### Phase 2: Core Features (Week 3-4)
**Goal**: Add depth and virality

#### 2.1 AI Mentor Chat
- [ ] **Build Chat UI**
  - Message list component
  - Text input + quick prompts
  - Context selector (Global/Account/Trade)
  - Responsive drawer or full-screen
  
- [ ] **Implement Mentor API** (`POST /api/mentor/message`)
  - Rate limiting (10/hour)
  - Context-aware LLM call (Groq/Anthropic)
  - Return mentor advice with action buttons
  - Deliverable: Users can ask questions about their trades

**Time**: 4-5 days | **Resources**: 1 frontend + 1 backend

---

#### 2.2 Signal Center (Full Feature)
- [ ] **Build Filter UI**
  - Symbol multi-select
  - Confidence slider
  - Timeframe toggle
  
- [ ] **Signal List & Detail Drawer**
  - Infinite scroll list
  - Detail: full explanation, feature importance chart, past analogs
  - Apply signal → prefills trade modal
  - Save signal → watchlist
  
- [ ] **API: Signal Details** (`GET /api/signals/:id`)
  - Return full signal data + past analogs
  - Deliverable: Rich signal browsing experience

**Time**: 5-6 days | **Resources**: 1 frontend + 1 backend

---

#### 2.3 Leaderboard & Tournaments
- [ ] **Build Leaderboard UI**
  - Tabs: Global / Friends / Weekly
  - Rank, alias, ROI, max drawdown, share button
  
- [ ] **Tournament Creation & Join**
  - Modal: name, start/end, rules, entry fee
  - List view of active tournaments
  - Join flow: register account instance
  
- [ ] **API Updates**
  - `GET /api/leaderboard` (parameterized by view)
  - `POST /api/tournaments` (create)
  - `POST /api/tournaments/:id/join` (already scaffolded)
  - Deliverable: Competitive play possible

**Time**: 4-5 days | **Resources**: 1 frontend + 1 backend

---

#### 2.4 Settings & Preferences
- [ ] **Build Settings UI**
  - Profile: display name, avatar, email
  - Notifications: email / Telegram toggles
  - API Keys: generate, show last 4, revoke
  - Billing: plan, invoices, upgrade/downgrade
  - Security: password change, 2FA
  
- [ ] **API: Settings Endpoints**
  - `PUT /api/users/preferences`
  - `POST /api/auth/api-keys` (create)
  - `DELETE /api/auth/api-keys/:id` (revoke)
  - Deliverable: Users control their experience

**Time**: 3-4 days | **Resources**: 1 frontend + 1 backend

---

**Phase 2 Total**: ~18-20 days, 2 engineers (overlapping)

---

### Phase 3: Polish & Launch (Week 5)
**Goal**: Shipping quality

#### 3.1 Mobile Responsiveness
- [ ] Test all flows at 320px, 768px, 1024px, 1440px
- [ ] Optimize dashboard for mobile: single column layout
- [ ] Trade modal: full-screen sheet on mobile
- [ ] Leaderboard: swipable cards
- [ ] Deliverable: All flows ≤3 taps on mobile

**Time**: 2-3 days | **Resources**: 1 frontend

---

#### 3.2 Animations & UX Polish
- [ ] Mentor card: slide-in animation on new signal (Framer Motion)
- [ ] Trade confirm: close modal + toast + expand animation
- [ ] Leaderboard: pulse animation on rank changes
- [ ] Skeleton loaders on all data fetches
- [ ] Deliverable: Polished, modern feel

**Time**: 2-3 days | **Resources**: 1 frontend

---

#### 3.3 Accessibility & Error Handling
- [ ] Comprehensive error boundaries on all screens
- [ ] Error microcopy: helpful, actionable, code display
- [ ] ARIA labels on all interactive elements
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Color contrast checks on buy/sell pills, confidence badges
- [ ] Captions on any videos
- [ ] Deliverable: WCAG 2.1 AA compliant

**Time**: 2-3 days | **Resources**: 1 frontend

---

#### 3.4 Performance & Monitoring
- [ ] Verify initial load <2.5s on 4G (use Lighthouse)
- [ ] Verify interaction latency <200ms (measure via Optimize)
- [ ] Set up error monitoring (Sentry optional, but good)
- [ ] Verify Prisma Optimize collecting query data
- [ ] Cache strategy review (Accelerate cache hints)
- [ ] Deliverable: Production-ready performance

**Time**: 1-2 days | **Resources**: 1 devops + 1 backend

---

#### 3.5 Seed Data & QA
- [ ] Seed database: sample users, trades, signals, tournaments
- [ ] Full UX regression test (checklist from spec)
- [ ] Cross-browser test (Chrome, Firefox, Safari, Edge)
- [ ] Deliverable: No critical bugs

**Time**: 2-3 days | **Resources**: 1 QA + 1 backend

---

**Phase 3 Total**: ~8-12 days, 2-3 engineers (mostly QA)

---

## Part 3: Implementation Details by Feature

### Feature 1: Landing Page

**Files to Update**:
- `components/landing/LandingShell.tsx` - Add sections
- Create `components/landing/SocialProof.tsx` - Logos + stats
- Create `components/landing/HowItWorks.tsx` - 3 card grid
- Create `components/landing/Footer.tsx` - Links

**API Calls**: None (static)

**Acceptance Criteria**:
- [ ] CTAs visible above fold at 1280×720
- [ ] Tour modal plays video
- [ ] Click "Start demo" routes to /signup

---

### Feature 2: Signup/Onboarding

**Files to Create/Update**:
- `app/(auth)/signup/page.tsx` - Route wrapper
- Create `components/auth/SignupStep1.tsx` - Email, password, OAuth, guest toggle
- Create `components/auth/SignupStep2.tsx` - Experience level, assets, notifications
- Create `components/auth/SignupStep3.tsx` - Carousel tour
- Create `components/auth/SignupWizard.tsx` - State management

**API Endpoints**:
- `POST /api/auth/register` - Create user + virtual account
- Update `POST /api/users/preferences` - Save step 2 data

**Database**:
- Ensure User model has experience_level, preferred_assets, notification_settings
- VirtualAccount auto-created on registration

**Acceptance Criteria**:
- [ ] New user appears in DB after step 3
- [ ] VirtualAccount created with $50K equity
- [ ] User lands on /dashboard after completion
- [ ] Guest flow works with persistent cookie

---

### Feature 3: Dashboard

**Files to Create/Update**:
- `components/dashboard/DashboardShell.tsx` - Main layout
- Create `components/dashboard/PortfolioCard.tsx` - Equity, cash, ROI, quick actions
- Create `components/dashboard/ChartWidget.tsx` - Chart integration (integrate TradingView or simple canvas)
- Create `components/dashboard/MentorCard.tsx` - Already exists, add latest signal integration
- Create `components/dashboard/ActivityFeed.tsx` - Recent trades + signals
- Update `app/dashboard/page.tsx` - Fetch real account data

**API Calls**:
- `GET /api/accounts/me` - Fetch user's virtual account
- `GET /api/market/prices?symbol=BTC` - Chart data
- `GET /api/signals?limit=1` - Top signal
- `GET /api/portfolio/positions` - Open positions
- `GET /api/trades/my-trades?limit=5` - Recent trades

**Acceptance Criteria**:
- [ ] Dashboard updates within 2s of market tick
- [ ] Mentor card shows latest global signal
- [ ] Chart renders and accepts signal toggles
- [ ] Clicking chart opens expanded modal
- [ ] Portfolio card shows real equity

---

### Feature 4: Trade Modal

**Files to Create/Update**:
- `components/trade/TradeModal.tsx` - Already exists, expand it
- Create `components/trade/OrderForm.tsx` - Pair, buy/sell, market/limit, amount
- Create `components/trade/PreviewBox.tsx` - Estimated price, fees, slippage
- Create `components/trade/RiskHelper.tsx` - Position size guide
- Update validation logic

**API Calls**:
- `POST /api/trades/execute` - Place order
- `GET /api/market/prices?symbol=BTC` - Get current price for validation

**Backend Logic**:
- Validate order: amount > 0, amount <= buying_power
- Validate limit: price within 10% of last tick
- Calculate fees and slippage
- Create Trade + TradeAudit entry
- Update VirtualAccount equity + Position

**Acceptance Criteria**:
- [ ] Order POST creates Trade record
- [ ] Audit log created with timestamp
- [ ] Positions update in real-time
- [ ] Validation errors shown inline
- [ ] Insufficient balance greys out confirm

---

### Feature 5: Signal Center

**Files to Create/Update**:
- Create `components/signals/SignalFilters.tsx` - Symbol, confidence, timeframe
- Create `components/signals/SignalsList.tsx` - Already exists, add infinite scroll
- Create `components/signals/SignalDetail.tsx` - Full explanation, past analogs, CTA
- Create `app/signals/page.tsx` - Main signals page

**API Calls**:
- `GET /api/signals?symbol=BTC&confidence_min=0.7&limit=50&offset=0` - Paginated list
- `GET /api/signals/:id` - Full detail

**Acceptance Criteria**:
- [ ] Filters update list within 300ms
- [ ] Infinite scroll loads new items
- [ ] Signal detail shows rationale
- [ ] "Apply" button prefills trade modal
- [ ] "Save" button adds to watchlist

---

### Feature 6: AI Mentor Chat

**Files to Create/Update**:
- Create `components/mentor/ChatDrawer.tsx` - Already referenced, build it
- Create `components/mentor/MessageList.tsx` - Messages with actions
- Create `components/mentor/ChatInput.tsx` - Text + quick prompts

**API Calls**:
- `POST /api/mentor/message` - Send question, get response

**Backend Logic**:
- Rate limit: 10 requests/hour per user
- LLM call (Groq/Anthropic with context)
- Return advice + action buttons (e.g., "Create stop-loss")
- Action buttons create prefilled trade modal entries

**Acceptance Criteria**:
- [ ] Chat returns response within 5s
- [ ] Rate limit enforced with friendly error
- [ ] Action buttons create prefilled trades
- [ ] Context-aware responses (account, trade, global)

---

### Feature 7: Portfolio/Trade History

**Files to Create/Update**:
- Create `components/portfolio/PortfolioTabs.tsx` - Tabs: Open / Closed
- Create `components/portfolio/TradeRow.tsx` - Symbol, qty, entry, exit, PnL, mentor icon
- Create `components/portfolio/TradeDetail.tsx` - Audit log, mentor feedback, chart markers
- Update `app/portfolio/page.tsx`

**API Calls**:
- `GET /api/portfolio/positions` - Open positions
- `GET /api/portfolio/history` - Closed trades
- `GET /api/trades/export` - CSV export

**Acceptance Criteria**:
- [ ] Open positions show current market price
- [ ] Closed trades show PnL $ and %
- [ ] CSV export matches audit log
- [ ] Trade detail shows execution markers on chart

---

### Feature 8: Leaderboard & Tournaments

**Files to Create/Update**:
- Create `components/leaderboard/LeaderboardTabs.tsx` - Tabs: Global / Friends / Weekly
- Create `components/leaderboard/LeaderboardRow.tsx` - Rank, alias, ROI, drawdown, share
- Create `components/leaderboard/TournamentList.tsx` - Active tournaments
- Create `components/leaderboard/TournamentModal.tsx` - Create tournament
- Update `app/leaderboard/page.tsx`

**API Calls**:
- `GET /api/leaderboard?view=global|friends|weekly` - Leaderboard list
- `GET /api/tournaments` - Active tournaments
- `POST /api/tournaments` - Create tournament
- `POST /api/tournaments/:id/join` - Join tournament

**Database**:
- Leaderboard calculates hourly via cron or on-demand aggregation
- Tournament has participants, start/end, rules

**Acceptance Criteria**:
- [ ] Leaderboard updates hourly
- [ ] Tournament registration creates entry
- [ ] Share buttons copy tweet/telegram text
- [ ] Can filter leaderboard by friends

---

### Feature 9: Public Profile

**Files to Create/Update**:
- Create `app/u/[alias]/page.tsx` - Public profile (route exists, needs UI)
- Create `components/public/PublicProfile.tsx` - Avatar, stats, trades, badges

**API Calls**:
- `GET /api/users/:alias/profile?public=true` - Public data only

**Security**:
- Only show trades/stats marked as public
- Add privacy toggle to settings

**Acceptance Criteria**:
- [ ] Public page accessible without auth
- [ ] Trade timestamps match audit log
- [ ] Share buttons work

---

### Feature 10: Replay/Time-Shift Mode

**Status**: MVP v2 feature - defer after launch

---

### Feature 11: Settings

**Files to Create/Update**:
- Create `components/settings/SettingsShell.tsx`
- Create `components/settings/ProfileSection.tsx` - Name, avatar, email
- Create `components/settings/NotificationsSection.tsx` - Toggles
- Create `components/settings/APIKeysSection.tsx` - Generate, revoke
- Create `components/settings/BillingSection.tsx` - Plan, invoices
- Create `components/settings/SecuritySection.tsx` - Password, 2FA
- Update `app/settings/page.tsx`

**API Calls**:
- `PUT /api/users/preferences` - Update profile + notifications
- `POST /api/auth/api-keys` - Generate key
- `DELETE /api/auth/api-keys/:id` - Revoke key

**Acceptance Criteria**:
- [ ] Settings persist to DB
- [ ] API keys show last 4 chars
- [ ] Users can revoke keys
- [ ] Notifications toggle updates subscription

---

### Features 12-15: Error States, Mobile, Animations, Performance

**Cross-cutting concerns**:
- [ ] Every page has error boundary
- [ ] Every API call has error handling
- [ ] Mobile breakpoints: 320, 768, 1024, 1440
- [ ] Framer Motion on key interactions
- [ ] Lighthouse score >90 on initial load

---

## Part 4: Development Workflow

### Branch Strategy

```
main (production-ready)
├── feature/landing-page-polish
├── feature/signup-wizard
├── feature/dashboard-v2
├── feature/trade-modal-complete
├── feature/signals-center
├── feature/mentor-chat
├── feature/leaderboard-tournaments
├── feature/settings
└── feature/mobile-responsive
```

**Workflow**:
1. Create feature branch from `main`
2. Commit frequently with descriptive messages
3. Push to GitHub
4. Create PR with description + testing checklist
5. Review + merge to `main`
6. Deploy to staging
7. Run acceptance tests
8. Deploy to production when ready

---

### Testing Checklist (Per Feature)

For each feature:
- [ ] All CTAs function and route correctly
- [ ] Forms validate and show errors
- [ ] API calls return expected data
- [ ] Errors handled with user-facing messaging
- [ ] Responsive at 4 breakpoints
- [ ] Keyboard navigation works
- [ ] ARIA labels present
- [ ] No console errors

---

## Part 5: Deployment & Launch Checklist

### Pre-Launch (Week 5)
- [ ] All 15 features at acceptance criteria (or deferred to v2)
- [ ] Build passes: `npm run build`
- [ ] No TypeScript errors
- [ ] Prisma Optimize showing query metrics
- [ ] Accelerate connection tested in staging
- [ ] Database migrations applied
- [ ] Seed data loaded
- [ ] Error monitoring configured (optional: Sentry)
- [ ] Environment variables set in production
- [ ] SSL certificate configured
- [ ] Staging environment fully tested

### Launch Day
- [ ] Deploy to production
- [ ] Verify all endpoints responding
- [ ] Monitor error rates (first 24h critical)
- [ ] Check Prisma Cloud dashboard for anomalies
- [ ] Verify Optimize is collecting data
- [ ] Monitor database performance

### Post-Launch (Week 6+)
- [ ] Collect user feedback
- [ ] Monitor metrics: signup → trade conversion, session duration, churn
- [ ] Fix critical bugs within 24h
- [ ] Plan Phase 2 (replay mode, advanced mentor, exchange integration)

---

## Part 6: Estimated Timeline

| Phase | Duration | Effort | Status |
|-------|----------|--------|--------|
| Phase 1: Critical Path | 10-15 days | 2 engineers | Ready to start |
| Phase 2: Core Features | 18-20 days | 2 engineers | After Phase 1 |
| Phase 3: Polish & Launch | 8-12 days | 2-3 engineers | Parallel with Phase 2 QA |
| **Total MVP** | **~35-40 days** | **2-3 FTE** | **4-6 weeks** |

**Optimal Timeline**: Start Phase 1 immediately, Phase 2 features can overlap. Launch ready by Week 6.

---

## Part 7: Known Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Database schema changes mid-project | High | Lock schema early, use migrations |
| Market data API unreliability | High | Mock API for staging, circuit breaker |
| LLM latency for mentor | Medium | Cache responses, async processing |
| WebSocket connection drops | Medium | Graceful polling fallback (already planned) |
| Mobile responsiveness issues | Medium | Test early and often at breakpoints |
| Performance regression | Low | Monitor Optimize metrics, Lighthouse CI |

---

## Summary

**Current State**: 35% feature complete, production infrastructure 90% ready

**Next 48 Hours**:
1. Start Feature 1 & 2: Landing page polish + Signup wizard
2. Verify all API routes working (manual tests)
3. Create feature branches in GitHub
4. Set up code review checklist

**Next 2 Weeks**: Complete Phase 1 (critical path to MVP)

**Next 4-6 Weeks**: Launch-ready product with all 14 features (Replay deferred to v2)

---

**Questions?** Each feature has detailed acceptance criteria. Start with Phase 1 tasks above.
