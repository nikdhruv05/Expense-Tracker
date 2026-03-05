# 💰 MERN Expense Tracker

A full-stack **Expense Tracker** built with the **MERN stack** (MongoDB, Express, React, Node.js), styled with **Tailwind CSS v4**, featuring a **Recharts** donut pie chart, **month-wise filtering**, and a local **AI Insights** engine.

---

## 📁 Project Structure

```
DigitalHero/
├── backend/
│   ├── models/
│   │   └── Expense.js            # Mongoose schema
│   ├── routes/
│   │   └── expenseRoutes.js      # REST API routes (with month/year filter)
│   ├── .env                      # Environment variables (not committed)
│   ├── .env.example              # Example env file
│   ├── package.json
│   └── server.js                 # Express entry point
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── expenseApi.js     # Axios API calls
    │   ├── components/
    │   │   ├── AddExpenseForm.jsx
    │   │   ├── AIInsights.jsx    # 🤖 AI spending insights
    │   │   ├── CategoryPieChart.jsx
    │   │   ├── ExpenseList.jsx
    │   │   ├── MonthFilter.jsx   # Month dropdown filter
    │   │   ├── MonthlySummary.jsx # Clickable month cards
    │   │   └── MonthlyTotal.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css             # Tailwind + Google Font (Inter)
    ├── vite.config.js
    └── package.json
```

---

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) running locally **or** a [MongoDB Atlas](https://cloud.mongodb.com/) connection string

> **macOS note:** Port `5000` is occupied by AirPlay on macOS Monterey+. This project uses **port 5001** for the backend.

---

## 🚀 Getting Started

### 1. Open the project

```bash
cd /Users/dhruvgupta/Developer/DigitalHero
```

### 2. Setup Backend

```bash
cd backend

# Copy the example env file
cp .env.example .env

# Install dependencies
npm install

# Start with auto-reload (recommended)
npm run dev

# OR start normally
npm start
```

Backend runs on **http://localhost:5001**

### 3. Setup Frontend

Open a **new terminal tab**:

```bash
cd frontend

# Install dependencies
npm install

# Start the Vite dev server
npm run dev
```

Frontend runs on **http://localhost:5173**

---

## 🔐 Environment Variables

Create a `.env` file inside `/backend/` (copy from `.env.example`):

```env
MONGO_URI=mongodb://localhost:27017/expense-tracker
PORT=5001
```

| Variable    | Description                           | Default                                     |
|-------------|---------------------------------------|---------------------------------------------|
| `MONGO_URI` | MongoDB connection string             | `mongodb://localhost:27017/expense-tracker` |
| `PORT`      | Port for the Express server           | `5001`                                      |

> **MongoDB Atlas:** Replace `MONGO_URI` with your Atlas connection string:
> `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/expense-tracker`

---

## 🔌 REST API Endpoints

| Method | Endpoint                        | Description                      |
|--------|---------------------------------|----------------------------------|
| GET    | `/api/expenses`                 | Get all expenses                 |
| GET    | `/api/expenses?month=3&year=2026` | Get expenses filtered by month |
| POST   | `/api/expenses`                 | Add a new expense                |
| DELETE | `/api/expenses/:id`             | Delete an expense by ID          |

### POST body example

```json
{
  "title": "Dinner at restaurant",
  "amount": 750,
  "category": "Food",
  "date": "2026-03-05"
}
```

**Categories:** `Food` · `Travel` · `Shopping` · `Bills` · `Other`

---

## ✨ Features

### Core
- ➕ **Add expenses** — title, amount, category, date
- 📋 **View all expenses** — sorted list with category badges & icons
- 🗑️ **Delete expenses** — with confirmation dialog
- 📊 **Totals** — current/selected month + all-time

### Month-wise Filtering
- 📅 **Monthly summary cards** — horizontally scrollable, clickable cards showing each month's total
- 🔽 **Month dropdown filter** — quickly jump to any of the last 12 months
- 🔄 **Synced views** — expense list, pie chart, totals, and AI insights all update together

### AI Insights (local, no API key needed)
- 🤖 **Spending pattern analysis** — automatically generated from your data
- Detects: high category spend, discretionary overspending, large single expenses, month-over-month changes, balanced spending, and high average expense
- Each insight includes an **actionable tip**

### UI
- 🥧 **Donut pie chart** — per-category breakdown (Recharts), updates with filter
- 🌙 **Dark UI** — Tailwind CSS v4 + Inter font
- 📱 **Responsive** — works on mobile and desktop

---

## 🛠️ Tech Stack

| Layer     | Technology                       |
|-----------|----------------------------------|
| Frontend  | React 18, Vite 7, Tailwind CSS v4 |
| Charts    | Recharts                         |
| HTTP      | Axios                            |
| Backend   | Node.js, Express 4               |
| Database  | MongoDB, Mongoose 8              |
