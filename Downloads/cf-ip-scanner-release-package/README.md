<div align="center">

<img src="https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=cloudflare&logoColor=white" />
<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
<img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />

# 🛡️ CF Clean IP Scanner

**اسکنر حرفه‌ای IP های تمیز Cloudflare**

پیدا کردن سریع‌ترین و تمیزترین IP های شبکه Cloudflare با رابط کاربری زیبا

[▶ اجرای آنلاین](https://your-username.github.io/cf-ip-scanner) · [📥 دانلود](https://github.com/your-username/cf-ip-scanner/releases) · [🐛 گزارش باگ](https://github.com/your-username/cf-ip-scanner/issues)

---

</div>

## ✨ امکانات

| امکان | توضیح |
|-------|--------|
| 🔍 **اسکن رنج IP** | اسکن یک محدوده کامل از IP |
| ⚡ **Multi-thread** | اجرای تا ۵۰ thread همزمان |
| 🌍 **تشخیص DC** | شناسایی دیتاسنتر (FRA, AMS, CDG...) |
| 🔒 **بررسی SSL** | تأیید پشتیبانی از HTTPS |
| 📡 **HTTP/2** | تشخیص پشتیبانی از HTTP/2 |
| 📊 **اندازه‌گیری Jitter** | بررسی پایداری اتصال |
| 🏷️ **بررسی ASN** | تأیید تعلق به AS13335 Cloudflare |
| 💾 **خروجی متنوع** | TXT / CSV / JSON / V2Ray / Clash |

---

## 📸 پیش‌نمایش

```
┌─────────────────────────────────────────────────────┐
│  🛡️ اسکنر IP کلودفلر                         v2.0  │
├──────────┬──────────┬──────────────┬────────────────┤
│ اسکن شده │ تمیز(CF) │ بهترین پینگ  │    وضعیت       │
│   1,240  │   387    │    42ms      │ ✅ اتمام اسکن   │
├──────────┴──────────┴──────────────┴────────────────┤
│ آدرس IP        پینگ    DC    SSL  HTTP/2  وضعیت      │
│ 104.16.0.1     42ms   FRA   ✓     ✓    Cloudflare  │
│ 104.16.0.5     67ms   AMS   ✓     ✓    Cloudflare  │
│ 172.64.0.12    89ms   LHR   ✓     ✗    Cloudflare  │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 شروع سریع

### روش ۱ — مستقیم در مرورگر

فایل `cf-ip-scanner.html` را دانلود و در مرورگر باز کنید. نیاز به هیچ نصب یا سرور ندارد.

```bash
# کلون کردن
git clone https://github.com/your-username/cf-ip-scanner.git

# باز کردن
cd cf-ip-scanner
open cf-ip-scanner.html
```

### روش ۲ — GitHub Pages

پس از fork کردن، در تنظیمات repo گزینه **Pages** را فعال کنید تا لینک آنلاین دریافت کنید.

---

## 🗺️ رنج‌های رسمی Cloudflare (IPv4)

```
104.16.0.0/12
172.64.0.0/13
162.158.0.0/15
141.101.64.0/18
198.41.128.0/17
188.114.96.0/20
```

> این رنج‌ها از [ip-ranges.cloudflare.com](https://www.cloudflare.com/ips/) گرفته شده‌اند.

---

## ⚙️ نحوه کار

```
┌──────────────┐     ┌─────────────────┐     ┌──────────────────┐
│  ورودی IP    │────▶│  Worker Pool    │────▶│  تحلیل نتایج    │
│  (رنج/لیست) │     │  (N thread)     │     │  (پینگ/SSL/DC)  │
└──────────────┘     └─────────────────┘     └──────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   testIP(ip)      │
                    │ ┌───────────────┐ │
                    │ │ HTTP Request  │ │
                    │ │ بررسی هدرها  │ │
                    │ │ اندازه‌گیری   │ │
                    │ │ زمان پاسخ    │ │
                    │ └───────────────┘ │
                    └───────────────────┘
```

**مراحل اسکن:**

1. **تولید لیست IP** — از رنج وارد شده یا لیست دستی
2. **Worker Pool** — N کارگر همزمان، هر کدام یک IP را تست می‌کنند
3. **تست HTTP/HTTPS** — ارسال درخواست و بررسی هدر `CF-RAY` و `Server: cloudflare`
4. **اندازه‌گیری** — پینگ، jitter، و سرعت
5. **ذخیره نتایج** — فیلتر بر اساس پینگ و خروجی در فرمت دلخواه

---

## 📤 فرمت‌های خروجی

<details>
<summary><b>TXT</b> — ساده‌ترین فرمت</summary>

```
104.16.0.1
104.16.0.5
172.64.0.12
```
</details>

<details>
<summary><b>CSV</b> — برای آنالیز در Excel</summary>

```csv
IP,Ping(ms),Jitter(ms),DC,SSL,HTTP2,ASN
104.16.0.1,42,3,FRA,true,true,AS13335 Cloudflare
104.16.0.5,67,5,AMS,true,true,AS13335 Cloudflare
```
</details>

<details>
<summary><b>V2Ray Config</b></summary>

```json
{
  "address": "104.16.0.1",
  "port": 443,
  "network": "ws",
  "tls": true
}
```
</details>

<details>
<summary><b>Clash Config</b></summary>

```yaml
proxies:
  - name: CF-FRA-42ms
    type: vmess
    server: 104.16.0.1
    port: 443
    tls: true
```
</details>

---

## 🔧 تنظیمات پیشرفته

| پارامتر | پیش‌فرض | توضیح |
|---------|---------|-------|
| `threads` | 10 | تعداد thread های همزمان |
| `timeout` | 2000ms | حداکثر زمان انتظار برای هر IP |
| `maxPing` | 500ms | حداکثر پینگ قابل قبول |
| `onlyClean` | ✓ | فقط IP های تأییدشده CF |

---

## 📋 TODO

- [ ] پشتیبانی از IPv6
- [ ] اسکن خودکار تمام رنج‌های CF
- [ ] نمودار توزیع پینگ
- [ ] ذخیره تاریخچه اسکن
- [ ] نسخه CLI با Node.js

---

## 🤝 مشارکت

Pull request ها خوش‌آمد هستند! برای تغییرات بزرگ، ابتدا یک issue باز کنید.

---

## 📄 لایسنس

[MIT](LICENSE) — آزاد برای استفاده شخصی و تجاری

---

<div align="center">

ساخته شده با ❤️ | ستاره بدید اگه مفید بود ⭐

</div>
