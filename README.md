# CreditPilot

A full-stack financial analytics platform for tracking credit utilization, debt payoff progress, and payment history.

**Stack:** React · Python (FastAPI) · PostgreSQL · REST APIs

---

## Features

- JWT-based user authentication and session management
- Credit account tracking with utilization rate visualization
- Debt payoff tracker with progress bars and payment logging
- Interactive financial dashboard with radial charts
- Multi-user data isolation via PostgreSQL schema design
- RESTful API with full CRUD operations

---

## Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 14+

---

### 1. Database Setup

Open **pgAdmin** or **psql** and run:

```sql
CREATE DATABASE creditpilot;
```

---

### 2. Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Configure environment
# Edit .env and set your PostgreSQL password:
# DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/creditpilot

# Run the server
uvicorn main:app --reload
```

API will be available at: `http://localhost:8000`  
Interactive docs: `http://localhost:8000/docs`

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

App will be available at: `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and receive JWT |
| GET | `/auth/me` | Get current user |
| GET | `/accounts/` | List credit accounts |
| POST | `/accounts/` | Create credit account |
| PUT | `/accounts/{id}` | Update account |
| DELETE | `/accounts/{id}` | Delete account |
| POST | `/accounts/{id}/payments` | Log a payment |
| GET | `/debts/` | List debts |
| POST | `/debts/` | Create debt |
| PUT | `/debts/{id}` | Update debt / log payment |
| DELETE | `/debts/{id}` | Delete debt |
| GET | `/dashboard/stats` | Get dashboard statistics |

---

## Project Structure

```
CreditPilot/
├── backend/
│   ├── main.py          # FastAPI app + CORS + router registration
│   ├── database.py      # SQLAlchemy engine and session
│   ├── models.py        # ORM models (User, CreditAccount, Debt, Payment)
│   ├── schemas.py       # Pydantic request/response schemas
│   ├── auth.py          # JWT creation, password hashing, auth dependency
│   └── routers/
│       ├── auth.py      # Register, login, /me
│       ├── accounts.py  # Credit account CRUD + payment logging
│       ├── debts.py     # Debt CRUD
│       └── dashboard.py # Aggregated stats endpoint
└── frontend/
    └── src/
        ├── App.jsx          # Router + private route guard
        ├── api/client.js    # Axios instance with JWT interceptor
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── Dashboard.jsx  # Stats + radial charts
        │   ├── Accounts.jsx   # Credit account management
        │   └── Debts.jsx      # Debt tracker
        └── components/
            └── Navbar.jsx
```


