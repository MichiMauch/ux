# Lead Generator Setup

Der Lead Generator ermöglicht es Nutzern, sich nach einer UX-Analyse einen detaillierten PDF-Report per E-Mail zusenden zu lassen. Dies dient als Lead-Generierung und Marketing-Tool.

## Funktionalität

### ✅ PDF-Report per E-Mail

- Nutzer kann E-Mail-Adresse eingeben
- PDF wird automatisch generiert und versendet
- Enthält alle Analyse-Ergebnisse mit Empfehlungen

### ✅ Vollständiger Report-Inhalt

- **UX-Analyse**: Gesamtscore, Kategorien, Empfehlungen
- **PageSpeed**: Desktop/Mobile Performance-Scores
- **Meta Tags**: SEO-Score und fehlende Tags
- **Zusammenfassung**: Übersichtliche Darstellung aller Ergebnisse

### ✅ Professionelles Design

- Responsive E-Mail-Template
- PDF mit Corporate Design
- Status-Anzeigen und Ladeindikatoren

## Setup

### 1. Resend-Account erstellen

1. Gehe zu [resend.com](https://resend.com)
2. Erstelle einen kostenlosen Account
3. Verifiziere deine Domain oder nutze den Sandbox-Modus
4. Erstelle einen API-Key

### 2. Umgebungsvariablen konfigurieren

Kopiere `.env.example` zu `.env.local`:

```bash
cp .env.example .env.local
```

Fülle die folgenden Variablen aus:

```bash
# Resend API Key (erforderlich)
RESEND_API_KEY=re_your-resend-api-key-here

# Absender-E-Mail (muss in Resend verifiziert sein)
FROM_EMAIL=noreply@yourdomain.com
```

### 3. Domain-Verifizierung (Produktion)

Für Produktion musst du deine Domain in Resend verifizieren:

1. Gehe zu Resend Dashboard → Domains
2. Füge deine Domain hinzu
3. Konfiguriere die DNS-Records
4. Warte auf Verifizierung

**Hinweis**: Im Sandbox-Modus kannst du nur an deine eigene E-Mail-Adresse senden.

## API-Endpunkte

### POST `/api/send-report`

Erstellt und versendet einen PDF-Report per E-Mail.

**Request Body:**

```json
{
  "email": "user@example.com",
  "url": "https://example.com",
  "data": {
    "uxAnalysis": {
      /* UX-Analyse-Daten */
    },
    "pageSpeedData": {
      /* PageSpeed-Daten */
    },
    "metaTagsData": {
      /* Meta Tags-Daten */
    }
  },
  "timestamp": "3.7.2025"
}
```

**Response (Erfolg):**

```json
{
  "success": true,
  "message": "Report erfolgreich versendet",
  "emailId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response (Fehler):**

```json
{
  "success": false,
  "error": "Gültige E-Mail-Adresse erforderlich"
}
```

### GET `/api/send-report`

Health-Check für den Service.

## Frontend-Integration

### GetReportForm Komponente

Die Hauptkomponente für die E-Mail-Eingabe und den Report-Versand:

```tsx
import GetReportForm from "@/components/reports/GetReportForm";

// In deiner Komponente
<GetReportForm url="https://example.com" uxAnalysis={analysisResult} />;
```

**Features:**

- ✅ E-Mail-Validierung
- ✅ Status-Anzeigen (Laden, Erfolg, Fehler)
- ✅ Automatisches Laden der fehlenden Daten
- ✅ Responsive Design
- ✅ Übersicht der Report-Inhalte

### Integration ins Analysis-Dashboard

Der Lead Generator ist als eigener Tab integriert:

1. **Tab "PDF Report"** - Neben UX, Speed, Meta Tags
2. **Automatische Datensammlung** - Sammelt alle verfügbaren Analyse-Daten
3. **One-Click-Zugang** - Button "PDF-Report erhalten" in UX-Tab

## PDF-Generierung

### Technologie: @react-pdf/renderer

- ✅ **Vercel-kompatibel** - Funktioniert serverless
- ✅ **Performant** - Schnelle PDF-Generierung
- ✅ **Responsive** - Automatisches Layout
- ✅ **Styling** - Vollständiges CSS-Support

### PDF-Struktur

```
📄 UX-Analyse Report
├── 🏢 Website-Info (URL, Datum)
├── 📊 Gesamt-Bewertung (Score-Kreis)
├── 📝 Zusammenfassung
├── 🎯 Bewertungskategorien
│   ├── Navigation: 85/100
│   ├── Design: 78/100
│   └── Performance: 92/100
├── ⚡ PageSpeed Insights
│   ├── Desktop: 89/100
│   └── Mobile: 76/100
└── 🏷️ Meta Tags (SEO-Score: 73%)
```

## E-Mail-Template

### HTML-E-Mail mit:

- Responsive Design für alle E-Mail-Clients
- Übersichtliche Darstellung der Key-Metriken
- Professionelle Gestaltung
- PDF-Anhang mit aussagekräftigem Dateinamen

### Dateiname-Format:

```
UX-Report-{domain}-{datum}.pdf
# Beispiel: UX-Report-example-com-03-07-2025.pdf
```

## Error Handling

### API-Errors

- **400**: Ungültige E-Mail oder fehlende Daten
- **500**: Server-Fehler (API-Key, E-Mail-Service)
- **408**: Timeout (PDF-Generierung zu langsam)

### Frontend-Errors

- E-Mail-Validierung in Echtzeit
- Benutzerfreundliche Fehlermeldungen
- Retry-Mechanismus bei temporären Fehlern

### Logging

Alle Aktionen werden serverseitig geloggt:

```bash
# Development
npm run dev
# Check Console für Logs

# Production
# Check Vercel Function Logs
```

## Marketing-Integration

### Lead-Daten sammeln

Die E-Mail-Adressen können für Marketing genutzt werden:

1. **Newsletter-Anmeldung** - Follow-up E-Mails
2. **Service-Angebote** - Weitere UX-Services
3. **Content-Marketing** - UX-Tipps und Guides

### Tracking (Optional)

Integration mit Analytics möglich:

```typescript
// Google Analytics Event
gtag("event", "lead_generated", {
  event_category: "engagement",
  event_label: "pdf_report_requested",
});
```

## Performance-Optimierung

### PDF-Generierung

- Serverless-optimiert (< 10s Timeout)
- Minimaler Memory-Footprint
- Komprimierte PDF-Ausgabe

### Caching

- SWR für Daten-Caching
- Keine redundanten API-Calls
- Optimierte Ladezeiten

### E-Mail-Delivery

- Resend garantiert hohe Zustellrate
- Anti-Spam-Optimierung
- Bounce-Handling

## Monitoring

### Wichtige Metriken

- **Conversion Rate**: Analysen → PDF-Requests
- **E-Mail-Zustellrate**: Erfolgreich versendete Reports
- **Fehlerrate**: Failed PDF-Generierung/E-Mail-Versand

### Vercel Analytics

```bash
# Function Invocation Logs
vercel logs --app=your-app-name

# Performance Monitoring
# Check Vercel Dashboard für Function-Performance
```

## Trouble Shooting

### Häufige Probleme

#### "E-Mail-Service nicht konfiguriert"

- RESEND_API_KEY nicht gesetzt oder ungültig
- Prüfe API-Key in Resend Dashboard

#### "Ungültige E-Mail-Adresse"

- E-Mail-Format prüfen
- Sandbox-Modus: Nur verifizierte E-Mails erlaubt

#### PDF-Generierung schlägt fehl

- Analyse-Daten unvollständig
- Memory-Limit erreicht (selten)

#### E-Mail kommt nicht an

- Spam-Ordner prüfen
- Domain nicht verifiziert (Produktion)
- Resend-Status prüfen

### Debug-Tipps

```bash
# Local Development
npm run dev
# Check Console für API-Logs

# Test API direkt
curl -X POST http://localhost:3000/api/send-report \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","url":"https://example.com","data":{}}'
```

## Security

### E-Mail-Validierung

- Serverseitige E-Mail-Format-Prüfung
- Rate-Limiting für Spam-Schutz
- Input-Sanitization

### Datenschutz

- E-Mail-Adressen nur für Report-Versand
- Keine persistente Speicherung von E-Mails
- DSGVO-konforme Verarbeitung

## Deployment

### Vercel Deployment

```bash
# Build Test
npm run build

# Deploy
vercel --prod
```

### Umgebungsvariablen in Vercel

1. Gehe zu Vercel Dashboard
2. Project Settings → Environment Variables
3. Füge hinzu:
   - `RESEND_API_KEY`
   - `FROM_EMAIL`

## Kosten

### Resend Pricing (Stand 2025)

- **Free Tier**: 3.000 E-Mails/Monat kostenlos
- **Pro**: $20/Monat für 50.000 E-Mails
- **Business**: Ab $80/Monat

### Vercel Function Costs

- PDF-Generierung: ~1-2s Execution Time
- Bei 1.000 Reports/Monat: < $1 Zusatzkosten

## Weiterentwicklung

### Mögliche Erweiterungen

1. **A/B-Testing** - Verschiedene E-Mail-Templates
2. **Personalisierung** - Branchen-spezifische Reports
3. **Multi-Language** - Internationalisierung
4. **Erweiterte Analytics** - Heatmaps, User Journey
5. **CRM-Integration** - HubSpot, Salesforce
6. **White-Label** - Kundenspezifisches Branding

### Report-Erweiterungen

1. **Competitor Analysis** - Vergleich mit Konkurrenz
2. **Action Plan** - Priorisierte To-Do-Liste
3. **ROI-Calculator** - Business Impact Schätzung
4. **Follow-up Reports** - Progress Tracking
