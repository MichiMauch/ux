// Portfolio/Creative Website Analysis Configuration
export const PORTFOLIO_CATEGORIES = [
  'Visual Design & Brand Identity',
  'Portfolio Presentation',
  'User Experience & Navigation',
  'Professional Credibility',
  'Mobile & Responsive Design'
];

export function getPortfolioPrompt(url: string): string {
  return `Analysiere diese Website-Screenshots (Desktop und Mobile) für Portfolio/Creative UX-Qualität der Website: ${url}

BEWERTUNGSKRITERIEN (jeweils Score 1-10):

1. Visual Design & Brand Identity
- Ästhetik: Konsistentes Design, professioneller Eindruck, zur Zielgruppe passend?
- Farbschema: Harmonische Farbpalette, guter Kontrast, bewusste Farbwahl?
- Typografie: Charaktervolle Schriftarten, lesbar, zur Marke passend?
- Unique Selling Proposition: Persönlichkeit erkennbar, Alleinstellungsmerkmal klar?

2. Portfolio Presentation
- Projektqualität: Hochwertige Arbeitsproben, verschiedene Projekttypen, aktuell?
- Projektdetails: Ausführliche Beschreibungen, Rolle erklärt, Ergebnisse messbar?
- Kategorisierung: Logische Struktur, Filteroptionen, einfache Navigation zwischen Projekten?
- Medienqualität: Hochauflösende Bilder, schnelle Ladezeiten, optimierte Darstellung?

3. User Experience & Navigation
- Intuitive Navigation: Klare Menüstruktur, max. 3 Klicks zu jedem Inhalt?
- Information Architecture: Logischer Aufbau, wichtige Inhalte prominent platziert?
- Interaktivität: Smooth Scrolling, Hover-Effekte, angemessene Animationen?
- Call-to-Actions: Kontakt-Button prominent, klare Handlungsaufforderungen?

4. Professional Credibility
- About-Seite: Persönliche Story, Qualifikationen, Erfahrungen, Foto vorhanden?
- Kontaktinformationen: Vollständige Kontaktdaten, mehrere Kanäle, schnelle Erreichbarkeit?
- Testimonials: Kundenbewertungen, Referenzen, Logos bekannter Kunden?
- CV/Lebenslauf: Downloadbar, aktuell, professionell gestaltet?

5. Mobile & Responsive Design
- Mobile Optimierung: Vollständig responsive, Touch-optimierte Navigation?
- Performance: Schnelle Ladezeiten, optimierte Bilder, flüssige Animationen?
- Content-Priorisierung: Wichtigste Inhalte zuerst, reduzierte Navigation?
- Touch-Interaktion: Swipe-Gesten für Galerie, zoom-bare Bilder?

Für jede Kategorie:
- Vergib einen Score von 1-10 (1 = unprofessionell, 10 = herausragend)
- Erkläre die Bewertung in 2-3 prägnanten Sätzen
- Gib 3 konkrete, umsetzbare Verbesserungsvorschläge

WICHTIG: Antworte ausschließlich mit gültigem JSON ohne Markdown-Formatierung oder Code-Blöcke!

Antworte im folgenden JSON-Format:
{
  "overallScore": number,
  "categories": [
    {
      "name": "Visual Design & Brand Identity",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "Portfolio Presentation",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "User Experience & Navigation",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "Professional Credibility",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "Mobile & Responsive Design",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    }
  ],
  "summary": "string"
}`;
}