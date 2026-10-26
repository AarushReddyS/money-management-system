# 💰 Money Management System (FinanceFlow)

A full-stack, enterprise-grade personal finance and money management application.

- **Frontend**: React 18 + Vite + Tailwind CSS + Lucide Icons *(Configured for **Vercel**)*
- **Backend**: Spring Boot 3 + Java 17 + Spring Security + JWT *(Configured for **Render**)*
- **Database**: Managed MySQL on **Aiven** (with SSL/TLS enforcement)

---

## 📁 Repository Structure

```text
money-management-system/
├── backend/                              # Spring Boot 3 Backend
│   ├── src/main/java/com/moneymanager/
│   │   ├── MoneyManagerApplication.java
│   │   ├── config/                       # SecurityConfig, JwtAuthFilter, JwtUtils
│   │   ├── controller/                   # Auth, Income, Expense, Bill, Budget, Dashboard, User
│   │   ├── dto/                          # Request & Response Data Transfer Objects
│   │   ├── entity/                       # User, Income, Expense, Bill, MonthlyBudget, BudgetCategory
│   │   ├── enums/                        # Categories, Frequencies, Statuses, PaymentMethods
│   │   ├── exception/                    # GlobalExceptionHandler, Custom Exceptions
│   │   ├── repository/                   # Spring Data JPA Repositories
│   │   └── service/                      # Core Business Logic Services
│   ├── src/main/resources/
│   │   ├── application.properties        # Config with Aiven MySQL & Render $PORT support
│   │   └── schema.sql                    # SQL Reference Schema
│   ├── Dockerfile                        # Multi-stage Docker build for Render
│   ├── render.yaml                       # Render Blueprint specification
│   ├── .env.example                      # Backend environment variable template
│   ├── pom.xml                           # Maven dependencies
│   └── README.md                         # Backend specific guide
│
├── frontend/                             # React 18 SPA (Vite + Tailwind CSS)
│   ├── public/
│   ├── src/
│   │   ├── api/                          # Axios client & individual API endpoints
│   │   ├── components/
│   │   │   ├── common/                   # Modal, StatCard, EmptyState, LoadingSpinner, ConfirmDialog
│   │   │   ├── layout/                   # Sidebar, Navbar, Layout, Footer
│   │   │   ├── dashboard/                # CashflowChart, ExpenseCategoryChart, Widgets
│   │   │   ├── income/                   # IncomeModal, IncomeTable, IncomeFilter
│   │   │   ├── expense/                  # ExpenseModal, ExpenseTable, ExpenseFilter
│   │   │   ├── bills/                    # BillModal, BillCard, BillFilter
│   │   │   └── budget/                   # BudgetModal, BudgetProgressBar, CategoryBudgetList
│   │   ├── context/                      # AuthContext, CurrencyContext, ToastContext
│   │   ├── pages/                        # Dashboard, Income, Expense, Bills, Budget, Analytics, Profile, Auth
│   │   ├── utils/                        # Formatters, Currencies & Constants
│   │   ├── App.jsx                       # Router & Route guards
│   │   ├── index.css                     # Tailwind CSS imports
│   │   └── main.jsx                      # App entry point
│   ├── vercel.json                       # Vercel SPA rewrite configuration
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   ├── .env.example                      # Frontend environment variable template
│   └── README.md                         # Frontend specific guide
│
└── README.md                             # Main System Documentation
```

---

## 🌟 Core Features

1. **User Authentication & Authorization**:
   - Secure registration and login using JWT (JSON Web Tokens).
   - BCrypt password hashing.
   - Profile management (name, currency preference, password changes).

2. **Income Tracking**:
   - Log income entries with categories (Salary, Freelance, Business, Investments, Gifts, etc.).
   - Track payment methods (Bank Transfer, Cash, UPI, Crypto, etc.).
   - Date range filtering and title search.
   - Real-time sum calculations.

3. **Expense Tracking**:
   - Categorize daily spending (Housing, Groceries, Utilities, Dining, Shopping, Health, Travel, etc.).
   - Search by title and notes, filter by category and custom date ranges.
   - Edit, delete, and inspect transactions.

