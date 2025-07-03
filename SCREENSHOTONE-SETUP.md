# Nodehive Screenshot Integration

Diese App nutzt die kostenlose [Nodehive Screenshot API](https://preview.nodehive.com/) für hochwertige Full-Page Website-Screenshots.

## 🆓 Komplett kostenlos

### Keine Registrierung erforderlich

- ✅ **Kostenlos**: Keine API-Keys oder Registrierung erforderlich
- ✅ **Full-Page**: Erfasst die komplette Website, nicht nur den Viewport
- ✅ **Unbegrenzt**: Keine Limits oder Beschränkungen
- ✅ **Open Source**: [GitHub Repository verfügbar](https://github.com/elestio/ws-screenshot/)

### Keine Konfiguration notwendig

Die Nodehive API funktioniert sofort ohne Setup:

```bash
# Keine API-Keys erforderlich!
# Die App funktioniert direkt out-of-the-box
```

## 📋 Features der Integration

### Screenshot-Einstellungen

- **Desktop**: 1920x1080 Full-Page-Screenshot
- **Mobile**: 375x812 Full-Page-Screenshot
- **Format**: PNG (OpenAI-kompatibel)
- **Wartezeit**: 3 Sekunden für vollständiges Laden
- **Modal-Dismissal**: Automatisches Schließen von Pop-ups
- **Full-Page**: Komplette Website-Erfassung

### Optimierungen

- ✅ **Full-Page Screenshots** (`isFullPage: true`)
- ✅ **Modal-Dismissal** (`dismissModals: true`) - Schließt Cookie-Banner automatisch
- ✅ **Optimale Wartezeit** (`waitTime: 3000ms`) - Zeit für vollständiges Laden
- ✅ **PNG-Format** für beste Qualität bei OpenAI Vision API
- ✅ **Responsive**: Separate Desktop/Mobile-Screenshots
- ✅ **Base64-Encoding** für direkte OpenAI-Übertragung

## � API-Endpunkt

### Nodehive Screenshot API

- **100 Screenshots/Monat** kostenlos
- Vollständige API-Features
- PNG/JPEG/WebP Formate
- Keine Wasserzeichen

```
GET https://preview.nodehive.com/api/screenshot?resX=1920&resY=1080&outFormat=png&waitTime=3000&isFullPage=true&dismissModals=true&url=https://example.com
```

**Parameter:**

- `resX`, `resY`: Bildschirmauflösung
- `outFormat`: png oder jpg
- `waitTime`: Wartezeit in Millisekunden
- `isFullPage`: true für komplette Website
- `dismissModals`: true für automatisches Schließen von Pop-ups
- `url`: URL der Website (URL-encoded)

### Response

Direkte PNG-Bilddaten im Response Body - bereit für OpenAI Vision API.

## 🚀 Deployment (Vercel/Netlify)

Keine zusätzlichen Environment Variables erforderlich:

```bash
OPENAI_API_KEY=dein_openai_key
NEXT_PUBLIC_APP_URL=https://deine-domain.vercel.app
# Nodehive funktioniert ohne API-Keys!
```

## 🔧 Technische Details

### Integration in der App

```typescript
// Nodehive Screenshot Service
const params = new URLSearchParams({
  url: encodeURIComponent(targetUrl),
  resX: "1920",
  resY: "1080",
  outFormat: "png",
  waitTime: "3000",
  isFullPage: "true",
  dismissModals: "true",
});

const response = await fetch(
  `https://preview.nodehive.com/api/screenshot?${params}`
);
```

## ✅ Vorteile gegenüber anderen Services

### vs. ScreenshotOne

- ✅ **Kostenlos** statt kostenpflichtig
- ✅ **Full-Page** standardmäßig
- ✅ **Keine API-Keys** erforderlich
- ✅ **Modal-Dismissal** integriert

### vs. Puppeteer

- ✅ **Serverless-kompatibel** (kein Chromium)
- ✅ **Keine Dependencies**
- ✅ **Bessere Performance**
- ✅ **Einfachere Wartung**

## 🐛 Troubleshooting

### Häufige Probleme

1. **Screenshots werden nicht geladen**

   - Überprüfe Browser Console für Fehler
   - Überprüfe ob die Ziel-URL erreichbar ist
   - Versuche URL-Encoding für Parameter

2. **Unvollständige Screenshots**

   - `waitTime` erhöhen (3000ms → 5000ms)
   - `isFullPage: true` überprüfen

3. **Deployment-Probleme**
   - Keine API-Keys erforderlich
   - Nodehive ist öffentlich verfügbar

### Debug-Informationen

Die App zeigt detaillierte Logs in der Browser Console:

```
Making Nodehive request for 1920x1080 (full-page: true)
Nodehive success: 161076 characters, content-type: image/png
```

## 📚 Weitere Ressourcen

- [Nodehive Website](https://preview.nodehive.com/)
- [GitHub Repository](https://github.com/elestio/ws-screenshot/)
- [API Dokumentation](https://preview.nodehive.com/) (Inline verfügbar)
- **Community**: Kostenlos und Open Source
