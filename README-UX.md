# UX Website Checker App

Eine moderne Web-App für automatisierte UX-Analysen von Websites mit KI-Power. Die App macht Screenshots von Desktop- und Mobile-Versionen einer Website und nutzt die OpenAI Vision API für detaillierte UX-Bewertungen.

## 🚀 Features

- **Automatische Screenshots**: Desktop (1920x1080) und Mobile (375x667) Screenshots
- **KI-basierte Analyse**: OpenAI GPT-4 Vision für detaillierte UX-Bewertungen
- **Zwei Website-Typen**: Corporate und E-Commerce mit spezifischen Bewertungskriterien
- **Moderne UI**: Next.js 14, React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Responsive Design**: Mobile-first Ansatz mit professionellem Design
- **Detaillierte Reports**: Scores, Kategorien und konkrete Verbesserungsvorschläge

## 📋 Bewertungskriterien

### Corporate Websites

- Navigation & Struktur (1-10)
- Content-Hierarchie (1-10)
- Call-to-Actions (1-10)
- Mobile Experience (1-10)
- Trust & Credibility (1-10)

### E-Commerce Websites

- Product Presentation (1-10)
- Navigation & Search (1-10)
- Trust Signals (1-10)
- Conversion Optimization (1-10)
- Mobile Shopping (1-10)

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS v3, shadcn/ui
- **Screenshots**: Puppeteer
- **AI**: OpenAI Vision API (GPT-4 Vision)
- **Icons**: Lucide React
- **Charts**: Recharts

## 📦 Installation

1. **Repository klonen**

   ```bash
   git clone <your-repo-url>
   cd ux-website-checker
   ```

2. **Dependencies installieren**

   ```bash
   npm install
   ```

3. **Umgebungsvariablen konfigurieren**

   ```bash
   cp .env.example .env.local
   ```

   Dann in `.env.local`:

   ```env
   OPENAI_API_KEY=sk-your-openai-api-key-here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Development Server starten**

   ```bash
   npm run dev
   ```

   Die App ist unter http://localhost:3000 verfügbar.

## 🔧 Konfiguration

### OpenAI API Key

1. Gehen Sie zu https://platform.openai.com/api-keys
2. Erstellen Sie einen neuen API Key
3. Fügen Sie den Key in Ihre `.env.local` Datei ein

### Puppeteer (für Screenshots)

Puppeteer wird automatisch mit Chromium installiert. Für Deployment auf Vercel sind zusätzliche Konfigurationen erforderlich.

## 🚀 Deployment

### Vercel (Empfohlen)

1. **Vercel CLI installieren**

   ```bash
   npm i -g vercel
   ```

2. **Deployment**

   ```bash
   vercel
   ```

3. **Environment Variables setzen**
   - Gehen Sie zu Vercel Dashboard → Ihr Projekt → Settings → Environment Variables
   - Fügen Sie `OPENAI_API_KEY` hinzu

## 📁 Projektstruktur

```
src/
├── app/
│   ├── api/
│   │   ├── screenshot/route.ts    # Screenshot API
│   │   └── analyze/route.ts       # KI-Analyse API
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                   # Hauptseite
├── components/
│   ├── forms/
│   │   └── url-input-form.tsx     # URL-Eingabe Formular
│   ├── layout/
│   │   ├── header.tsx             # Header Navigation
│   │   └── footer.tsx             # Footer
│   ├── results/
│   │   ├── analysis-dashboard.tsx # Ergebnisse Dashboard
│   │   └── score-card.tsx         # Score Karten
│   └── ui/                        # shadcn/ui Komponenten
├── lib/
│   ├── nodehive-screenshot-service.ts  # Nodehive Full-Page Screenshots
│   ├── openai-client.ts               # OpenAI API Client
│   ├── website-types/                 # Website-spezifische Prompts
│   └── utils.ts                       # Utility Funktionen
└── types/
    └── analysis.ts                # TypeScript Typen
```

## 🔍 API Endpoints

### POST /api/screenshot

Screenshots einer Website erstellen.

**Request:**

```json
{
  "url": "https://example.com",
  "websiteType": "corporate"
}
```

**Response:**

```json
{
  "id": "screenshot-id",
  "status": "completed",
  "screenshots": {
    "desktop": "data:image/jpeg;base64,...",
    "mobile": "data:image/jpeg;base64,..."
  }
}
```

### POST /api/analyze

KI-Analyse der Screenshots durchführen.

**Request:**

```json
{
  "screenshots": {
    "desktop": "data:image/jpeg;base64,...",
    "mobile": "data:image/jpeg;base64,..."
  },
  "websiteType": "corporate",
  "url": "https://example.com"
}
```

**Response:**

```json
{
  "id": "analysis-id",
  "url": "https://example.com",
  "websiteType": "corporate",
  "overallScore": 7.2,
  "categories": [
    {
      "name": "Navigation & Struktur",
      "score": 8,
      "description": "Die Navigation ist klar strukturiert...",
      "recommendations": ["Breadcrumbs hinzufügen", "..."]
    }
  ],
  "summary": "Die Website zeigt eine solide UX-Performance...",
  "timestamp": "2025-06-11T10:00:00Z"
}
```

## 🚧 Erste Schritte

1. **OpenAI API Key konfigurieren** - Das ist der wichtigste Schritt für die KI-Analyse
2. **Test-Website analysieren** - Beginnen Sie mit einer einfachen Website
3. **Ergebnisse überprüfen** - Schauen Sie sich die generierten Reports an
4. **Anpassungen vornehmen** - Modifizieren Sie die Prompts nach Bedarf

## 📈 Nächste Schritte

- PDF-Report-Generation implementieren
- Weitere Website-Typen hinzufügen
- User Authentication & Dashboard
- Batch-Analyse für mehrere URLs
- Historical Tracking von Änderungen
