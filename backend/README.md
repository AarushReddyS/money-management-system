# Money Management Backend (Spring Boot 3 + Java 17 + Aiven MySQL)

Production-ready RESTful backend service for personal finance and money management.

---

## Features
- **User Authentication & Security**: JWT-based stateless authentication with BCrypt password hashing.
- **Income Tracking**: Categorized income management, date filtering, payment methods, and aggregations.
- **Expense Tracking**: Expense categorization, date range filtering, payment methods, notes, and monthly totals.
- **Bill Management**: Due date tracking, overdue auto-detection, status changes (PENDING, PAID, OVERDUE), recurring frequencies, and upcoming bill reminders.
- **Monthly Budget Planner**: Set overall monthly budgets and granular category-level allocations.
- **Budget vs. Actual Comparison**: Instant variance reporting (budgeted vs spent, % used, over-budget warnings).
- **Dashboard & Analytics**: Monthly cash flow summaries, savings rates, multi-month trends, category breakdowns, and net worth calculations.
- **Cloud-Ready**: Prepared for Docker and Render deployment with dynamic `$PORT` support and Aiven MySQL SSL connectivity.

---

## Tech Stack
- **Framework**: Spring Boot 3.3.0
- **Language**: Java 17
- **Security**: Spring Security 6 + JJWT 0.12.5
- **ORM / Database**: Spring Data JPA / Hibernate + MySQL 8 Connector
- **Build Tool**: Maven

---

## Quick Start (Local Development)

### Prerequisites
- JDK 17 or higher
- Maven 3.8+ (or use Docker)
- Local MySQL or Aiven MySQL instance

### 1. Configure Database Connection
Copy `.env.example` to `.env` or set environment variables:
```bash
export SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/moneymanager?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC"
export SPRING_DATASOURCE_USERNAME="root"
export SPRING_DATASOURCE_PASSWORD="your_password"
export JWT_SECRET="your_very_long_secret_key_at_least_32_characters"
```

### 2. Build & Run
```bash
# Build the application
mvn clean package -DskipTests

# Run the JAR
java -jar target/money-management-backend-1.0.0.jar
```
Or directly with Maven:
```bash
mvn spring-boot:run
```

The backend starts at `http://localhost:8080`.
Verify with health check:
```bash
curl http://localhost:8080/api/health
```

---

## Connecting to Aiven MySQL

1. Log in to [Aiven Console](https://console.aiven.io/).
2. Create or select your **MySQL** service.
3. From the **Overview** tab, copy:
   - **Host** (e.g. `mysql-26a1b2c3-yourorg.aivencloud.com`)
   - **Port** (e.g. `11823`)
   - **User** (e.g. `avnadmin`)
   - **Password**
   - **Database Name** (default is `defaultdb`)
4. Construct your JDBC URL:
   ```text
   jdbc:mysql://<HOST>:<PORT>/defaultdb?sslMode=REQUIRED&useSSL=true&allowPublicKeyRetrieval=true&serverTimezone=UTC
   ```
5. Set the environment variables in Render or your local environment:
   ```bash
   SPRING_DATASOURCE_URL=jdbc:mysql://mysql-26a1b2c3-yourorg.aivencloud.com:11823/defaultdb?sslMode=REQUIRED&useSSL=true&allowPublicKeyRetrieval=true&serverTimezone=UTC
   SPRING_DATASOURCE_USERNAME=avnadmin
   SPRING_DATASOURCE_PASSWORD=your_aiven_password
   ```
   *Note: Spring Boot's `spring.jpa.hibernate.ddl-auto=update` will automatically create and update all tables when the application starts.*

---

## Deploying on Render

### Method A: Deploy via Docker (Recommended)
1. Push this repository to GitHub or GitLab.
2. In [Render Dashboard](https://dashboard.render.com), click **New +** -> **Web Service**.
3. Connect your repository.
4. Set the following configuration:
   - **Root Directory**: `backend`
   - **Environment**: `Docker`
   - **Dockerfile Path**: `Dockerfile`
   - **Instance Type**: `Free` (or higher)
5. Under **Environment Variables**, add:
   - `SPRING_DATASOURCE_URL` = `<your-aiven-mysql-jdbc-url>`
   - `SPRING_DATASOURCE_USERNAME` = `avnadmin`
   - `SPRING_DATASOURCE_PASSWORD` = `<your-aiven-mysql-password>`
   - `JWT_SECRET` = `<generate-a-random-32-char-string>`
   - `CORS_ALLOWED_ORIGINS` = `https://<your-app>.vercel.app,http://localhost:5173`
   - `PORT` = `8080` (Render will set this automatically)
6. Click **Create Web Service**.
7. Once deployed, test your live endpoint: `https://<your-render-subdomain>.onrender.com/api/health`.

### Method B: Deploy via Blueprint (`render.yaml`)
1. In Render, select **Blueprints**.
2. Connect your repository containing `backend/render.yaml`.
3. Fill in the sensitive environment variables (`SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_PASSWORD`, etc.).
4. Click **Apply**.

---

## API Documentation Summary

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT | No |
| `GET` | `/api/auth/me` | Fetch currently authenticated user | Yes |
| `GET` | `/api/health` | Service uptime and health | No |
| `GET` | `/api/dashboard/summary` | Monthly financial summary, bills & budget stats | Yes |
| `GET` | `/api/dashboard/trends` | 6/12 month historical income vs expense trends | Yes |
| `GET` | `/api/dashboard/categories/expenses` | Expense category distribution | Yes |
| `GET` | `/api/dashboard/categories/incomes` | Income category distribution | Yes |
| `GET` | `/api/incomes` | List incomes (filters: startDate, endDate, category) | Yes |
| `POST` | `/api/incomes` | Create income | Yes |
| `PUT` | `/api/incomes/{id}` | Update income | Yes |
| `DELETE` | `/api/incomes/{id}` | Delete income | Yes |
| `GET` | `/api/expenses` | List expenses (filters: startDate, endDate, category) | Yes |
| `POST` | `/api/expenses` | Create expense | Yes |
| `PUT` | `/api/expenses/{id}` | Update expense | Yes |
| `DELETE` | `/api/expenses/{id}` | Delete expense | Yes |
| `GET` | `/api/bills` | List bills (filter: status) | Yes |
| `GET` | `/api/bills/upcoming` | Upcoming bills within N days | Yes |
| `POST` | `/api/bills` | Create bill | Yes |
| `PUT` | `/api/bills/{id}` | Update bill | Yes |
| `PATCH` | `/api/bills/{id}/status` | Update bill status | Yes |
| `POST` | `/api/bills/{id}/pay` | Mark bill as paid | Yes |
| `DELETE` | `/api/bills/{id}` | Delete bill | Yes |
| `POST` | `/api/budgets` | Set or update monthly budget | Yes |
| `GET` | `/api/budgets` | List all configured monthly budgets | Yes |
| `GET` | `/api/budgets/current` | Get budget for current month | Yes |
| `GET` | `/api/budgets/{year}/{month}` | Get budget for specified month | Yes |
| `GET` | `/api/budgets/comparison` | Budget vs. Actual spending analysis | Yes |
| `DELETE` | `/api/budgets/{id}` | Delete monthly budget | Yes |
| `GET` | `/api/user/profile` | Get user profile details | Yes |
| `PUT` | `/api/user/profile` | Update profile (fullName, currency) | Yes |
| `PUT` | `/api/user/password` | Change user password | Yes |

