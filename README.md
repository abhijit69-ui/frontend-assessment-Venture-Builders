# AdminPanel — Next.js Frontend Assessment

A modern, full-featured admin dashboard built with **Next.js 15**, **Material UI v9**, **Zustand**, and **NextAuth.js**, powered entirely by the public [DummyJSON API](https://dummyjson.com/).

---

## Live Features

| Feature                                                | Status |
| ------------------------------------------------------ | ------ |
| JWT-based authentication via NextAuth                  | ✅     |
| Protected dashboard routes (middleware)                | ✅     |
| Users list with search, pagination, card grid          | ✅     |
| Single user detail page                                | ✅     |
| Products list with search, pagination, category filter | ✅     |
| Single product detail page with image carousel         | ✅     |
| Zustand global state (auth, users, products)           | ✅     |
| Client-side caching to avoid redundant API calls       | ✅     |
| Fully responsive MUI layout                            | ✅     |
| Performance: `React.memo`, `useCallback`, `useMemo`    | ✅     |

---

## Tech Stack

| Layer            | Library / Version           |
| ---------------- | --------------------------- |
| Framework        | Next.js 15 (App Router)     |
| UI Components    | Material UI (MUI) v9        |
| State Management | Zustand                     |
| Authentication   | NextAuth.js                 |
| Language         | TypeScript                  |
| API              | DummyJSON (public REST API) |

---

## Project Structure

```
src/
├── app/
│   ├── api/auth/[...nextauth]/   # NextAuth route handler
│   ├── (auth)/login/             # Login page (public)
│   └── (dashboard)/              # Protected route group
│       ├── dashboard/            # Overview with stats
│       ├── users/                # Users list + [id] detail
│       └── products/             # Products list + [id] detail
│
├── components/
│   ├── common/                   # SearchBar, Pagination, Loading, Error
│   ├── layout/                   # Sidebar, Topbar, AuthSync
│   ├── users/                    # UsersTable, UserDetailCard
│   └── products/                 # ProductCard, ProductsGrid, ImageCarousel
│
├── store/
│   ├── authStore.ts              # Auth state + token
│   ├── usersStore.ts             # Users list, search, pagination, cache
│   └── productsStore.ts          # Products list, search, category, cache
│
├── lib/
│   ├── api.ts                    # Shared axios/fetch base client
│   ├── authOptions.ts            # NextAuth config (DummyJSON credentials)
│   ├── usersApi.ts               # User API functions
│   └── productsApi.ts            # Product API functions
│
├── theme/
│   └── muiTheme.ts               # MUI custom theme
│
└── types/
    ├── index.ts                  # Shared TypeScript types
    └── next-auth.d.ts            # NextAuth session type augmentation
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up environment variables

Create a `.env.local` file in the project root:

```env
# Required — NextAuth secret (any long random string)
NEXTAUTH_SECRET=your_super_secret_key_here

# Required — Base URL for NextAuth callbacks
NEXTAUTH_URL=http://localhost:3000
```

> **Note:** No API key is required. All data is fetched from the public [DummyJSON API](https://dummyjson.com/) and no account is needed.

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Demo Credentials

The app uses DummyJSON's built-in auth. Use any valid DummyJSON user:

| Field    | Value        |
| -------- | ------------ |
| Username | `emilys`     |
| Password | `emilyspass` |

A demo credential hint is displayed on the login page itself.

---

## Authentication Flow

1. User submits credentials on `/login`
2. NextAuth calls `POST https://dummyjson.com/auth/login`
3. On success, the JWT token is stored in the NextAuth session and synced to Zustand via `AuthSync`
4. `middleware.ts` protects all `/dashboard`, `/users`, and `/products` routes — unauthenticated requests are redirected to `/login`
5. Logout clears both the NextAuth session and Zustand auth state

---

## State Management — Why Zustand?

> Zustand was chosen over Redux for the following reasons:
>
> - **Zero boilerplate** — no actions, reducers, or dispatchers; state and setters live together
> - **Async actions built-in** — API calls are written as plain `async` functions inside the store
> - **Tiny footprint** — ~1 kB gzipped, no provider wrapper required
> - **Simple mental model** — easy to read, easy to test, ideal for small-to-medium apps
> - **React-friendly** — hooks-based API that works naturally with Next.js App Router

Three stores are used:

| Store           | Manages                                                                       |
| --------------- | ----------------------------------------------------------------------------- |
| `authStore`     | Logged-in user, JWT token, login/logout actions                               |
| `usersStore`    | Users list, search query, current page, total count, page cache               |
| `productsStore` | Products list, search query, selected category, current page, categories list |

---

## Caching Strategy

### Why caching?

Each pagination or search change would otherwise trigger a new network request, increasing latency and wasting bandwidth — especially on slower connections.

### What was implemented

**Page-level cache inside Zustand** (`usersStore`, `productsStore`):

- Results for each `(page, searchQuery)` combination are stored in a `Map` keyed by a cache key string (e.g. `"page:2|search:john"`).
- Before fetching, the store checks the cache. If a hit exists, the cached data is used immediately — no network call.
- Cache is **in-memory** (lives for the session duration). It resets on page refresh, keeping data fresh across sessions.
- This is a **read-through cache** strategy: fetch once, serve from memory on repeat visits.

---

## Performance Optimizations

- **`React.memo`** — `ProductCard`, `ImageCarousel`, `UserDetailCard`, and other leaf components are memoised to skip re-renders when props haven't changed.
- **`useCallback`** — event handlers (search, page change, image navigation) are wrapped in `useCallback` to maintain stable references across renders.
- **`useMemo`** — derived values such as formatted prices and filtered display data are memoised.
- **API-side pagination** — `limit` and `skip` query params are used on every list request; the full dataset is never loaded at once.
- **Debounced search** — the search input waits for the user to stop typing (300 ms) before firing an API request, reducing unnecessary calls.
- **Server Components** — product and user detail pages are Next.js Server Components; data is fetched at request time on the server, reducing client-side JavaScript and improving initial load.

---

## API Reference

All data comes from [https://dummyjson.com](https://dummyjson.com).

| Endpoint                       | Used for                |
| ------------------------------ | ----------------------- |
| `POST /auth/login`             | User authentication     |
| `GET /users?limit=&skip=`      | Paginated users list    |
| `GET /users/search?q=`         | User search             |
| `GET /users/:id`               | Single user detail      |
| `GET /products?limit=&skip=`   | Paginated products list |
| `GET /products/search?q=`      | Product search          |
| `GET /products/categories`     | Category dropdown       |
| `GET /products/category/:name` | Filter by category      |
| `GET /products/:id`            | Single product detail   |

---

## Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

---

## What's Complete vs Pending

### Complete

- All assessment requirements from Parts 1, 2, and 3
- Image carousel on product detail (uses `product.images` array from API)
- Responsive layouts for all pages
- Clean folder structure with separation of concerns

### Not implemented (out of scope / time)

- Unit or integration tests
- Dark mode toggle (MUI theming supports it but not wired to a toggle)
- Edit / delete user or product actions (read-only admin panel per the spec)
