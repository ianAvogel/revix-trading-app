# Revix Trading App - Acceptance Test Plan

This document outlines the manual tests to be performed to verify the core functionality of the Revix Trading App.

## §1: User Authentication
- [ ] **Test 1.1: Sign Up**
  - Navigate to `/signup`.
  - Fill out the registration form.
  - **Expected:** User is redirected to the `/dashboard` and a new user is created in the database.
- [ ] **Test 1.2: Log In**
  - Navigate to `/login`.
  - Enter credentials for an existing user.
  - **Expected:** User is redirected to the `/dashboard`.
- [ ] **Test 1.3: Log Out**
  - From the dashboard, find and click the "Log Out" button.
  - **Expected:** User is redirected to the home page or login page.

## §2: Dashboard & Core UI
- [ ] **Test 2.1: Dashboard Loading**
  - Navigate to `/dashboard`.
  - **Expected:** The dashboard loads, showing the Virtual Account card, Chart, and Mentor card. All elements should fade in smoothly.
- [ ] **Test 2.2: Quick Trade Modal**
  - Click the "Quick Trade" button.
  - **Expected:** The trade modal opens.
  - Execute a small "BUY" trade for BTC.
  - **Expected:** A success notification appears, and the trade is reflected in the portfolio.

## §3: Portfolio Management
- [ ] **Test 3.1: View Open Positions**
  - Navigate to `/portfolio`.
  - Select the "Open Positions" tab.
  - **Expected:** The trade executed in Test 2.2 should be visible as an open position. The card should animate in.
- [ ] **Test 3.2: View Trade History**
  - From the trade modal, execute a "SELL" trade to close the BTC position.
  - Navigate to `/portfolio` and select the "Trade History" tab.
  - **Expected:** The closed BTC trade (both BUY and SELL legs) should be visible. The card should animate in.
- [ ] **Test 3.3: Export History**
  - Click the "Export to CSV" button.
  - **Expected:** A `trade-history.csv` file is downloaded.

## §4: Signal Center
- [ ] **Test 4.1: Filter Signals**
  - Navigate to `/signals`.
  - Enter "ETH" in the symbol filter.
  - **Expected:** The list updates to show only ETH signals.
- [ ] **Test 4.2: Save/Unsave Signal**
  - Click "Save" on a signal.
  - **Expected:** The button text changes to "Saved".
  - Click "Saved" on the same signal.
  - **Expected:** The button text changes back to "Save".
- [ ] **Test 4.3: View Signal Details**
  - Click "View" on a signal.
  - **Expected:** The `SignalDetailDrawer` opens from the side with details about the signal.

## §5: Leaderboard
- [ ] **Test 5.1: View Leaderboard**
  - Navigate to `/leaderboard`.
  - **Expected:** The global leaderboard is displayed with ranked users. The table animates in.

## §6: Replay / Time-Shift Mode
- [ ] **Test 6.1: Activate Replay Mode**
  - Navigate to `/dashboard`.
  - Open the calendar in the "Time Travel" card and select a date from the past week.
  - **Expected:** The account balance and ROI on the `VirtualAccountCard` should update to reflect the historical state. The chart should also show data from that time.
- [ ] **Test 6.2: Deactivate Replay Mode**
  - Click the "Go to Present" button.
  - **Expected:** The account balance and chart return to showing live data.

## §7: Settings
- [ ] **Test 7.1: Toggle Profile Privacy**
  - Navigate to `/settings`.
  - Toggle the "Public Profile" switch.
  - **Expected:** A success message appears, and the setting change is persisted. The card should animate in.
