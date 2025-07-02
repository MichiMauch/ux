// NGO/Non-Profit Website Analysis Configuration
export const NONPROFIT_CATEGORIES = [
  'Mission & Impact Communication',
  'Donation & Fundraising',
  'Transparency & Trust',
  'Community Engagement',
  'Accessibility & Inclusion'
];

export function getNonprofitPrompt(url: string): string {
  return `Du erhältst zwei Screenshot-Bilder einer Website (Desktop und Mobile Version) zur Analyse. Analysiere NUR diese bereitgestellten Screenshots für die NGO/Non-Profit UX-Qualität der Website: ${url}

WICHTIG: Analysiere ausschließlich das was du in den bereitgestellten Screenshots siehst. Versuche NICHT auf externe Websites zuzugreifen.

BEWERTUNGSKRITERIEN (jeweils Score 1-10):

1. Mission & Impact Communication
- Mission Statement: Klar formuliert, prominent platziert, emotional ansprechend?
- Impact Storytelling: Erfolgsgeschichten, konkrete Zahlen, persönliche Geschichten?
- Problembeschreibung: Dringlichkeit vermittelt, Lösungsansatz erklärt?
- Visual Storytelling: Hochwertige Bilder, Videos, Infografiken zur Wirkung?

2. Donation & Fundraising
- Spenden-Button: Prominent platziert, auf jeder Seite, vertrauenswürdig gestaltet?
- Spendenprozess: Einfach, verschiedene Beträge, monatliche Option, transparente Verwendung?
- Zahlungsoptionen: Multiple sichere Zahlungswege, keine versteckten Kosten?
- Spenden-Impact: Klar kommuniziert wofür Geld verwendet wird, was X€ bewirken?

3. Transparency & Trust
- Finanztransparenz: Jahresberichte, Mittelverwendung, Overhead-Kosten transparent?
- Zertifizierungen: DZI-Siegel, andere Gütesiegel prominent dargestellt?
- Team & Leadership: Vorstand/Team vorgestellt, Qualifikationen erkennbar?
- Rechtliches: Impressum vollständig, Datenschutz, Gemeinnützigkeitsstatus?

4. Community Engagement
- Volunteer-Möglichkeiten: Ehrenamt-Optionen klar erklärt, einfache Anmeldung?
- Newsletter & Updates: Regelmäßige Updates, verschiedene Kommunikationskanäle?
- Social Media: Integration von Social Media, aktuelle Posts, Community-Building?
- Events & Aktionen: Kommende Veranstaltungen, Teilnahmemöglichkeiten?

5. Accessibility & Inclusion
- Barrierefreiheit: WCAG-konform, Screen Reader kompatibel, Tastaturnavigation?
- Mehrsprachigkeit: Wichtige Inhalte in relevanten Sprachen verfügbar?
- Mobile Optimierung: Vollständig responsive, Touch-optimiert, schnelle Ladezeiten?
- Einfache Sprache: Verständlich für verschiedene Bildungsniveaus, Fachjargon vermieden?

Für jede Kategorie:
- Vergib einen Score von 1-10 (1 = schlecht/intransparent, 10 = vertrauenswürdig/wirkungsvoll)
- Erkläre die Bewertung in 2-3 prägnanten Sätzen
- Gib 3 konkrete, umsetzbare Verbesserungsvorschläge

WICHTIG: Antworte ausschließlich mit gültigem JSON ohne Markdown-Formatierung oder Code-Blöcke!

Antworte im folgenden JSON-Format:
{
  "overallScore": number,
  "categories": [
    {
      "name": "Mission & Impact Communication",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "Donation & Fundraising",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "Transparency & Trust",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "Community Engagement",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "Accessibility & Inclusion",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    }
  ],
  "summary": "string"
}`;
}