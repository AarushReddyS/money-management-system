# Money Management Frontend (React + Vite + Tailwind CSS)

Modern, lightning-fast Single Page Application (SPA) for the Money Management System. Designed for deployment on **Vercel**.

---

## Features
- **Modern Dashboard**: Visual metrics, income vs. expense cash flow charts, upcoming bills, and budget gauges.
- **Income Tracker**: Track salaries, side hustles, dividends with categories and date filtering.
- **Expense Tracker**: Record purchases with payment methods and category allocations.
- **Bills & Dues Manager**: Track due dates, mark as paid in 1-click, overdue visual indicators, and recurring billing tags.
- **Monthly Budget Planner**: Interactive monthly budget caps and real-time category spending comparisons.
- **Analytics & Trends**: Multi-month cashflow comparisons, savings rates, and financial reports.
- **Multi-Currency Support**: Switch between USD ($), EUR (€), GBP (£), INR (₹), CAD, AUD, JPY, and SGD seamlessly.
- **Authentication**: JWT login, register, profile settings, and password updates.
- **Toast Notifications**: Interactive feedback on every action.
- **Vercel Ready**: Comes with `vercel.json` rewrite configuration for seamless SPA routing.

---

## Local Development Quickstart

### Prerequisites
- Node.js (v18+ recommended)
- npm or pnpm or yarn

### 1. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `VITE_API_BASE_URL` points to your backend:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Dev Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Deploying on Vercel

### Step 1: Push Repository to GitHub/GitLab
Ensure your repository has the root structure:
```text
money-management-system/
├── backend/
└── frontend/
```

### Step 2: Import into Vercel
1. Log in to your [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your GitHub / GitLab repository.
4. In the **Configure Project** screen:
   - **Framework Preset**: `Vite` (automatically detected)
   - **Root Directory**: Click *Edit* and select `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Expand the **Environment Variables** section and add:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://<your-render-backend-url>.onrender.com/api`
   *(Replace with your live Render backend URL)*
6. Click **Deploy**.

### SPA Routing on Vercel
This project already contains `frontend/vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
This ensures that refreshing paths like `/incomes`, `/expenses`, or `/budgets` on Vercel serves `index.html` without 404 errors.

