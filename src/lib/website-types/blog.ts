// Blog/News Website Analysis Configuration
export const BLOG_CATEGORIES = [
  'Content Presentation & Readability',
  'Navigation & Content Discovery',
  'Engagement & Community',
  'Performance & Accessibility',
  'Mobile Reading Experience'
];

export function getBlogPrompt(url: string): string {
  return `Analysiere diese Website-Screenshots (Desktop und Mobile) für Blog/News UX-Qualität der Website: ${url}

BEWERTUNGSKRITERIEN (jeweils Score 1-10):

1. Content Presentation & Readability
- Typografie: Lesbare Schriftgröße, ausreichender Zeilenabstand, guter Kontrast?
- Artikel-Layout: Klare Struktur, Überschriften-Hierarchie, visuelle Abschnitte?
- Multimedia-Integration: Relevante Bilder, Videos gut eingebunden, angemessene Dateigröße?
- Textformatierung: Absätze, Listen, Hervorhebungen sinnvoll eingesetzt?

2. Navigation & Content Discovery
- Kategorien/Tags: Logische Struktur, einfach auffindbar, konsistente Bezeichnungen?
- Suchfunktion: Prominent platziert, erweiterte Suchoptionen, relevante Ergebnisse?
- Archiv/Datum: Chronologische Navigation, Archiv-Seiten, Datum klar erkennbar?
- Related Content: "Ähnliche Artikel", "Mehr vom Autor", thematische Verlinkungen?

3. Engagement & Community
- Kommentar-System: Einfach zu bedienen, Moderation erkennbar, Social Login?
- Social Sharing: Alle wichtigen Plattformen, gut platziert, Share-Counter?
- Newsletter/Abo: Opt-in prominent, verschiedene Abo-Optionen, Vorteile klar?
- Autor-Informationen: Profilbilder, Bio, Kontaktmöglichkeiten, andere Artikel?

4. Performance & Accessibility
- Ladezeiten: Schnelle Darstellung, optimierte Bilder, Lazy Loading?
- SEO-Optimierung: Meta-Descriptions, strukturierte Daten, saubere URLs?
- Barrierefreiheit: Alt-Texte, Tastaturnavigation, Screen Reader kompatibel?
- Cross-Browser: Funktioniert in allen gängigen Browsern?

5. Mobile Reading Experience
- Mobile Typografie: Angepasste Schriftgrößen, optimierte Zeilenlänge?
- Touch-Navigation: Einfache Bedienung, ausreichend große Touch-Targets?
- Offline-Reading: PWA-Features, Offline-Verfügbarkeit, Leseliste?
- Mobile Performance: Schnelle Ladezeiten, datensparsame Darstellung?

Für jede Kategorie:
- Vergib einen Score von 1-10 (1 = sehr schlecht, 10 = ausgezeichnet)
- Erkläre die Bewertung in 2-3 prägnanten Sätzen
- Gib 3 konkrete, umsetzbare Verbesserungsvorschläge

WICHTIG: Antworte ausschließlich mit gültigem JSON ohne Markdown-Formatierung oder Code-Blöcke!

Antworte im folgenden JSON-Format:
{
  "overallScore": number,
  "categories": [
    {
      "name": "Content Presentation & Readability",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "Navigation & Content Discovery",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "Engagement & Community",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "Performance & Accessibility",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "Mobile Reading Experience",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    }
  ],
  "summary": "string"
}`;
}