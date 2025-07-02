// Government Website Analysis Configuration
export const GOVERNMENT_CATEGORIES = [
  'Information Architecture & Navigation',
  'Service Accessibility & Usability',
  'Transparency & Public Information',
  'Digital Services & E-Government',
  'Compliance & Accessibility'
];

export function getGovernmentPrompt(url: string): string {
  return `Du erhältst zwei Screenshot-Bilder einer Website (Desktop und Mobile Version) zur Analyse. Analysiere NUR diese bereitgestellten Screenshots für die Behörden/Öffentliche UX-Qualität der Website: ${url}

WICHTIG: Analysiere ausschließlich das was du in den bereitgestellten Screenshots siehst. Versuche NICHT auf externe Websites zuzugreifen.

BEWERTUNGSKRITERIEN (jeweils Score 1-10):

1. Information Architecture & Navigation
- Struktur: Ist die Behördenstruktur klar erkennbar? Sind Zuständigkeiten eindeutig?
- Navigation: Sind Services/Dienstleistungen leicht auffindbar? Gibt es eine Suchfunktion?
- Orientierung: Sind Breadcrumbs vorhanden? Ist die aktuelle Position klar?
- Mehrsprachigkeit: Sind Inhalte in verschiedenen Sprachen verfügbar?

2. Service Accessibility & Usability
- Barrierefreiheit: WCAG-Konformität erkennbar? Alt-Texte, Kontraste, Tastaturbedienung?
- Digitale Services: Online-Formulare verfügbar? Sind sie benutzerfreundlich ausgefüllt?
- Öffnungszeiten: Sind Sprechzeiten und Kontaktmöglichkeiten prominent dargestellt?
- Help & Support: Gibt es FAQs, Hilfestellungen, Chatbots oder Beratungsangebote?

3. Transparency & Public Information
- Transparenz: Sind Organigramme, Budgets, Entscheidungen öffentlich zugänglich?
- Aktualität: Sind News, Bekanntmachungen, Termine aktuell und gut sichtbar?
- Rechtliches: Sind Impressum, Datenschutz, rechtliche Hinweise vollständig?
- Bürgerbeteiligung: Gibt es Möglichkeiten für Feedback, Beschwerden, Bürgerinitiativen?

4. Digital Services & E-Government
- Online-Services: Können Anträge online gestellt werden? Ist der Status verfolgbar?
- Digitale Identität: Sind sichere Login-Verfahren (eID, etc.) integriert?
- Mobile Services: Funktionieren Services auch mobil? Gibt es eine App?
- Integration: Sind Services mit anderen Behörden verknüpft? Single Sign-On verfügbar?

5. Compliance & Accessibility
- Standards: Entspricht die Website den gültigen Web-Standards und Gesetzen?
- Datenschutz: DSGVO-Konformität erkennbar? Cookie-Banner, Einwilligungen korrekt?
- Sicherheit: HTTPS, sichere Datenübertragung, Verschlüsselung erkennbar?
- Performance: Ladezeiten angemessen? Funktioniert alles bei hoher Last?

Für jede Kategorie:
- Vergib einen Score von 1-10 (1 = mangelhaft/nicht vorhanden, 10 = vorbildlich/vollständig)
- Erkläre die Bewertung in 2-3 prägnanten Sätzen
- Gib 3 konkrete, umsetzbare Verbesserungsvorschläge

WICHTIG: Antworte ausschließlich mit gültigem JSON ohne Markdown-Formatierung oder Code-Blöcke!

Antworte im folgenden JSON-Format:
{
  "overallScore": number,
  "categories": [
    {
      "name": "Information Architecture & Navigation",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "Service Accessibility & Usability",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "Transparency & Public Information",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "Digital Services & E-Government",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "Compliance & Accessibility",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    }
  ],
  "summary": "string"
}`;
}
