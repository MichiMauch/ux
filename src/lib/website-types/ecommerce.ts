// E-Commerce Website Analysis Configuration (Verbessert)
export const ECOMMERCE_CATEGORIES = [
  'Product Discovery & Presentation',
  'Shopping Experience & Navigation',
  'Trust & Security',
  'Checkout & Conversion',
  'Mobile Commerce'
];

export function getEcommercePrompt(url: string): string {
  return `Analysiere diese Website-Screenshots (Desktop und Mobile) für E-Commerce UX-Qualität der Website: ${url}

BEWERTUNGSKRITERIEN (jeweils Score 1-10):

1. Product Discovery & Presentation
- Produktbilder: Hochauflösend, multiple Ansichten, Zoom-Funktion?
- Produktinformationen: Vollständige Beschreibungen, technische Details, Größentabellen?
- Preisdarstellung: Klar erkennbar, Rabatte hervorgehoben, Preisvergleiche?
- Produktvarianten: Farb-/Größenauswahl intuitiv, Verfügbarkeit sichtbar?

2. Shopping Experience & Navigation
- Kategorienstruktur: Logisch organisiert, max. 3 Klicks zum Produkt?
- Suchfunktion: Prominent platziert, Autocomplete, Filteroptionen?
- Produktfilter: Umfassende Filter (Preis, Marke, Eigenschaften), einfache Anwendung?
- Breadcrumb-Navigation: Vollständig, immer sichtbar?

3. Trust & Security
- Gütesiegel: SSL-Zertifikate, Trusted Shops, andere Qualitätssiegel sichtbar?
- Kundenbewertungen: Echte Reviews, Sterne-System, Bewertungsanzahl?
- Kontaktmöglichkeiten: Live-Chat, Telefon, E-Mail prominent verfügbar?
- Datenschutz: DSGVO-konform, Datenschutzerklärung verlinkt?

4. Checkout & Conversion
- Warenkorb: Persistent, Produktübersicht, einfache Mengenänderung?
- Checkout-Prozess: Maximal 3 Schritte, Gastkäufe möglich, Fortschrittsanzeige?
- Zahlungsoptionen: Multiple Optionen (PayPal, Kreditkarte, Rechnung), sicher dargestellt?
- Versandinformationen: Kosten transparent, Lieferzeiten klar, Rückgaberecht erklärt?

5. Mobile Commerce
- Touch-Optimierung: Buttons mindestens 44px, einfache Fingerbedienung?
- Mobile Checkout: Autofill-Support, vereinfachter Prozess, mobile Zahlungsoptionen?
- Performance: Schnelle Ladezeiten, optimierte Bilder, reibungslose Navigation?
- App-Integration: PWA-Features, App-Download-Optionen falls vorhanden?

Für jede Kategorie:
- Vergib einen Score von 1-10 (1 = kritische Mängel, 10 = best practice)
- Erkläre die Bewertung in 2-3 prägnanten Sätzen mit konkreten Beispielen
- Gib 3 konkrete, umsetzbare Verbesserungsvorschläge mit Priorität

WICHTIG: Antworte ausschließlich mit gültigem JSON ohne Markdown-Formatierung oder Code-Blöcke!

Antworte im folgenden JSON-Format:
{
  "overallScore": number,
  "categories": [
    {
      "name": "Product Discovery & Presentation",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "Shopping Experience & Navigation",
      "score": number,
      "description": "string", 
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "Trust & Security",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "Checkout & Conversion",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "Mobile Commerce",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    }
  ],
  "summary": "string"
}`;
}