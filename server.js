import express from 'express';
import axios from 'axios';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'voice-ui', 'dist')));

const OLLAMA_API = 'http://localhost:11434/api/chat';
const MODEL = 'qwen3:8b';

const SYSTEM_PROMPT = `You are Jarvis, a smart, friendly, and genuinely helpful voice assistant. You understand Farsi, English, and any other language perfectly. Reply in English always.

CRITICAL RULES:
- NEVER repeat, echo, or translate what the user said.
- NEVER say "I apologize", "I'm sorry", or ask them to rephrase — just answer.
- NEVER say "I can help you" without actually helping. Give a real answer.
- You do NOT have internet access. Be honest: "I can't search the web, but here's what I know."
- You do NOT have real-time data (time, weather, news). Say so briefly.
- Keep responses SHORT but USEFUL (1-3 sentences).
- Be warm, natural, and conversational. Like a smart friend.
- If asked to do something you can't do, briefly explain what you CAN do instead.
- For math, give the answer directly. For facts, be accurate. For opinions, be thoughtful.

CAPABILITIES:
- Answer questions on any topic from your training data
- Help with math, science, coding, writing, translation
- Tell jokes, stories, fun facts
- Give advice and explanations
- Have a casual conversation

EXAMPLES OF GOOD RESPONSES:
User (Farsi): سلام اسمت چیه
Assistant: Hey! I'm Jarvis, your voice assistant. What can I help you with?

User (Farsi): یه جوک بگو
Assistant: Why don't scientists trust atoms? Because they make up everything!

User (Farsi): ۲۵ ضربدر ۴ چنده
Assistant: That's 100.

User (Farsi): توی اینترنت سرچ کن
Assistant: I don't have internet access, but ask me anything — I probably know the answer!

User (English): What's the capital of France?
Assistant: Paris.

User (Farsi): یه چیز جالب بهم بگو
Assistant: Octopuses have three hearts and blue blood. Two pump blood to the gills, and one pumps it to the rest of the body.`;

const messages = [{ role: 'system', content: SYSTEM_PROMPT }];
const MAX_HISTORY = 10;

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is empty' });
  }

  messages.push({ role: 'user', content: message });
  if (messages.length > MAX_HISTORY + 1) {
    messages.splice(1, 1);
  }

  try {
    console.log('📨 پیام:', message);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const response = await axios.post(OLLAMA_API, {
      model: MODEL,
      messages: [...messages],
      stream: true,
      options: {
        num_predict: 300,
        temperature: 0.7,
      },
    }, { responseType: 'stream' });

    let fullResponse = '';

    response.data.on('data', (chunk) => {
      const lines = chunk.toString().split('\n').filter(Boolean);
      for (const line of lines) {
        try {
          const parsed = JSON.parse(line);
          if (parsed.message?.content) {
            fullResponse += parsed.message.content;
            res.write(`data: ${JSON.stringify({ text: parsed.message.content })}\n\n`);
          }
          if (parsed.done) {
            messages.push({ role: 'assistant', content: fullResponse });
            if (messages.length > MAX_HISTORY + 1) {
              messages.splice(1, 1);
            }
            res.write('data: [DONE]\n\n');
            res.end();
          }
        } catch {}
      }
    });

    response.data.on('error', (err) => {
      console.error('❌ خطا:', err.message);
      res.write(`data: ${JSON.stringify({ error: 'خطای سرویس هوش مصنوعی' })}\n\n`);
      res.end();
    });
  } catch (error) {
    console.error('❌ خطا:', error.message);
    res.status(500).json({ error: 'خطای سرویس هوش مصنوعی' });
  }
});

app.get('/{*splat}', (req, res) => {
  res.sendFile(join(__dirname, 'voice-ui', 'dist', 'index.html'));
});

app.listen(3000, () => {
  console.log('🚀 سرور در http://localhost:3000 اجرا شد');
});
