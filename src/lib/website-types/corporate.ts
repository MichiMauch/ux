// Corporate Website Analysis Configuration
export const CORPORATE_CATEGORIES = [
  'Navigation & Struktur',
  'Content-Hierarchie',
  'Call-to-Actions',
  'Mobile Experience',
  'Trust & Credibility'
];

export function getCorporatePrompt(url: string): string {
  return `Du erhältst zwei Screenshot-Bilder einer Website (Desktop und Mobile Version) zur Analyse. Analysiere NUR diese bereitgestellten Screenshots für die Corporate UX-Qualität der Website: ${url}

WICHTIG: Analysiere ausschließlich das was du in den bereitgestellten Screenshots siehst. Versuche NICHT auf externe Websites zuzugreifen.

BEWERTUNGSKRITERIEN (jeweils Score 1-10):
1. Navigation & Struktur - Ist die Hauptnavigation erkennbar und logisch? Sind Breadcrumbs vorhanden? Ist die Footer-Navigation vollständig?
2. Content-Hierarchie - Ist die Überschriften-Struktur klar? Sind wichtige Informationen prominent platziert? Sind Texte gut lesbar?
3. Call-to-Actions - Sind CTAs klar erkennbar? Sind Kontaktmöglichkeiten sichtbar? Sind Handlungsaufforderungen überzeugend?
4. Mobile Experience - Funktioniert das responsive Design? Ist die Navigation touch-friendly? Ist die Lesbarkeit auf kleinen Screens gewährleistet?
5. Trust & Credibility - Wirkt das Erscheinungsbild professionell? Sind Kontaktdaten sichtbar? Sind Impressum/Datenschutz verlinkt?

Für jede Kategorie:
- Vergib einen Score von 1-10 (1 = sehr schlecht, 10 = ausgezeichnet)
- Erkläre die Bewertung in 1-2 prägnanten Sätzen
- Gib 2-3 konkrete, umsetzbare Verbesserungsvorschläge

WICHTIG: Antworte ausschließlich mit gültigem JSON ohne Markdown-Formatierung oder Code-Blöcke!

Antworte im folgenden JSON-Format:
{
  "overallScore": number,  // Durchschnitt aller Kategorie-Scores
  "categories": [
    {
      "name": "Navigation & Struktur",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "Content-Hierarchie",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "Call-to-Actions",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "Mobile Experience",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "Trust & Credibility",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    }
  ],
  "summary": "string" // 2-3 Sätze Gesamtbewertung mit wichtigsten Verbesserungspunkten
}`;
}
