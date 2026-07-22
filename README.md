# Jarvis - دستیار صوتی هوشمند

Voice assistant powered by OpenRouter, React, Express, and MySQL.

## Features

- Voice input with Web Speech API (Farsi & English)
- AI-powered responses via OpenRouter API
- Streaming responses (token by token)
- Bilingual responses (Farsi + English)
- Speech synthesis (reads replies in both languages)
- User authentication (Register/Login with JWT)
- Chat history saved in MySQL database
- Beautiful dark UI with animations
- Multiple pages: Auth, Welcome, Chat, Settings, History, Profile, About

## Tech Stack

- **Frontend:** React 19, Tailwind CSS, Vite
- **Backend:** Express 5, Axios, JWT, bcryptjs
- **Database:** MySQL 8 + phpMyAdmin
- **AI:** OpenRouter API (kaveh model)
- **Speech:** Web Speech API

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [MySQL](https://dev.mysql.com/downloads/) 8+
- OpenRouter API key

## Setup

### 1. Clone & Install

```bash
git clone https://github.com/kaveh-zohrabi/voice-assistant.git
cd voice-assistant
npm install
cd voice-ui && npm install && cd ..
```

### 2. Database Setup

Create a MySQL database using phpMyAdmin or terminal:

```sql
CREATE DATABASE jarvis_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Then import the tables (they auto-create on first run).

### 3. Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=jarvis_db
API_KEY=your_openrouter_api_key
JWT_SECRET=your_secret_key
```

### 4. Build & Run

```bash
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
voice-assistant/
├── server.js              # Express backend (API routes, auth, chat)
├── db.js                  # MySQL database connection
├── .env                   # Environment variables (not in git)
├── .env.example           # Example env file
├── voice-ui/
│   ├── src/
│   │   ├── App.jsx        # Main app with routing
│   │   ├── About.jsx      # About page
│   │   └── pages/
│   │       ├── Auth.jsx       # Login/Register
│   │       ├── Welcome.jsx    # Welcome screen
│   │       ├── Settings.jsx   # Settings page
│   │       ├── History.jsx    # Chat history
│   │       └── Profile.jsx    # User profile
│   ├── index.html
│   └── vite.config.js
└── package.json
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register new user |
| POST | `/api/login` | Login |
| GET | `/api/profile` | Get user profile |
| GET | `/api/conversations` | List conversations |
| POST | `/api/conversations` | Create conversation |
| GET | `/api/conversations/:id/messages` | Get messages |
| DELETE | `/api/conversations/:id` | Delete conversation |
| POST | `/api/chat` | Send message (streaming) |

## License

MIT