4. **Bills & Dues Management**:
   - Due date tracking with automatic overdue detection.
   - Dynamic urgency status indicators (*"Due today"*, *"Overdue by 3 days"*, *"Due in 5 days"*).
   - 1-click **"Mark as Paid"** / **"Mark as Unpaid"**.
   - Recurring bill support (Monthly, Weekly, Yearly, etc.) and Auto-Pay tags.
   - Upcoming bills widget on the main dashboard (due within 14 days).

5. **Monthly Budget Planner & Analytics**:
   - Set an overall monthly spending ceiling.
   - Allocate custom budgets to specific expense categories.
   - Real-time variance tracking: Budget vs. Actual spending with percentage meters.
   - Warning notifications when exceeding budgets.

6. **Financial Cockpit & Insights**:
   - Net Worth tracker (all-time income vs. expense surplus).
   - Monthly net savings & savings rate calculation.
   - Multi-month income vs. expense cash flow chart.
   - Category distribution percentage breakdowns.
   - Multi-currency support (USD, EUR, GBP, INR, CAD, AUD, JPY, SGD).

---

## 🗄️ Database Setup: MySQL on Aiven

Aiven provides high-availability cloud MySQL with automatic SSL.

1. Create a free account at [aiven.io](https://aiven.io/).
2. Click **Create Service** -> Select **MySQL**.
3. Choose your preferred cloud provider and region.
4. Once running, go to the **Overview** page and note:
   - **Host** (e.g., `mysql-12345-yourproject.aivencloud.com`)
   - **Port** (e.g., `11823`)
   - **User** (typically `avnadmin`)
   - **Password**
   - **Database Name** (default is `defaultdb`)
5. **JDBC Connection String format**:
   ```text
   jdbc:mysql://<HOST>:<PORT>/defaultdb?sslMode=REQUIRED&useSSL=true&allowPublicKeyRetrieval=true&serverTimezone=UTC
   ```
   *Note: Because Spring Boot is configured with `spring.jpa.hibernate.ddl-auto=update`, all database tables, columns, indexes, and relations will automatically be created in your Aiven database when the backend starts.*

---

## 🚀 Backend Deployment: Render

The backend is containerized with a multi-stage Dockerfile and optimized for Render Web Services.

### Step-by-Step Deployment:
1. Push your project to GitHub or GitLab.
2. Log in to [Render](https://dashboard.render.com).
3. Click **New +** -> **Web Service**.
4. Connect your Git repository.
5. Set the service settings:
   - **Name**: `money-management-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Docker`
   - **Dockerfile Path**: `Dockerfile`
   - **Instance Type**: `Free`
6. Add the following **Environment Variables**:
   | Variable | Value |
   |---|---|
   | `SPRING_DATASOURCE_URL` | `jdbc:mysql://<HOST>:<PORT>/defaultdb?sslMode=REQUIRED&useSSL=true&allowPublicKeyRetrieval=true&serverTimezone=UTC` |
   | `SPRING_DATASOURCE_USERNAME` | `avnadmin` |
   | `SPRING_DATASOURCE_PASSWORD` | `<your-aiven-password>` |
   | `JWT_SECRET` | `<32+_characters_random_key>` |
   | `CORS_ALLOWED_ORIGINS` | `https://<your-vercel-domain>.vercel.app,http://localhost:5173` |
   | `PORT` | `8080` *(Render sets this automatically)* |
7. Click **Create Web Service**.
8. Once the build finishes, verify by accessing:
   `https://<your-render-subdomain>.onrender.com/api/health`
   Expected response: `{"status": "UP", "service": "Money Management Backend"}`.

---

## 🌐 Frontend Deployment: Vercel

The frontend is built with Vite + React and includes `vercel.json` for client-side routing.

### Step-by-Step Deployment:
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Select your Git repository.
4. In the **Configure Project** screen:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and choose `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Expand **Environment Variables** and add:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://<your-render-subdomain>.onrender.com/api`
6. Click **Deploy**.
7. Vercel will deploy your application. You can now register an account and start managing your finances!

---

## 💻 Local Development Setup

To run both services locally on your machine:

### 1. Start Backend:
```bash
cd backend

# Create .env from example if needed
cp .env.example .env

# Run using Maven wrapper or Maven:
mvn clean package -DskipTests
java -jar target/money-management-backend-1.0.0.jar
```
Backend runs at `http://localhost:8080`.

### 2. Start Frontend:
```bash
cd frontend

# Install dependencies:
npm install

# Start Vite dev server:
npm run dev
```
Frontend runs at `http://localhost:5173`.

