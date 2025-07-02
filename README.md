# UX Website Checker

Eine moderne Web-App für automatisierte UX-Analysen von Websites mit KI-Power. Die App erstellt Screenshots von Desktop- und Mobile-Versionen einer Website und nutzt OpenAI Vision API für detaillierte UX-Bewertungen.

## 🚀 Features

- **Automatische Screenshots**: Desktop (1920x1080) und Mobile (375x667) Screenshots
- **KI-basierte UX-Analyse**: OpenAI Vision API für professionelle Bewertungen
- **Website-Typ-spezifische Analysen**: Corporate Websites und E-Commerce Shops
- **Detaillierte Bewertungen**: 5 Kategorien mit Scores von 1-10
- **Konkrete Verbesserungsvorschläge**: Umsetzbare Empfehlungen
- **Moderne UI**: Clean Design mit Tailwind CSS und shadcn/ui

## 🛠 Tech Stack

- **Frontend**: Next.js 14+ (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS v3, shadcn/ui
- **Screenshots**: Puppeteer
- **AI**: OpenAI Vision API (GPT-4 Vision)
- **Deployment**: Vercel-ready

## ⚡ Quick Start

### 1. Projekt klonen und Dependencies installieren

```bash
git clone <repository-url>
cd ux-website-checker
npm install
```

### 2. Umgebungsvariablen konfigurieren

Erstelle eine `.env.local` Datei im Root-Verzeichnis:

```bash
cp .env.example .env.local
```

Füge deinen OpenAI API Key hinzu:

```bash
OPENAI_API_KEY=sk-your-openai-api-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Development Server starten

```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) in deinem Browser.

## 📊 Analyse-Kriterien

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

## 🏗 Projektstruktur

```
src/
├── app/
│   ├── api/
│   │   ├── screenshot/          # Screenshot-Erstellung
│   │   └── analyze/             # KI-Analyse
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                 # Hauptseite
├── components/
│   ├── forms/
│   │   └── url-input-form.tsx   # URL-Eingabe-Formular
│   ├── results/
│   │   ├── analysis-dashboard.tsx # Ergebnisse-Dashboard
│   │   └── score-card.tsx       # Score-Karten
│   ├── layout/
│   │   └── header.tsx           # App-Header
│   └── ui/                      # shadcn/ui Komponenten
├── lib/
│   ├── screenshot-service.ts    # Puppeteer Service
│   ├── openai-client.ts         # OpenAI Integration
│   └── utils.ts                 # Utilities
└── types/
    └── analysis.ts              # TypeScript Typen
```

## 🔧 API Endpoints

### POST /api/screenshot

Erstellt Screenshots einer Website

**Request:**

```json
{
  "url": "https://example.com",
  "websiteType": "corporate" | "ecommerce"
}
```

**Response:**

```json
{
  "id": "unique-id",
  "status": "completed",
  "screenshots": {
    "desktop": "data:image/jpeg;base64,...",
    "mobile": "data:image/jpeg;base64,..."
  }
}
```

### POST /api/analyze

Analysiert Screenshots mit OpenAI Vision API

**Request:**

```json
{
  "screenshots": { "desktop": "...", "mobile": "..." },
  "websiteType": "corporate" | "ecommerce",
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

1. Push dein Repository zu GitHub
2. Verbinde dein Repository mit Vercel
3. Füge die Umgebungsvariablen in Vercel hinzu
4. Deploy!

### Environment Variables für Production

```bash
OPENAI_API_KEY=sk-your-openai-api-key-here
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 🔒 Sicherheit

- **API Key Schutz**: OpenAI API Key wird nur server-seitig verwendet
- **Input Validation**: URL-Validierung und Error-Handling
- **Rate Limiting**: Implementierung für Production empfohlen

## 📈 Erweiterungsmöglichkeiten

- **Weitere Website-Typen**: Blog, Portfolio, SaaS
- **Batch-Analyse**: Multiple URLs gleichzeitig
- **Historical Tracking**: Vergleich über Zeit
- **PDF-Reports**: Exportierbare Berichte
- **User-Accounts**: Gespeicherte Analysen
- **API für Drittanbieter**: Webhook-Integration

## 🤝 Beitragen

1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/amazing-feature`)
3. Commit deine Änderungen (`git commit -m 'Add amazing feature'`)
4. Push zum Branch (`git push origin feature/amazing-feature`)
5. Öffne eine Pull Request

## 📄 Lizenz

Dieses Projekt steht unter der MIT Lizenz. Siehe [LICENSE](LICENSE) für Details.
