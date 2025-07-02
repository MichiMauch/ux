# UX Website Checker

Eine moderne Web-App # Nodehive Screenshot API (kostenlos für Full-Page-Screenshots)
# Keine API-Key erforderlich - verwendet preview.nodehive.com
# SCREENSHOT_ONE_ACCESS_KEY=your_screenshot_one_api_key_here (optional, Fallback) automatisierte UX-Analysen von Websites mit KI-Power. Die App erstellt Screenshots von Desktop- und Mobile-Versionen einer Website und nutzt OpenAI Vision API für detaillierte UX-Bewertungen.

## 🚀 Features

- **Automatische Screenshots**: Desktop (1920x1080) und Mobile (375x812) Screenshots
- **KI-basierte UX-Analyse**: OpenAI Vision API für professionelle Bewertungen
- **Website-Typ-spezifische Analysen**: Corporate Websites, E-Commerce, SaaS, Blogs und mehr
- **Detaillierte Bewertungen**: 5 Kategorien mit Scores von 1-10
- **Konkrete Verbesserungsvorschläge**: Umsetzbare Empfehlungen
- **Moderne UI**: Clean Design mit Tailwind CSS und shadcn/ui
- **Vercel-kompatibel**: Kein Puppeteer/Chromium - funktioniert in serverless Umgebung

## 🛠 Tech Stack

