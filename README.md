Hashmar CropEx Farmer App

Boss, nice to work with you!

This is a mobile-first React app that gives Nigerian smallholder farmers a digital identity they can carry in their pocket.

---

The Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 (Vite) |
| Routing | React Router DOM v6 |
| Styling | Tailwind CSS v3 |
| Icons | Lucide React |
| State | React Context + hooks |
| Data | Static mock (Phase 1) — swap via src/services/api.js |

---

Start here my Oga

```bash
npm install
npm run dev
```

Test login credentials:
- Phone: 08012345678
- OTP: 1234

---

This is the Project Structure my boss, shey you like sharwarma?

```
src/
├── App.jsx                     # Root router with all routes
├── main.jsx                    # React entry point
├── index.css                   # Tailwind base + global styles
│
├── constants/
│   └── routes.js               # All route paths in one place
│
├── context/
│   ├── AuthContext.jsx          # Login, logout, auth state
│   ├── ToastContext.jsx         # Global toast notifications
│   └── index.js
│
├── data/
│   └── farmerMock.js           # All mock data lives here (Phase 1)
│
├── hooks/
│   ├── useActivities.js        # Farm activities
│   ├── useClipboard.js         # Copy to clipboard
│   ├── useFarmer.js            # Farmer profile
│   ├── useFarmerID.js          # Digital ID card data
│   ├── useFarms.js             # Farm list
│   ├── useHelp.js              # FAQs and support contacts
│   ├── useLocalStorage.js      # Persist to localStorage
│   ├── useNotifications.js     # Notifications + unread count
│   ├── useScrollToTop.js       # Scroll to top on route change
│   └── index.js
│
├── screens/
│   ├── SplashScreen.jsx        # / — Logo screen, auto-advances
│   ├── OnboardingScreen.jsx    # /onboard — 3 swipeable slides
│   ├── VerifyScreen.jsx        # /verify — Phone number input
│   ├── OTPScreen.jsx           # /otp — 4-digit code + resend timer
│   ├── HomeScreen.jsx          # /home — Main dashboard
│   ├── FarmerIDScreen.jsx      # /id-card — Digital ID + QR code
│   ├── ProfileScreen.jsx       # /profile — Read-only farmer info
│   ├── UpdatesScreen.jsx       # /updates — Notifications list
│   ├── HelpScreen.jsx          # /help — FAQs + support contacts
│   ├── FarmsScreen.jsx         # /farms — Farm list + weather
│   ├── ActivitiesScreen.jsx    # /activities — Activity log + filter
│   └── NotFoundScreen.jsx      # * — 404 page
│
├── components/
│   ├── BottomNav.jsx           # Fixed bottom nav (Home, My Profile)
│   ├── WelcomeHeader.jsx       # Farmer name, ID copy, bell icon
│   ├── FarmWeatherCard.jsx     # Green weather + farm info card
│   ├── AddFarmBanner.jsx       # CTA banner to add a farm
│   ├── FarmCard.jsx            # Farm summary row
│   ├── ActivityItem.jsx        # Activity row with icon and date
│   ├── ActivityBox.jsx         # Square activity selector card
│   ├── CropTypeCard.jsx        # Square crop selector card
│   ├── SoilTypeCard.jsx        # Square soil selector card
│   ├── FaceVerification.jsx    # Face capture (idle / verified)
│   ├── QRCodeModal.jsx         # Full screen QR code view
│   ├── ConfirmModal.jsx        # Bottom sheet confirmation dialog
│   ├── Button.jsx              # 4 variants: amber, green, outline, dark
│   ├── InputField.jsx          # Input with label, prefix, error state
│   ├── PageHeader.jsx          # Back button + page title
│   ├── EmptyState.jsx          # Empty screen with CTA
│   ├── ProtectedRoute.jsx      # Redirects to /verify if not logged in
│   ├── Skeleton.jsx            # Loading skeleton components
│   └── index.js
│
├── services/
│   └── api.js                  # All API contracts — backend dev works here
│
└── utils/
    └── helpers.js              # formatDate, maskPhone, getCropEmoji, share URLs
```

---

This is how Login Works

```
/ (Splash)
  → /onboard (3 slides)
    → /verify (phone number)
      → /otp (4-digit code)
        → /home (logged in)
```

Auth state is stored in localStorage under two keys:
- hcx_token
- hcx_farmer_id

All screens after /home are protected. If someone visits them without logging in, they get sent back to /verify. Logout clears both keys.

---

My boss, easier for your backend work

All API functions are in src/services/api.js. Each one is a placeholder with a clear contract showing what it expects and what it should return. You only need to fill these in — no component files need to be touched.

Example of how to replace a mock function with a real API call:

```js
export const getFarmerByPhone = async (phone) => {
  const res = await fetch(`${API_BASE}/auth/request-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });
  return res.json(); // { farmerID, name, status }
};
```

Mock data is only in src/data/farmerMock.js and is only imported by src/services/api.js. No screen or component touches mock data directly.

---

Boss, Security Notes

> hcx_token and hcx_farmer_id are currently stored in localStorage.
> This is fine for Phase 1 (mock data, no real auth).
> Before going live with real authentication, the backend dev must migrate tokens to httpOnly cookies.
> localStorage is readable by any JavaScript running on the page and should never hold real auth tokens in production.

---

Check out the Design System my oga

Brand colors:

| Token | Hex | Used For |
|---|---|---|
| brand-green | #155235 | Buttons, nav active state, primary brand |
| brand-green-dark | #0d3d27 | Hover states |
| brand-green-light | #1a6645 | Secondary accents |
| brand-green-muted | #e8f4ee | Icon backgrounds, subtle fills |
| brand-amber | #d4900a | CTA buttons like Add Farm |
| brand-bg-page | #f2f2f0 | App background |
| brand-border | #e5e7eb | Input and card borders |

Fonts:
- Outfit — headings, labels, buttons
- DM Sans — body text, inputs, metadata

---

 What Is NOT in Phase 1, as per wetin deh prd

Per PRD, these are intentionally left out:

- Self-registration (farmers are enrolled by field agents only)
- Farm mapping
- Loan applications
- Marketplace
- Profile editing by the farmer

All screens are read-only. Any profile updates go through a field agent.

---

Here lies Scripts, you like poetry?

```bash
npm run dev       # Start dev server at http://localhost:5173
npm run build     # Build for production
npm run preview   # Preview production build locally
```