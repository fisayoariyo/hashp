# Hashmar CropEx Farmer App

A mobile-first React application providing Nigerian smallholder farmers with a digital identity, farm tracking, and access to financial services.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 (Vite) |
| Routing | React Router DOM v6 |
| Styling | Tailwind CSS v3 |
| Icons | Lucide React |
| State | React Context + hooks |
| Persistence | localStorage via `useLocalStorage` |
| Data | Static mock (Phase 1) — swap via `src/services/api.js` |

---

## Quick Start

```bash
npm install
npm run dev
```

### Test Login Credentials
| Field | Value |
|---|---|
| Phone | `08012345678` |
| OTP | `1234` |

---

## Project Structure

```
src/
├── App.jsx                     # Root router with all routes
├── main.jsx                    # React entry point
├── index.css                   # Tailwind base + global styles
│
├── constants/
│   └── routes.js               # ROUTES — all path strings as named constants
│
├── context/
│   ├── AuthContext.jsx          # isAuthenticated, login(), logout(), farmerID, token
│   ├── ToastContext.jsx         # Global toast: success/error/info/warning, auto-dismiss
│   └── index.js                # Barrel export
│
├── data/
│   └── farmerMock.js           # All static mock data (Phase 1)
│
├── hooks/
│   ├── useActivities.js        # Fetch recent farm activities
│   ├── useClipboard.js         # clipboard.writeText with toast feedback
│   ├── useFarmer.js            # Fetch full farmer profile
│   ├── useFarmerID.js          # Fetch digital ID card data
│   ├── useFarms.js             # Fetch farmer's farm list
│   ├── useHelp.js              # Fetch FAQs and support contact
│   ├── useLocalStorage.js      # Persist values in localStorage
│   ├── useNotifications.js     # Fetch notifications + unreadCount
│   ├── useScrollToTop.js       # Scroll to top on route change
│   └── index.js                # Barrel export
│
├── screens/
│   ├── SplashScreen.jsx        # / — Logo + farm background, auto-advances
│   ├── OnboardingScreen.jsx    # /onboard — 3-slide swipeable onboarding
│   ├── VerifyScreen.jsx        # /verify — Phone number login
│   ├── OTPScreen.jsx           # /otp — 4-digit OTP with resend countdown
│   ├── HomeScreen.jsx          # /home — Dashboard (protected)
│   ├── FarmerIDScreen.jsx      # /id-card — Digital ID card + QR (protected)
│   ├── ProfileScreen.jsx       # /profile — Read-only farmer profile (protected)
│   ├── UpdatesScreen.jsx       # /updates — Notifications list (protected)
│   ├── HelpScreen.jsx          # /help — FAQs + support contacts (protected)
│   ├── FarmsScreen.jsx         # /farms — Farm list + weather card (protected)
│   ├── ActivitiesScreen.jsx    # /activities — Full activity log + filter (protected)
│   └── NotFoundScreen.jsx      # * — 404 fallback
│
├── components/
│   ├── BottomNav.jsx           # Fixed 2-tab nav (Home, My Profile)
│   ├── WelcomeHeader.jsx       # Name, Farmer ID copy, notification bell
│   ├── FarmWeatherCard.jsx     # Dark green weather + farm info card
│   ├── AddFarmBanner.jsx       # Green CTA banner → /farms
│   ├── FarmCard.jsx            # Farm summary row card
│   ├── ActivityItem.jsx        # Activity row with emoji, title, acres, date
│   ├── ActivityBox.jsx         # Square selectable activity card
│   ├── CropTypeCard.jsx        # Square selectable crop card
│   ├── SoilTypeCard.jsx        # Square selectable soil card
│   ├── FaceVerification.jsx    # Face capture row (idle / verified states)
│   ├── QRCodeModal.jsx         # Full-screen QR expand modal
│   ├── ConfirmModal.jsx        # Bottom-sheet confirm dialog
│   ├── Button.jsx              # 4 variants: amber, green, outline, dark
│   ├── InputField.jsx          # Labelled input with prefix + error state
│   ├── PageHeader.jsx          # Back button + optional centered title
│   ├── EmptyState.jsx          # Emoji + title + subtitle + CTA
│   ├── ProtectedRoute.jsx      # Auth guard — redirects to /verify
│   ├── Skeleton.jsx            # CardSkeleton, WeatherCardSkeleton, ActivitySkeleton, ProfileRowSkeleton
│   └── index.js                # Barrel export
│
├── services/
│   └── api.js                  # All API contracts (swap mock → real here)
│
└── utils/
    └── helpers.js              # formatDate, maskPhone, getCropEmoji, buildShareURLs, etc.
```

---

## Authentication Flow

```
/ (Splash)
  → /onboard (3 slides, swipeable)
    → /verify (phone number)
      → /otp (4-digit code, resend timer)
        → /home (authenticated)
```

- Auth state stored in `localStorage` via `AuthContext`
- Keys: `hcx_token`, `hcx_farmer_id`
- All routes under `/home`, `/id-card`, `/profile`, etc. are protected via `ProtectedRoute`
- Logout clears both keys and redirects to `/verify`

---

## Connecting a Real Backend

All API calls live in `src/services/api.js`. Each function has a clear contract:

```js
// Replace mock with real call:
export const getFarmerByPhone = async (phone) => {
  const res = await fetch(`${API_BASE}/auth/request-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });
  return res.json(); // { farmerID, name, status }
};
```

Mock data lives in `src/data/farmerMock.js` and is **only** imported by `src/services/api.js`. No screen or component imports mock data directly.

---

## Design System

### Colors (Tailwind tokens)
| Token | Value | Usage |
|---|---|---|
| `brand-green` | `#155235` | Primary brand, buttons, nav active |
| `brand-green-dark` | `#0d3d27` | Hover states |
| `brand-green-light` | `#1a6645` | Secondary accents |
| `brand-green-muted` | `#e8f4ee` | Icon backgrounds, subtle fills |
| `brand-amber` | `#d4900a` | CTA buttons (Add Farm, etc.) |
| `brand-bg-page` | `#f2f2f0` | App background |
| `brand-border` | `#e5e7eb` | Input and card borders |

### Fonts
- **Display**: Outfit (headings, labels, buttons)
- **Body**: DM Sans (body text, inputs, metadata)

### Reusable CSS classes (index.css)
```css
.btn-primary       /* Full-width green rounded button */
.btn-amber         /* Full-width amber rounded button */
.btn-outline       /* Full-width white/green outlined button */
.card              /* White rounded card with shadow */
.page-container    /* Full-height flex column, max-w-sm centered */
.page-content      /* Flex-1 padded content area with bottom nav clearance */
.input-field       /* Styled text input */
.section-title     /* Bold section heading */
.label-sm          /* Small muted label */
.value-md          /* Medium weight value text */
```

---

## Phase 1 Scope

Per PRD Phase 1 — these features are intentionally **excluded**:

- ❌ Self-registration (agent-only enrollment)
- ❌ Farm mapping interaction
- ❌ Loan application flow
- ❌ Marketplace usage
- ❌ Profile editing by farmer

All screens are **read-only**. Profile updates are agent-driven.

---

## Scripts

```bash
npm run dev       # Start dev server (http://localhost:5173)
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
```
