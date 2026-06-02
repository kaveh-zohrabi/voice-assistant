# راهنمای انتشار CF IP Scanner در GitHub Releases

## ساختار فایل‌ها

پوشه پروژه باید این شکلی باشه:

```
cf-ip-scanner/
├── .github/
│   └── workflows/
│       └── release.yml       ← GitHub Actions (خودکار build می‌کنه)
├── build/
│   ├── icon.ico              ← آیکون ویندوز (256x256)
│   ├── icon.icns             ← آیکون مک
│   └── icon.png              ← آیکون لینوکس (512x512)
├── cf-ip-scanner.html        ← فایل اصلی برنامه
├── main.js                   ← Electron entry point
├── package.json              ← تنظیمات پروژه
├── .gitignore
└── README.md
```

---

## مرحله ۱ — نصب Node.js

از سایت https://nodejs.org نسخه LTS رو دانلود و نصب کن.

---

## مرحله ۲ — آماده‌سازی پوشه

```bash
# ساخت پوشه و رفتن داخلش
mkdir cf-ip-scanner
cd cf-ip-scanner

# نصب Electron
npm install
```

---

## مرحله ۳ — آیکون (اختیاری)

یک تصویر PNG 512x512 با نام `icon.png` در پوشه `build/` بذار.
برای تبدیل خودکار به ico و icns می‌تونی از سایت https://icoconvert.com استفاده کنی.

اگه آیکون نداری، این خط‌ها رو از `package.json` حذف کن:
```json
"icon": "build/icon.ico"   // ← این خط رو حذف کن
```

---

## مرحله ۴ — آپلود در GitHub

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cf-ip-scanner.git
git push -u origin main
```

---

## مرحله ۵ — ساخت Release (خودکار!)

فقط یک tag بزن — همه چیز خودکار انجام می‌شه:

```bash
git tag v2.0.0
git push origin v2.0.0
```

بعد از چند دقیقه GitHub Actions:
✅ روی Windows build می‌کنه → فایل .exe می‌سازه
✅ روی macOS build می‌کنه → فایل .dmg می‌سازه
✅ روی Linux build می‌کنه → فایل .AppImage و .deb می‌سازه
✅ همه رو به Releases اضافه می‌کنه

---

## مرحله ۶ — دیدن نتیجه

به آدرس زیر برو:
```
https://github.com/YOUR_USERNAME/cf-ip-scanner/releases
```

---

## تست لوکال (قبل از release)

```bash
# نصب dependencies
npm install

# اجرای برنامه
npm start

# build برای ویندوز (روی ویندوز اجرا کن)
npm run build:win

# build برای لینوکس
npm run build:linux
```

---

## رفع مشکل رایج

### خطای آیکون
اگه build به خطا خورد، پوشه `build/` رو بساز و یک آیکون ساده داخلش بذار.

### خطای GitHub Token
مطمئن شو که در تنظیمات repo، از:
Settings → Actions → General → Workflow permissions
گزینه "Read and write permissions" انتخاب شده باشه.

### build مک روی ویندوز
build مک فقط روی runner های macOS کار می‌کنه — که در workflow ما همینطور تنظیم شده.
