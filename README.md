# PizzaHub — Pizza Ordering & Delivery Platform (Client)

PizzaHub lets customers discover local pizzerias, browse menus and place delivery orders. Vendors publish menu items and manage orders and a Free / Premium subscription. Admins moderate the platform.

- **Live website:** `https://YOUR-CLIENT.vercel.app` _(replace after deploying)_
- **Client repository:** `https://github.com/YOUR_USERNAME/pizzahub-client`
- **Server repository:** `https://github.com/YOUR_USERNAME/pizzahub-server`

**Admin login for reviewers:** `admin@pizzahub.com` / `Admin1234` _(change if you seeded different credentials)_
**Stripe test card:** `4242 4242 4242 4242`, any future expiry, any CVC.

## Important features
- Better Auth: email + password and Google OAuth, role selection (Vendor / Customer), admin accounts can never be created through sign-up
- Role-based dashboards (Vendor, Customer, Admin) guarded **on the server** in layouts + JWT-protected API
- Home: animated hero (Framer Motion / `motion`), featured items from the DB, categories, Why Choose PizzaHub, How It Works
- Browse menu: debounced search, category / location filters, price sorting and range, pagination, loading + empty states
- Item details with image gallery, order form (delivery date, address, message)
- Vendor: stats + charts, add / edit / pause / delete items with ImgBB upload, accept / reject orders, Stripe subscription (upgrade, cancel, resume)
- Customer: stats + charts, orders list with timeline, cancel pending orders
- Admin: stats + charts, search / filter / block / unblock users, approve / reject / deactivate / delete items, read-only transactions
- Optional extras: **dark / light mode**, **order status timeline**
- Toasts (Sonner), custom 404 and error pages, fully responsive

## Technology stack
`next` (App Router), `react`, `better-auth` (+ MongoDB adapter, JWT plugin), `mongodb`, `tailwindcss` v4, ShadCN-style components built on `@radix-ui/react-*`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `motion` (Framer Motion), `recharts`, `sonner`, `next-themes`, `@fontsource-variable/fraunces`, `@fontsource-variable/dm-sans`, `server-only`

## Environment variables
See `.env.example`:
`BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `MONGODB_URI`, `DB_NAME`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXT_PUBLIC_API_URL`

(Stripe keys and the ImgBB key live only on the **server** repo.)

## Installation & running locally
```bash
npm install
cp .env.example .env     # fill in the values
npm run dev              # http://localhost:3000
```
Then start `pizzahub-server`, and run `npm run seed` there (client must be running) to create the admin and demo data.

Google OAuth: in Google Cloud Console create an OAuth client and add the redirect URI `http://localhost:3000/api/auth/callback/google` (and `https://YOUR-CLIENT.vercel.app/api/auth/callback/google` for production).

## How it fits together
- Better Auth runs inside this Next.js app (`/api/auth/*`) and stores users in the `users` collection.
- After login the browser requests a short-lived JWT (`authClient.token()`), cached in memory and sent to the Express API as a Bearer token.
- No reload problems: dashboard layouts read the httpOnly session cookie on the server, so a refresh on any private route keeps you signed in; `middleware.js` redirects only when no session cookie exists.

## Challenge requirements
- **Advanced search & sorting** — `/menu` calls `GET /api/menu?search&category&location&minPrice&maxPrice&sort=price_asc|price_desc|newest|featured&page` (details in the server README).
- **JWT verification** — Better Auth JWT plugin issues tokens; Express `verifyJWT` verifies them with the public JWKS (`/api/auth/jwks`) and rejects invalid / expired tokens with 401.
- **Professional appearance** — warm tomato / oven-orange / cream palette, Fraunces + DM Sans typography, sticker-style buttons, gingham accents, original SVG illustrations (`npm run art`).
