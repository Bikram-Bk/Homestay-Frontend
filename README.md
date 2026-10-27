# Homestay Nepal — Traveler Frontend

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![MIT License](https://img.shields.io/badge/MIT%20License-yellow?style=flat)

> Public-facing web app for discovering and booking authentic Nepali homestays.

The traveler-facing storefront of **HomeStay Nepal**. Browse curated homestays across Nepal's heritage villages, read reviews, book your stay, pay via eSewa, and chat with an AI guide trained on local culture and travel knowledge.

---

## ✨ Features

### Public

- **Landing page** — hero, about, gallery, rooms, testimonials, booking CTA
- **Homestay discovery** — browse all listings, filter and sort
- **Homestay detail** — photo gallery, amenities, host profile, village and region
- **eSewa payment** — secure checkout with success and failure handling
- **AI chat guide** — floating widget answering homestay and village questions

### Authenticated & Security

- **Register / Login** — traveler accounts with bcrypt password hashing & show/hide eye toggle
- **Password reset** — 6-digit OTP-based recovery email flow via Brevo
- **Booking management** — create, view, auto-expiry cancellation, and manual cancellation
- **eSewa payment** — automated hidden form submission to eSewa ePay v2 sandbox & callback verification
- **Reviews** — rate and review stays after booking confirmation
- **Notifications** — in-app notifications bell for booking, payment, and approval events
- **Profile dashboard** — account details, password change, and booking timeline

### Platform

- **JWT auth** — access token kept safely in memory, refresh token in httpOnly signed cookies
- **Auto token refresh** — silent retry on `401` with request queueing
- **Optimistic caching** — TanStack Query for all server state
- **Responsive design** — mobile-first warm Nepali cultural aesthetic using Tailwind CSS

---

## 🛠️ Technologies

| Technology         | Category      | Purpose                                    |
| ------------------ | ------------- | ------------------------------------------ |
| Next.js 14         | Framework     | App Router, routing, SSR                   |
| React 18           | UI runtime    | Component model                             |
| JavaScript (ESM)   | Language      | Application logic                           |
| Tailwind CSS 3     | Styling       | Utility-first responsive styling           |
| TanStack Query 5   | Data fetching | Caching, invalidation, background refetch  |
| Zustand            | State         | Auth session store                          |
| Axios              | HTTP client   | API calls with interceptors                 |
| React Hook Form    | Forms         | Login, register, booking, review            |
| Zod                | Validation    | Client-side form schemas                    |
| React Hot Toast    | Notifications | Toasts                                      |
| Radix UI           | UI primitives | Accessible headless components              |
| lucide-react       | Icons         | Icon set                                    |
| cn                | Utility       | Tailwind class merging                      |

---

## 🚀 Quick Start

### 1. Clone and install

```bash
git clone https://github.com/Bikram-Bk/HomeStay-Nepal.git
cd HomeStay-Nepal/frontend/project
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Create `.env.local` in this folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Point this at your backend. It must include the `/api` suffix.

### 4. Start the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 📜 Available Scripts

| Script  | Command       | Description                    |
| ------- | ------------- | ------------------------------ |
| Dev     | `npm run dev` | Dev server on port 3000        |
| Build   | `npm run build` | Production build             |
| Start   | `npm run start` | Serve production on port 3000 |
| Lint    | `npm run lint` | ESLint via Next.js             |

---

## 📁 Project Structure

```
src/
  app/
    (auth)/              login, register, forgot-password
    dashboard/           profile, bookings, reviews, notifications
    homestays/
      [slug]/            detail page
    payment/
      esewa/             eSewa success + failure
    layout.jsx           root layout
    providers.jsx        global providers + chat widget
  components/
    dashboard/           DashboardNav
    shared/              AppNavbar
    ui/                  button, card, input, label, select
  features/
    auth/                LoginForm, RegisterForm, ForgotPasswordForm
    booking/             BookingModal
    chat/                ChatWidget — floating AI guide
    contact/             contact API
    homestay/            homestay API
    landing/
      sections/          Hero, About, Gallery, Rooms, Testimonials, CTA, Navbar, Footer
      shared/            MountainLogo, SectionLabel, Stars
    notification/        NotificationBell
    review/              ReviewForm
  hooks/
    useAuth, useBookings, useHomestays,
    useNotifications, useReviews
  lib/
    axios.js             HTTP client + JWT interceptors
    queryClient.js       TanStack Query config
    schemas.js           Zod schemas
    toast.js             toast helpers
    utils.js             cn() class merger
  store/
    authStore.js         Zustand auth state
  data/
    landing.js           static landing content
```

---

## 🧠 Key Concepts

### Auth flow

Access tokens live in client memory (Zustand state), while refresh tokens are stored securely in an `httpOnly` signed cookie. On `401`, `lib/axios.js` automatically calls `/auth/refresh`, updates the token in memory, and seamlessly replays the original request. Concurrent `401`s queue behind a single in-flight refresh request to prevent duplicate calls.

### Feature-first organization

Code is grouped by domain under `features/`, not by technical type. Each feature owns its API calls and components — `features/booking/` holds `api.js` and `BookingModal.jsx` together. This keeps related code co-located.

### Path alias

`@/` maps to `src/` via `jsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

So imports read `@/features/chat/ChatWidget` instead of long relative paths.

### Server state vs client state

TanStack Query owns everything fetched from the API. Zustand holds only what persists across routes — the auth session. Form drafts stay local to the component.

---

## 🚢 Deployment

### Vercel

1. Import the repo into Vercel
2. Set **Root Directory** to `frontend/project`
3. Add the environment variable:

   ```
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
   ```

4. Deploy

No `vercel.json` needed — Next.js is detected automatically.

---

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://zustand.docs.pmnd.rs)
- [React Hook Form](https://react-hook-form.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [eSewa ePay](https://developers.esewa.com.np)

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request with a clear description of your changes. If you add a UI feature or behavior change, include screenshots when possible.

---

## 🆘 Support

- **GitHub Issues**: https://github.com/Bikram-Bk
- **Email**: bikrambk2244@gmail.com

---

## 📄 License

This project is licensed under the MIT license.