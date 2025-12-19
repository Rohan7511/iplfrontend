# 🏆 Predict the Winner

A real-time match prediction web application where users predict match outcomes, earn points for correct predictions, and compete on a live leaderboard.  
Built with a strong focus on **fair play, simplicity, and reducing human error** in tracking predictions and results.

---

## 🚀 Features

### 👤 User Features
- Secure authentication (login/signup)
- Predict the winner of the current match
- One prediction per game (cannot be changed)
- View personal prediction history
- See match results and prediction outcomes
- Track performance (points, correct & wrong predictions)
- Live leaderboard updates

### 🧑‍💼 Admin Features
- Create new games (select teams & match time)
- Declare match winners
- Control which game is active
- Automatic leaderboard & history updates after results

### ⚡ Real-Time Updates
- Live leaderboard updates
- Instant history updates after results
- WebSocket-based event broadcasting

### 🌗 UI & Experience
- Clean and responsive UI
- Dark mode support
- Role-based navigation (Admin/User)
- Error handling and success feedback

---

## 🛠️ Tech Stack

### Frontend
- React
- React Router
- Context API (Auth & Theme)
- WebSockets for real-time updates

### Backend
- REST APIs for games, predictions, leaderboard, and authentication
- WebSocket server for live updates

### Database
- Stores users, teams, games, predictions, and scores

---

## 📂 Project Structure (Frontend)

src/
│── components/
│ ├── Admin.js
│ ├── History.js
│ ├── Leaderboard.js
│ ├── MainPage.js
│ ├── Navbar.js
│ ├── Profile.js
│ ├── Rules.js
│ └── Sidebar.js
│
│── contexts/
│ ├── AuthContext.js
│ └── ThemeContext.js
│
│── services/
│ └── api.js
│
└── App.js

---

## 🔑 Authentication & Roles

- **User**
  - Can predict games
  - View history and leaderboard

- **Admin**
  - Can create games
  - Declare winners
  - Access admin dashboard

Admin routes are protected and hidden from normal users.

---

## 🎯 Scoring System

- ✅ Correct Prediction: **+10 points**
- ❌ Wrong Prediction: **0 points**
- Only one prediction allowed per game
- Predictions must be made **before game start time**

---

## 🧠 Game Flow

1. Admin creates a match and marks it as current  
2. Users predict the winner before the game starts  
3. Admin declares the winner after the game  
4. System updates:
   - User scores
   - Leaderboard
   - Prediction history
   - Real-time clients via WebSocket

---

## 🖥️ Environment Variables

Create a `.env` file in the frontend root:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_WS_URL=ws://localhost:5000
