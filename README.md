# 🍕 Cinco Pizza — Restaurant Web App

A premium, full-stack restaurant web application built with **Next.js 16**, featuring a beautiful customer-facing storefront and a complete admin dashboard for order management.

---

## ✨ Features

### 🛍️ Customer Storefront
- Animated hero section with GSAP scroll effects
- Full pizza menu with 39+ pizzas across 4 categories
- Pizza customization modal (size, ingredients)
- Persistent shopping cart (Zustand + localStorage)
- Cart drawer with order confirmation
- Smooth scroll via Lenis
- Fully responsive (mobile-first)

### 🖥️ Admin Dashboard
- Protected login page (HTTP-only cookie auth)
- SaaS-style dashboard with sidebar navigation
- Real-time order board in 3 columns:
  - 🔴 **Nouvelles commandes**
  - 🟡 **En préparation**
  - 🟢 **Terminées**
- KPI cards (total orders, revenue, status counts)
- One-click order status transitions
- Auto-refresh every 15 seconds
- Fully responsive (desktop columns / mobile tabs)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion + GSAP |
| State | Zustand (cart) |
| Auth | HTTP-only cookies (no external library) |
| Storage | In-memory (demo) |
| Fonts | Playfair Display · Inter · Space Grotesk |
| Icons | Lucide React |
| Deployment | Vercel |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/hamzalazigheb/cinco-pizza.git
cd cinco-pizza
npm install
```

### Environment Variables

Create a `.env.local` file at the root:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_password
ADMIN_TOKEN=your_secret_token
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the storefront.
Open [http://localhost:3000/admin](http://localhost:3000/admin) for the dashboard.

---

## 📁 Project Structure

```
app/
├── page.tsx              # Customer storefront
├── login/page.tsx        # Admin login
├── admin/
│   ├── layout.tsx        # Sidebar + topbar shell
│   └── page.tsx          # Order management dashboard
├── api/
│   ├── orders/           # POST (create) · GET (list) · PATCH (status)
│   └── auth/             # Login · Logout
components/
├── sections/             # Hero, Menu, Offers, About, Delivery...
├── cart/                 # CartButton, CartDrawer, PizzaCustomizeModal
├── layout/               # Header, Footer
data/
└── pizzas.ts             # 39 pizzas with full data
store/
└── cartStore.ts          # Zustand cart store
lib/
└── orders.ts             # In-memory order store (demo)
```

---

## 🔐 Admin Access

| Route | Description |
|---|---|
| `/login` | Admin login page |
| `/admin` | Protected dashboard |

Credentials are set via environment variables — never hardcoded.

---

## 🌐 Deploy on Vercel

1. Push to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Add environment variables in **Settings → Environment Variables**:
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `ADMIN_TOKEN`
4. Click **Deploy** ✅

---

## 📸 Screenshots

> Storefront · Admin Dashboard · Mobile view

---

## 📄 License

MIT — feel free to use this project as a template for your own restaurant website.

---

<div align="center">
  <p>Built with ❤️ by <strong>Hamza</strong></p>
  <p>
    <a href="https://github.com/hamzalazigheb/cinco-pizza">GitHub</a> ·
    <a href="https://cinco-pizza.vercel.app">Live Demo</a>
  </p>
</div>
