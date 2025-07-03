# Meta Tags Analyse Integration

Diese Dokumentation erklärt die Meta Tags-Analyse Funktionalität in der UX-Analyzer App.

## Übersicht

Die Meta Tags-Analyse prüft automatisch, ob wichtige SEO und Social Media Tags auf einer Website vorhanden sind und gibt konkrete Empfehlungen zur Verbesserung.

## Features

### ✅ Geprüfte Tag-Kategorien

**Meta Tags (SEO):**
- `title` - Seitentitel für Suchmaschinen
- `description` - Meta-Beschreibung für Suchergebnisse  
- `canonical` - Canonical URL gegen Duplicate Content
- `robots` - Crawler-Anweisungen für Suchmaschinen
- `viewport` - Mobile-Optimierung

**Open Graph Tags (Social Media):**
- `og:title` - Titel beim Teilen auf sozialen Medien
- `og:description` - Beschreibung für Social Media Posts
- `og:url` - Kanonische URL für Social Sharing
- `og:type` - Content-Type (website, article, etc.)
- `og:image` - Vorschaubild für Social Media

**Twitter Cards:**
- `twitter:card` - Twitter Card-Type (summary, large_image)
- `twitter:title` - Titel für Twitter-Cards
- `twitter:description` - Beschreibung für Twitter
- `twitter:image` - Bild für Twitter-Vorschau

### ✅ Bewertungssystem

- **Score**: Prozentualer Anteil vorhandener Tags (0-100%)
- **Status-Icons**: ✅ Vorhanden, ⚠️ Leer, ❌ Fehlend
- **Empfehlungen**: Konkrete Tipps für fehlende Tags

## API-Endpunkt

### GET `/api/meta-tags`

Analysiert die Meta Tags einer Website durch HTML-Parsing.

**Parameter:**
- `url` (required): Die zu analysierende URL

**Beispiel:**
```
GET /api/meta-tags?url=https://example.com
```

**Response:**
```json
{
  "url": "https://example.com",
  "timestamp": "2025-07-03T14:30:00.000Z",
  "summary": {
    "total": 14,
    "present": 10,
    "missing": 4,
    "score": 71
  },
  "checks": [
    {
      "group": "Meta Tags",
      "tag": "title",
      "present": true,
      "content": "Beispiel Website - Startseite"
    },
    {
      "group": "Meta Tags", 
      "tag": "description",
      "present": false,
      "content": null,
      "recommendation": "Die Meta-Description erscheint in Suchergebnissen und beeinflusst die Klickrate. Optimal sind 150-160 Zeichen."
    }
  ]
}
```

## Frontend-Integration

### MetaTagsCard Komponente

Die `MetaTagsCard` wird automatisch im "Meta Tags" Tab der Analyse-Dashboard angezeigt:

```tsx
import MetaTagsCard from '@/components/results/meta-tags-card';

// Automatisch integriert in AnalysisDashboard
<MetaTagsCard url="https://example.com" />
```

**Features:**
- ✅ Tab-Navigation: Meta Tags, Open Graph, Twitter, Empfehlungen
- ✅ Status-Icons für jeden Tag
- ✅ Vollständiger Content-Preview mit Truncation
- ✅ Responsive Design mit Tabellen
- ✅ Score-Anzeige mit Fortschrittsbalken
- ✅ Detaillierte Empfehlungen für fehlende Tags

### UI-Struktur

```
┌─────────────────────────────────────────────────────────────┐
│  Meta Tags Analyse                                Score: 71% │
├─────────────────────────────────────────────────────────────┤
│  [Meta Tags] [Open Graph] [Twitter] [Empfehlungen (4)]     │
├─────────────────────────────────────────────────────────────┤
│  Status │ Tag              │ Inhalt                         │
│  ✅     │ title            │ Beispiel Website - Startseite   │  
│  ❌     │ description      │ Nicht vorhanden               │
│  ✅     │ canonical        │ https://example.com/           │
└─────────────────────────────────────────────────────────────┘
```

### Tab-Navigation

1. **Meta Tags**: SEO-relevante Meta Tags
2. **Open Graph**: Social Media Sharing Tags  
3. **Twitter**: Twitter-spezifische Cards
4. **Empfehlungen**: Alle fehlenden Tags mit Verbesserungsvorschlägen

## Technische Details

### HTML-Parsing mit Cheerio

```typescript
import * as cheerio from 'cheerio';

const $ = cheerio.load(html);
const title = $('title').text();
const description = $('meta[name="description"]').attr('content');
const ogImage = $('meta[property="og:image"]').attr('content');
```