- **Frontend**: Next.js 15+ (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS v3, shadcn/ui
- **Screenshots**: Nodehive API (kostenlos, Full-Page-Screenshots)
- **AI**: OpenAI Vision API (GPT-4 Vision)
- **Deployment**: Vercel-ready

## ⚡ Quick Start

### 1. Projekt klonen und Dependencies installieren

```bash
git clone https://github.com/MichiMauch/ux.git
cd ux
npm install
```

### 2. Umgebungsvariablen konfigurieren

Erstelle eine `.env.local` Datei im Root-Verzeichnis:

```bash
# OpenAI API Key (erforderlich)
OPENAI_API_KEY=sk-your-openai-api-key-here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ScreenshotOne API Key (erforderlich für Screenshots)
# Kostenloser Account: https://screenshotone.com
SCREENSHOT_ONE_ACCESS_KEY=your_screenshot_one_access_key_here
```

Öffne [http://localhost:3000](http://localhost:3000) in deinem Browser.

## 📊 Analyse-Kriterien

Die App unterstützt verschiedene Website-Typen mit spezifischen Analyse-Kriterien:

### Corporate Websites
- **Navigation & Struktur**: Hauptnavigation, Breadcrumbs, Footer-Navigation
- **Content-Hierarchie**: Überschriften-Struktur, Informationshierarchie, Lesbarkeit
- **Call-to-Actions**: CTA-Erkennbarkeit, Kontaktmöglichkeiten, Handlungsaufforderungen
- **Mobile Experience**: Responsive Design, Touch-friendly Navigation, Mobile Lesbarkeit
- **Trust & Credibility**: Professionelles Erscheinungsbild, Kontaktdaten, Rechtliches

### E-Commerce Websites
- **Product Presentation**: Produktsichtbarkeit, Bildqualität, Preisdarstellung
- **Navigation & Search**: Kategorienübersicht, Suchfunktion, Filter-Optionen
- **Trust Signals**: Gütesiegel, Kundenbewertungen, Sicherheitshinweise
- **Conversion Optimization**: Warenkorb-Buttons, Checkout-Prozess, Versandinfos
- **Mobile Shopping**: Mobile Checkout, Touch-friendly Galerie, Ladezeiten

### SaaS Platforms
- **Product Clarity**: Feature-Darstellung, Nutzen-Kommunikation, Preismodell
- **Onboarding**: Anmeldeprozess, Demo-Zugang, Erste Schritte
- **Trust Building**: Kundenstimmen, Case Studies, Sicherheit
- **Conversion Funnel**: Trial-Buttons, Pricing-Seite, Kontaktformular
- **Technical UX**: Ladezeiten, Responsiveness, Zugänglichkeit

## 🏗 Projektstruktur

```
src/
├── app/
│   ├── api/
│   │   ├── screenshot/          # Screenshot-API (externe Services)
│   │   └── analyze/             # KI-Analyse-API
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                 # Hauptseite
├── components/
│   ├── forms/
│   │   └── url-input-form.tsx   # URL-Eingabe-Formular
│   ├── results/
│   │   ├── analysis-dashboard.tsx # Ergebnisse-Dashboard
│   │   ├── score-card.tsx       # Score-Karten
│   │   └── additional-checks.tsx # Zusätzliche Prüfungen
│   ├── layout/
│   │   ├── header.tsx           # App-Header
│   │   └── footer.tsx           # App-Footer
│   └── ui/                      # shadcn/ui Komponenten
├── lib/
│   ├── openai-client.ts         # OpenAI Integration
│   ├── scoring.ts               # Bewertungslogik
│   ├── url-utils.ts             # URL-Utilities
│   └── website-types/           # Website-Typ-Definitionen
│       ├── index.ts
│       ├── corporate.ts
│       ├── ecommerce.ts
│       ├── saas.ts
│       └── ...
└── types/
    └── analysis.ts              # TypeScript Typen
```

## 🔧 API Endpoints

### POST /api/screenshot

Erstellt Screenshots einer Website

**Request:**

```json
{
  "url": "https://example.com"
}
```

**Response:**

```json
{
  "id": "unique-id",
  "status": "completed",
  "screenshots": {
    "desktop": "data:image/png;base64,...",
    "mobile": "data:image/png;base64,..."
  }
}
```

### POST /api/analyze

Analysiert Screenshots mit OpenAI Vision API

**Request:**

```json
{
  "screenshots": { "desktop": "...", "mobile": "..." },
  "websiteType": "corporate" | "ecommerce" | "saas" | "blog",
  "url": "https://example.com"
}
```

**Response:**

```json
{
  "id": "analysis-id",
  "overallScore": 7.2,
  "categories": [...],
  "summary": "Detaillierte Zusammenfassung...",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🚀 Deployment

### Vercel (Empfohlen)

Die App ist vollständig Vercel-kompatibel (kein Puppeteer/Chromium):

1. Push dein Repository zu GitHub
2. Verbinde dein Repository mit Vercel
3. Füge die Umgebungsvariablen in Vercel hinzu:
   ```bash
   OPENAI_API_KEY=sk-your-openai-api-key-here
   SCREENSHOT_ONE_ACCESS_KEY=your-screenshot-one-access-key
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   ```
4. Deploy!

### Nodehive Screenshots Setup

Die App verwendet jetzt die kostenlose Nodehive API für Full-Page-Screenshots:

1. **Keine Registrierung erforderlich** - Die API ist kostenlos verfügbar
2. **Full-Page-Screenshots** - Erfasst die gesamte Website, nicht nur den Viewport
3. **Mobile & Desktop** - Automatische Anpassung für verschiedene Bildschirmgrößen
4. **Modal-Dismissal** - Automatisches Schließen von Pop-ups und Cookie-Bannern

**Features:**
- Desktop: 1920x1080 Full-Page-Screenshot  
- Mobile: 375x812 Full-Page-Screenshot
- 3 Sekunden Wartezeit für vollständiges Laden
- Automatisches Schließen von Modals/Pop-ups
- PNG-Format für beste Qualität

Die ScreenshotOne API bleibt als Fallback verfügbar, falls Nodehive nicht funktioniert.

**Detaillierte Setup-Anleitung**: [NODEHIVE-SETUP.md](NODEHIVE-SETUP.md)

## 🔒 Sicherheit & Performance

- **Serverless-kompatibel**: Keine Puppeteer/Chromium Dependencies
- **API Key Schutz**: OpenAI API Key wird nur server-seitig verwendet
- **Input Validation**: URL-Validierung und Error-Handling
- **Fallback-System**: Multiple Screenshot-Services für Ausfallsicherheit
- **Rate Limiting**: Implementierung für Production empfohlen

## 📈 Erweiterungsmöglichkeiten

- **Weitere Website-Typen**: Blog, Portfolio, Government, Healthcare
- **Batch-Analyse**: Multiple URLs gleichzeitig
- **Historical Tracking**: Vergleich über Zeit  
- **PDF-Reports**: Exportierbare Berichte
- **User-Accounts**: Gespeicherte Analysen
- **API für Drittanbieter**: Webhook-Integration
- **Lighthouse Integration**: Performance-Metriken
- **Accessibility Checks**: WCAG-konform Prüfungen

## 🤝 Beitragen

1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/amazing-feature`)
3. Commit deine Änderungen (`git commit -m 'Add amazing feature'`)
4. Push zum Branch (`git push origin feature/amazing-feature`)
5. Öffne eine Pull Request

## 📝 Lizenz

MIT License - siehe [LICENSE](LICENSE) für Details.

## 📄 Lizenz

Dieses Projekt steht unter der MIT Lizenz. Siehe [LICENSE](LICENSE) für Details.
