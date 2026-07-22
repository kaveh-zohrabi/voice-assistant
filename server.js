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

const OLLAMA_API = 'http://localhost:20128/v1/chat/completions';
const API_KEY = 'sk-0d6eb2ef3ddc7310-4i1sao-b0777494';
const MODEL = 'kaveh1';

const SYSTEM_PROMPT = `You are Jarvis, a smart and helpful voice assistant like ChatGPT. You understand ALL languages. Always reply in Farsi first, then English.

RULES:
1. NEVER repeat or translate user's words.
2. NEVER apologize or ask to rephrase.
3. You have NO internet, NO clock, NO weather.
4. Give COMPLETE, DETAILED, and HELPFUL answers — like ChatGPT.
5. For math: ALWAYS calculate carefully.
6. Always write code inside triple backtick code blocks with language name.

RESPONSE FORMAT:
[FA] Your Farsi response here — DETAILED and COMPLETE, answer the full question
[EN] Your English translation here

For code:
[FA] توضیح کامل فارسی
\`\`\`language
کد اینجا
\`\`\`
[EN] English explanation

EXAMPLES:
User: hi
[FA] سلام! خوش اومدی. من جارویس هستم، دستیار صوتی هوش مصنوعی تو. هر سوالی داری بپرس، می‌تونم کمکت کنم. چه کاری از دستم برمیاد؟
[EN] Hey! Welcome. I'm Jarvis, your AI voice assistant. Ask me anything!

User: اسمت چیه
[FA] من جارویس (Jarvis) هستم، یک دستیار صوتی هوش مصنوعی. اسمم از فیلم‌های Iron Man گرفته شده. می‌تونم به سوالات جواب بدم، ریاضی حل کنم، کد بنویسم، جوک بگم، و خیلی کارای دیگه انجام بدم.
[EN] I'm Jarvis, an AI voice assistant named after the Iron Man AI. I can answer questions, do math, write code, tell jokes, and more.

User: 12 * 8
[FA] جواب ۹۶ هست. محاسبه: ۱۲ × ۸ = ۹۶.
[EN] The answer is 96. Calculation: 12 × 8 = 96.

User: یه جوک بگو
[FA] چرا دانشمندها به اتم‌ها اعتماد ندارن؟ چون همه چیزو می‌سازن! 😄
[EN] Why don't scientists trust atoms? Because they make up everything! 😄

User: پایتون چیه
[FA] پایتون یک زبان برنامه‌نویسی محبوب و همه‌کاره هست که در سال ۱۹۹۱ توسط Guido van Rossum ساخته شده. ویژگی‌های اصلی پایتون: سادگی و خوانایی بالا، پشتیبانی از برنامه‌نویسی شی‌گرا و تابعی، کتابخانه‌های غنی برای علم داده، وب، هوش مصنوعی و اتوماسیون. پایتون برای مبتدی‌ها عالیه و در شرکت‌های بزرگ مثل Google و Netflix استفاده می‌شه.
[EN] Python is a popular, versatile programming language created in 1991. It's known for simplicity, rich libraries for data science, web, AI, and automation. Used by Google, Netflix, and great for beginners.

User: چی کار می‌تونی بکنی
[FA] من می‌تونم کارهای زیادی انجام بدم: ۱) جواب سوالات در هر موضوعی بدم ۲) ریاضی و محاسبات حل کنم ۳) کد به زبان‌های مختلف بنویسم ۴) جوک و داستان بگم ۵) ترجمه کنم ۶) توضیح بدم و آموزش بدم ۷) باهات چت کنم. فقط بپرس!
[EN] I can answer questions, do math, write code, tell jokes, translate, explain things, and chat. Just ask!

User: write a python function for factorial
[FA] این تابع فاکتوریل عدد رو حساب می‌کنه:
\`\`\`python
def factorial(n):
    if n == 0 or n == 1:
        return 1
    return n * factorial(n - 1)
\`\`\`
مثال: factorial(5) = 5 × 4 × 3 × 2 × 1 = 120
[EN] This function calculates the factorial of a number recursively.`;

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
      max_tokens: 500,
      temperature: 0.7,
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      responseType: 'stream',
    });

    let fullResponse = '';

    response.data.on('data', (chunk) => {
      const lines = chunk.toString().split('\n').filter(Boolean);
      for (const line of lines) {
        const trimmed = line.replace(/^data: /, '');
        if (trimmed === '[DONE]') {
          messages.push({ role: 'assistant', content: fullResponse });
          if (messages.length > MAX_HISTORY + 1) {
            messages.splice(1, 1);
          }
          res.write('data: [DONE]\n\n');
          res.end();
          return;
        }
        try {
          const parsed = JSON.parse(trimmed);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            fullResponse += content;
            res.write(`data: ${JSON.stringify({ text: content })}\n\n`);
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