### Tag-Konfiguration

Jeder Tag wird mit einem konfigurierbaren Objekt definiert:

```typescript
interface TagConfig {
  selector: string;      // CSS-Selektor für das Element
  attribute?: string;    // HTML-Attribut (falls nicht textContent)
  recommendation: string; // Empfehlung bei fehlendem Tag
}
```

### Error-Handling

Die API behandelt verschiedene Fehlertypen:

1. **Fehlende URL**: HTTP 400
2. **Ungültige URL**: HTTP 400
3. **Fetch-Fehler**: HTTP 500 mit Details
4. **Timeout**: HTTP 408 (10 Sekunden Limit)
5. **HTML-Parsing Fehler**: HTTP 500

## Integration in die App

### 1. Neue Tab-Navigation

```typescript
const [activeTab, setActiveTab] = useState<"ux" | "speed" | "meta">("ux");
```

### 2. Automatisches Laden

Die Meta Tags-Analyse startet automatisch, sobald eine URL analysiert wird - parallel zu UX-Check und Speed Test.

### 3. Caching

- SWR-basiertes Caching für 5 Minuten
- Keine Retry bei erfolgreichen Analysen
- Automatische Deduplizierung

## Empfehlungen-System

### Kategorisierte Empfehlungen

Jeder fehlende Tag wird mit einer spezifischen Empfehlung angezeigt:

```typescript
{
  tag: "og:image",
  recommendation: "Das og:image wird als Vorschaubild beim Teilen angezeigt. Empfohlene Größe: 1200x630 Pixel."
}
```

### Priorisierung

- **Meta Tags**: Höchste Priorität (SEO-kritisch)
- **Open Graph**: Mittlere Priorität (Social Media)
- **Twitter Cards**: Niedrigste Priorität (Twitter-spezifisch)

## Performance-Optimierungen

### 1. Request-Optimierung
- 10 Sekunden Timeout für langsame Websites
- User-Agent Header für bessere Kompatibilität
- Accept-Header für HTML-Content

### 2. Frontend-Optimierung
- Lazy Loading der Tab-Inhalte
- Content-Truncation für lange Meta-Inhalte
- Responsive Tabellen für mobile Geräte

### 3. Caching-Strategie
- Client-seitiges SWR Caching
- Keine automatischen Refreshs
- Cache-Invalidation bei URL-Wechsel

## Häufige Meta Tags-Probleme

### 1. Fehlende Title Tags
```html
<!-- Schlecht -->
<title></title>

<!-- Gut -->
<title>Prägnante Beschreibung (50-60 Zeichen)</title>
```

### 2. Fehlende Meta Description
```html
<!-- Fehlend -->
<!-- Keine meta description -->

<!-- Gut -->
<meta name="description" content="Aussagekräftige Beschreibung für Suchmaschinen (150-160 Zeichen)">
```

### 3. Fehlende Open Graph Tags
```html
<!-- Minimal erforderlich -->
<meta property="og:title" content="Seitentitel">
<meta property="og:description" content="Beschreibung">
<meta property="og:image" content="https://example.com/image.jpg">
<meta property="og:url" content="https://example.com/page">
```

## Troubleshooting

### Häufige Probleme

1. **"Failed to fetch URL"**
   - URL nicht erreichbar oder blockiert Bots
   - Timeout nach 10 Sekunden

2. **"Invalid URL format"**  
   - URL-Format prüfen (http/https)
   - Vollständige URL angeben

3. **"Parsing Error"**
   - Website liefert kein gültiges HTML
   - JavaScript-heavy Websites (CSR)

### Debug-Informationen

Server-Logs zeigen Details:
```bash
npm run dev
# Check Terminal für Meta Tags API Logs
```

## Weiterentwicklung

### Mögliche Erweiterungen

1. **Structured Data**: Schema.org Markup-Analyse
2. **Favicon-Check**: Verschiedene Favicon-Größen prüfen
3. **Language Tags**: hreflang und lang-Attribute
4. **Performance Tags**: Preload, Prefetch Resources
5. **Security Headers**: CSP, HSTS als Meta Tags
6. **Mobile Tags**: app-id, apple-touch-icon
7. **Historical Data**: Meta Tags-Änderungen über Zeit tracken

### Code-Struktur

```
src/
├── app/api/meta-tags/route.ts              # API-Endpunkt
├── components/results/
│   └── meta-tags-card.tsx                  # Frontend-Komponente
└── components/results/
    └── analysis-dashboard.tsx              # Integration in Dashboard
```
