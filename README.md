# Jarvis - دستیار صوتی هوشمند

Voice assistant powered by Ollama, React, and Express.

## Features

- Voice input with Web Speech API (Farsi & English)
- AI-powered responses via Ollama (neural-chat)
- Streaming responses (token by token)
- Beautiful dark UI with animations
- Speech synthesis (reads replies aloud)
- About page with project info

## Tech Stack

- **Frontend:** React 19, Tailwind CSS, Vite
- **Backend:** Express 5, Axios
- **AI:** Ollama (neural-chat model)
- **Speech:** Web Speech API

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Ollama](https://ollama.ai/) installed and running
- neural-chat model pulled:
  ```bash
  ollama pull neural-chat
  ```

## Setup

```bash
git clone https://github.com/kaveh-zohrabi/voice-assistant.git
cd voice-assistant
npm install
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000)

## Development

```bash
npm run dev
```

Runs Vite dev server + Express backend concurrently.

## Project Structure

```
voice-assistant/
├── server.js              # Express backend (Ollama API proxy)
├── voice-ui/
│   ├── src/
│   │   ├── App.jsx        # Main app component
│   │   ├── About.jsx      # About page
│   │   └── main.jsx       # Entry point
│   ├── index.html
│   └── vite.config.js
└── package.json
```

## License

MIT
