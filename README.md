# UserHub — React User Management Dashboard

A **production-quality React.js User Management Dashboard** that consumes the public [JSONPlaceholder REST API](https://jsonplaceholder.typicode.com). Built as a full-stack internship technical assessment demonstrating clean React architecture, proper state management, and a professional white corporate UI.

**Live demo:** https://user-management-dashboard-cyan-three.vercel.app/
**Repository:** https://github.com/Tushar-sonawane06/User-Management-Dashboard

---

## ✨ Features

| Feature | Details |
|---|---|
| **User List** | Fetches all 10 users from `GET /users`, displays Name, Email, Phone, Company, Website per card |
| **Search** | Debounced (350 ms) client-side filtering by name and email — no per-keystroke API calls |
| **Company Filter** | Dropdown populated dynamically from fetched data, deduplicated, works in combination with search |
| **Sorting** | Sort by Name or Company (A→Z / Z→A toggle) |
| **Pagination** | "Load more" button reveals users beyond the initial 9-card page |
| **User Details** | Modal with full info (address, company catchphrase) + independently-fetched posts (`GET /posts?userId={id}`) |
| **Create User** | Form with full validation → `POST /users` → optimistic insert into local state |
| **Edit User** | Pre-filled form → `PUT /users/{id}` → optimistic update with rollback on failure |
| **Delete User** | Confirmation modal → `DELETE /users/{id}` → optimistic removal with rollback on failure |
| **Toast Notifications** | Success and error toasts for every CRUD action |
| **Loading States** | Shimmer skeleton cards on initial load; per-section spinners in modals |
| **Error State** | Full-page error message with functional Retry button |
| **Empty State** | "No users found" illustration with a one-click Clear button |
| **Accessibility** | `aria-label` on all icon buttons, `role="dialog"`, `aria-modal`, ESC closes modals, focus trapping |
| **Responsive** | Single-column on mobile (375 px) → 3-column grid on desktop |

---

## 🛠 Tech Stack

- **React 18** — functional components and Hooks only
- **Vite** — build tool and dev server
- **Tailwind CSS v4** — white/light corporate theme
- **Axios** — HTTP client with a centralized instance in `src/services/userApi.js`
- **react-hook-form** — form state and validation
- **react-hot-toast** — toast notifications
- **lucide-react** — icon library

---

## 📁 Project Structure

```
src/
├── components/
│   ├── CompanyFilter.jsx      # Company dropdown filter
│   ├── ConfirmationModal.jsx  # Delete confirmation dialog
│   ├── EmptyState.jsx         # Zero-results and empty-list states
│   ├── LoadingSpinner.jsx     # Reusable spinner (sm/md/lg)
│   ├── SearchBar.jsx          # Debounced search input
│   ├── SkeletonCard.jsx       # Shimmer placeholder card
│   ├── UserCard.jsx           # Individual user card (avatar + info + actions)
│   ├── UserDetailsModal.jsx   # Full details + posts modal
│   ├── UserForm.jsx           # Reusable create/edit form (react-hook-form)
│   └── UserList.jsx           # Responsive grid of UserCards
├── hooks/
│   ├── useDebounce.js         # Generic debounce hook
│   ├── useUserPosts.js        # Fetch posts for a given userId
│   └── useUsers.js            # All user CRUD state + optimistic updates
├── pages/
│   └── Users.jsx              # Top-level page — owns all modal/filter/sort state
├── services/
│   └── userApi.js             # Centralized Axios instance + all API call functions
├── utils/
│   ├── validators.js          # Pure react-hook-form validation rule objects
│   └── formatPhone.js         # Phone number display formatter
├── App.jsx
├── index.css                  # Tailwind import + global animations/skeleton
└── main.jsx
```

---

## 🚀 Setup & Run

### Prerequisites

- **Node.js** 18 or higher
- **npm** 9 or higher

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/Tushar-sonawane06/User-Management-Dashboard.git

# 2. Enter the project directory
cd User-Management-Dashboard

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**

### Production Build

```bash
npm run build        # outputs to dist/
npm run preview      # serve the production build locally
```

---

## 🌐 API Reference

All data is sourced from the public [JSONPlaceholder](https://jsonplaceholder.typicode.com) mock REST API. No API key required.

| Operation | Method | Endpoint |
|---|---|---|
| List users | `GET` | `/users` |
| Get single user | `GET` | `/users/{id}` |
| Create user | `POST` | `/users` |
| Update user | `PUT` | `/users/{id}` |
| Delete user | `DELETE` | `/users/{id}` |
| Get user posts | `GET` | `/posts?userId={id}` |

---

## ⚠️ Assumptions & Known Limitations

1. **JSONPlaceholder is a mock API — writes are not persisted.**
   - `POST /users` always returns `{ id: 11, ...postedData }` regardless of what you submit. The app generates a unique local ID (`Date.now()`) to avoid key collisions.
   - `PUT /users/{id}` and `DELETE /users/{id}` return success responses but do not actually modify any data.
   - **After a page refresh, the app re-fetches the original 10 users from the API.** Any creates, edits, or deletes made in the current session will not survive a refresh. This is expected behaviour of a mock API, not a bug.

2. **Optimistic UI updates with rollback.**
   - Edit and Delete operations update the local React state immediately (before the API confirms) for a snappy experience. If the API call fails, the state is rolled back to its pre-action snapshot automatically and an error toast is shown.

3. **No authentication.** The app is a single-page dashboard with no login flow — all users are public.

4. **Phone number formatting.** JSONPlaceholder returns phone extensions in the raw format `1-770-736-8031 x56442`. The app reformats this for display (e.g. as `1-770-736-8031 (ext. 56442)`); a small cosmetic inconsistency in the bracket style may appear for some entries. This is display-only and does not affect data accuracy or any functionality.

5. **Company data on newly created users.** The JSONPlaceholder API echoes back minimal company data. The app maps the `Company Name` form field to `user.company.name` consistently across the list, cards, and modals.

---

## 🏗 Architecture Decisions

- **Service layer isolation** — Zero API calls inside component files. All Axios logic lives exclusively in `src/services/userApi.js`.
- **Custom hooks** — `useUsers` (CRUD + state), `useDebounce` (prevents excessive filtering), `useUserPosts` (per-user post fetch with abort on unmount) all follow the single-responsibility principle.
- **`useMemo` for derived data** — The filtered + sorted + paginated user list is memoized so typing in the search box never re-renders the header or filter dropdown.
- **Abort controllers** — Every `useEffect` fetch provides a signal to Axios and aborts on component unmount to prevent stale state updates and React warnings.
- **Optimistic updates** — Edit and Delete capture a `snapshot` of the users array before mutation and restore it on failure, giving a true rollback without a full re-fetch.

---

## ✅ Bonus Features Implemented

- [x] Debounced search (350 ms)
- [x] Pagination ("Load more")
- [x] Sorting by Name and Company (asc/desc)
- [x] Optimistic UI updates with rollback
- [x] Reusable custom hooks (`useUsers`, `useDebounce`, `useUserPosts`)
- [x] Toast notifications for all CRUD success/error states
- [x] Accessibility: `aria-label`, `aria-modal`, `role="dialog"`, ESC key, click-outside, focus management