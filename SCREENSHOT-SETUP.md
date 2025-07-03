# Screenshot Service Setup

Dieses UX-Analyse-Tool nutzt jetzt die **kostenlose Nodehive API** für Full-Page Website-Screenshots.

## 🆓 Nodehive API (Standard)

**✅ Komplett kostenlos** - Keine Registrierung erforderlich
**Website:** https://preview.nodehive.com

### Vorteile:

- 🎯 **Full-Page Screenshots** - Erfasst die komplette Website
- 🔓 **Keine API-Keys** - Funktioniert sofort ohne Setup
- 📱 **Mobile & Desktop** - Optimiert für beide Formate
- 🍪 **Modal-Dismissal** - Schließt Cookie-Banner automatisch
- ⚡ **Schnell & Zuverlässig** - Open Source Projekt

### Setup:

```bash
# Keine Environment Variables erforderlich!
# Nodehive funktioniert out-of-the-box
```

## 🔄 Fallback-Services (Optional)

Falls Nodehive nicht verfügbar ist, können diese Services als Fallback konfiguriert werden:

### ScreenshotOne (Fallback)

**Kostenlos:** 100 Screenshots/Monat

```bash
SCREENSHOT_ONE_ACCESS_KEY=your_access_key_here
```

### HTML/CSS to Image (Fallback)

**Kostenlos:** 50 Screenshots/Monat

```bash
HCTI_USER_ID=your_user_id_here
HCTI_API_KEY=your_api_key_here
```

## 🚀 Deployment

### Vercel/Netlify/Railway

Minimale Environment Variables:

```bash
OPENAI_API_KEY=your_openai_key_here
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# Optional - Fallback Services:
# SCREENSHOT_ONE_ACCESS_KEY=your_key_here
# HCTI_USER_ID=your_user_id_here
# HCTI_API_KEY=your_api_key_here
```

## ⚡ Warum Nodehive?

### vs. Andere Screenshot-Services:

- ✅ **Kostenlos & Unbegrenzt** statt monatliche Limits
- ✅ **Full-Page** statt nur Viewport
- ✅ **Keine Registrierung** statt Account-Management
- ✅ **Modal-Handling** statt Cookie-Banner-Probleme
- ✅ **Open Source** statt proprietäre APIs

## � Technische Details

### Nodehive API-Aufruf:

```typescript
const params = new URLSearchParams({
  url: encodeURIComponent("https://example.com"),
  resX: "1920",
  resY: "1080",
  outFormat: "png",
  waitTime: "3000",
  isFullPage: "true",
  dismissModals: "true",
});

fetch(`https://preview.nodehive.com/api/screenshot?${params}`);
```

### Service-Fallback-Kette:

1. **Nodehive** (Standard) - Kostenlos, Full-Page
2. **ScreenshotOne** (Fallback) - Bei Nodehive-Ausfall
3. **HCTI** (Notfall) - Letzte Option

**Empfehlung**: Nur Nodehive nutzen - einfach, kostenlos, zuverlässig! 🎯
