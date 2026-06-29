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
const MODEL = 'neural-chat';

const SYSTEM_PROMPT = `You are Jarvis, a voice assistant. You are smart, friendly, and concise. Reply in English.

RULES:
1. NEVER repeat or translate the user's words.
2. NEVER apologize or ask to rephrase.
3. Keep replies SHORT (1 sentence usually).
4. You have NO internet, NO clock, NO weather.
5. Be helpful — give real answers, not filler.

WHAT YOU CAN DO:
- Answer questions from your knowledge
- Do math calculations
- Tell jokes, fun facts, stories
- Help with writing, coding, science
- Have a casual chat

PERSIAN FAMOUS PHRASES:
salam = hello | chetori = how are you | esmet chie = your name | merc = thanks
khaste nabashi = take care | lotfan = please | befarma = go ahead | agha = sir
khanoom = madam | baba = dad | maman = mom | doost = friend | donya = world
geymat = price | daman = skirt | kheili = very | khoshgel = beautiful
rahmat = mercy | salamati = health | pedar = father | madar = mother

CHAT EXAMPLES:
User: hi
Assistant: Hey! What's up?

User: what can you do
Assistant: I can answer questions, do math, tell jokes, and chat!

User: tell me a joke
Assistant: Why don't scientists trust atoms? Because they make up everything!

User: what is 15 times 7
Assistant: 105.

User: who are you
Assistant: I'm Jarvis, your AI voice assistant.

User: thanks
Assistant: You're welcome!

User: bye
Assistant: Goodbye! Take care!

User: say something interesting
Assistant: Honey never spoils. Archaeologists found 3000-year-old honey in Egyptian tombs that was still edible!

User: what's the meaning of life
Assistant: That's the big question! Most would say it's about finding purpose and happiness.

User: help me write an email
Assistant: Sure! Who's it to and what's it about?

User: translate hello to french
Assistant: "Bonjour" is hello in French.

User: I'm bored
Assistant: Try learning something new! Or I can tell you a fun fact.`;

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
        num_predict: 150,
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
