# Quotation App — Ganesh Gouri Industries Pvt Ltd

Official unified full-stack monorepo for the Product Quotation platform developed for **Ganesh Gouri Industries Pvt Ltd**.

---

## 🚀 Live Deployments

| Component | Platform | Live URL |
|---|---|---|
| **Admin Panel** | Render | [https://quotation-app-admin.onrender.com](https://quotation-app-admin.onrender.com) |
| **Mobile App (Web)** | Vercel | [https://gouriaquaplastmobile.vercel.app/](https://gouriaquaplastmobile.vercel.app/) |

---

## 📦 Monorepo Architecture

- **[`admin/`](./admin)**: Next.js 14 Web Administration Dashboard with analytics, quotation management, and product catalog configuration.
- **[`backend/`](./backend)**: Node.js & Express REST API with MongoDB Atlas database integration, JWT authentication, and PDF quotation generation.
- **[`mobile/`](./mobile)**: React Native & Expo Mobile Application for iOS, Android, and Web clients.

---

## Repository Structure

```text
quotation-app/
├── admin/                     # Next.js 14 Admin Web Dashboard
│   ├── src/                   # Components, pages, contexts, UI utilities
│   ├── public/                # Static assets & catalog spreadsheets
│   ├── next.config.js
│   └── package.json
├── backend/                   # Express / Node.js API Service
│   ├── controllers/           # Auth, product, quotation, and user controllers
│   ├── database/              # MongoDB connection, store & migrations
│   ├── middleware/            # Auth & request validation
│   ├── routes/                # API route endpoints
│   ├── server.js              # Application entry point
│   └── package.json
├── mobile/                    # React Native / Expo Mobile App
│   ├── src/                   # Screens, navigation, state management, components
│   ├── assets/                # App icons, product photos, banners
│   ├── App.js                 # App root
│   ├── app.json               # Expo project configuration
│   └── package.json
├── .gitignore                 # Root gitignore covering all sub-packages
├── package.json               # Root monorepo runner scripts & workspaces
└── README.md                  # Project documentation
```

---

## Quick Start

### 1. Backend Service (`backend`)

```bash
cd backend
npm install
npm run dev
# Default port: 5000 (or specified in .env)
```

**Key Environment Variables (`backend/.env`):**
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/quotation_app?retryWrites=true&w=majority
MONGODB_DB_NAME=quotation_app
JWT_SECRET=your_jwt_secret
```

### 2. Admin Web Dashboard (`admin`)

```bash
cd admin
npm install
npm run dev
# Starts Next.js development server on http://localhost:3001
```

### 3. Mobile Application (`mobile`)

```bash
cd mobile
npm install
npm start
# Press 'w' for web, 'a' for Android emulator, or scan QR with Expo Go app
```

---

## Root Convenience Scripts

From the repository root:

| Command | Description |
|---|---|
| `npm run dev:backend` | Starts the Express backend server |
| `npm run dev:admin` | Starts the Next.js admin dashboard on port 3001 |
| `npm run dev:mobile` | Starts the Expo development server for the mobile app |
| `npm run dev:mobile:web` | Launches the mobile app directly in the browser |
| `npm run build:admin` | Produces an optimized production build of the admin panel |

---

## Git History Preservation Note

This monorepo was consolidated from the original standalone repositories:
- `quotation-app-backend`
- `quotation-app-admin`
- `quotation-app-mobile`

All git history, author attribution, commit messages, and previous tags were preserved.
