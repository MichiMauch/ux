# Google PageSpeed Insights Integration

Diese Dokumentation erklärt die Integration der Google PageSpeed Insights API in die UX-Analyzer App.

## Setup

### 1. Google API Key erhalten

1. Gehe zur [Google Cloud Console](https://console.cloud.google.com/)
2. Erstelle ein neues Projekt oder wähle ein bestehendes aus
3. Aktiviere die "PageSpeed Insights API"
4. Erstelle einen API-Schlüssel unter "APIs & Services" > "Credentials"
5. Beschränke den API-Schlüssel optional auf die PageSpeed Insights API

### 2. Umgebungsvariable setzen

Füge den API-Schlüssel zu deiner `.env.local` Datei hinzu:

```bash
GOOGLE_PAGESPEED_API_KEY=your-google-pagespeed-api-key-here
```

## API-Endpunkt

### GET `/api/pagespeed`

Analysiert die Performance einer Website mit Google PageSpeed Insights.

**Parameter:**

- `url` (required): Die zu analysierende URL

**Beispiel:**

```
GET /api/pagespeed?url=https://example.com
```

**Response:**

```json
{
  "performance": 85,
  "accessibility": 92,
  "bestPractices": 88,
  "seo": 95,
  "metrics": {
    "firstContentfulPaint": {
      "id": "first-contentful-paint",
      "title": "First Contentful Paint",
      "score": 85,
      "displayValue": "1.2 s"
    },
    "largestContentfulPaint": {
      "id": "largest-contentful-paint",
      "title": "Largest Contentful Paint",
      "score": 75,
      "displayValue": "2.1 s"
    }
    // ... weitere Metriken
  },
  "opportunities": [
    {
      "id": "unused-javascript",
      "title": "Remove unused JavaScript",
      "description": "Reduce unused JavaScript and defer loading scripts until they are required to decrease bytes consumed by network activity.",
      "displayValue": "Potential savings of 45 KiB"
    }
    // ... weitere Verbesserungsvorschläge
  ],
  "url": "https://example.com",
  "timestamp": "2025-07-03T10:30:00.000Z"
}
```

## Frontend-Integration

### PageSpeedCard Komponente

Die `PageSpeedCard` Komponente verwendet SWR für asynchrones Laden der PageSpeed-Daten:

```tsx
import { PageSpeedCard } from "@/components/analysis/pagespeed-card";

// In deiner Komponente
<PageSpeedCard url="https://example.com" />;
```

**Features:**

- ✅ Automatisches Laden im Hintergrund
- ✅ Loading-State mit Animation
- ✅ Error-Handling mit hilfreichen Fehlermeldungen
- ✅ Caching für 1 Minute
- ✅ Retry-Mechanismus bei Fehlern
- ✅ Core Web Vitals Anzeige
- ✅ Performance-Scores mit Farb-Kodierung
- ✅ Top 3 Verbesserungsvorschläge

### SWR Konfiguration

```tsx
const { data, error, isLoading } = useSWR<PageSpeedResult>(
  url ? `/api/pagespeed?url=${encodeURIComponent(url)}` : null,
  fetcher,
  {
    refreshInterval: 0, // Kein automatisches Refresh
    revalidateOnFocus: false, // Nicht bei Fokus neu laden
    dedupingInterval: 60000, // 1 Minute Cache
    errorRetryCount: 2, // 2 Retry-Versuche
    errorRetryInterval: 5000, // 5 Sekunden zwischen Retries
  }
);
```

## Core Web Vitals

Die Komponente zeigt die wichtigsten Core Web Vitals:

- **FCP (First Contentful Paint)**: Zeit bis zum ersten sichtbaren Content
- **LCP (Largest Contentful Paint)**: Zeit bis zum größten Content-Element
- **CLS (Cumulative Layout Shift)**: Maß für Layout-Verschiebungen
- **TBT (Total Blocking Time)**: Zeit, in der der Main Thread blockiert ist

## Bewertungssystem

### Scores (0-100)

- **90-100**: Grün (Ausgezeichnet)
- **50-89**: Gelb (Verbesserungsbedarf)
- **0-49**: Rot (Schlecht)

### Kategorien

- **Performance**: Ladegeschwindigkeit und Core Web Vitals
- **Accessibility**: Barrierefreiheit der Website
- **Best Practices**: Moderne Web-Standards
- **SEO**: Suchmaschinenoptimierung

## Error-Handling

Die API behandelt verschiedene Fehlertypen:

1. **Fehlende URL**: HTTP 400
2. **Ungültige URL**: HTTP 400
3. **API-Key nicht konfiguriert**: HTTP 500
4. **Google API Fehler**: HTTP 500 mit Details
5. **Netzwerk-Fehler**: HTTP 500

Im Frontend werden Fehler benutzerfreundlich angezeigt mit:

- Klarer Fehlermeldung
- Möglichen Ursachen
- Retry-Mechanismus

## Tipps

### Performance optimieren

- API-Calls werden automatisch dedupliziert
- Ergebnisse werden für 1 Minute gecacht
- Komponente lädt nur bei Bedarf

### API-Limits beachten

- Google PageSpeed Insights hat Quotas
- Bei vielen Anfragen ggf. Caching erweitern
- Monitoring der API-Nutzung empfohlen

### Mobile vs. Desktop

- Aktuell wird Desktop-Performance analysiert
- Für Mobile-Analyse `strategy=mobile` Parameter verwenden
- Beide Strategien in separaten Requests möglich

## Troubleshooting

### Häufige Probleme

1. **"PageSpeed API not configured"**
   - API-Key in `.env.local` überprüfen
   - Server neu starten nach Änderung

2. **"HTTP 403: Forbidden"**
   - API-Key überprüfen
   - PageSpeed Insights API aktiviert?

3. **"Request timeout"**
   - URL erreichbar?
   - Große Websites brauchen länger

4. **"Too Many Requests"**
   - API-Limit erreicht
   - Caching-Zeit erhöhen oder weniger Requests

### Debug-Logs

Server-Logs zeigen Details:

```bash
npm run dev
# In Browser Console oder Server Terminal
```

## Weiterentwicklung

### Mögliche Erweiterungen

- Mobile + Desktop Analyse parallel
- Historische Daten speichern
- Performance-Trends über Zeit
- Competitive Analysis
- Automatische Performance-Reports

### Code-Struktur

```
src/
├── app/api/pagespeed/route.ts          # API-Endpunkt
├── components/analysis/
│   └── pagespeed-card.tsx              # Frontend-Komponente
└── components/results/
    └── analysis-dashboard.tsx          # Integration in Dashboard
```
