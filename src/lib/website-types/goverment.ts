// Government Website Analysis Configuration
export const GOVERNMENT_CATEGORIES = [
  'Information Architecture & Navigation',
  'Service Accessibility & Usability',
  'Transparency & Public Information',
  'Digital Services & E-Government',
  'Compliance & Accessibility'
];

export function getGovernmentPrompt(url: string): string {
  return `Analysiere diese Website-Screenshots (Desktop und Mobile) für Behörden/Öffentliche UX-Qualität der Website: ${url}

BEWERTUNGSKRITERIEN (jeweils Score 1-10):

1. Information Architecture & Navigation
- Behördenstruktur: Organisationsaufbau klar, Zuständigkeiten erkennbar, Ansprechpartner benannt?
- Service-Kategorien: Logische Gruppierung, Bürger- vs. Unternehmensservices getrennt?
- Suchfunktion: Leistungsstarke Suche, Filter nach Lebenssituationen, häufige Anfragen prominent?
- Breadcrumb & Orientierung: Navigationspfad klar, aktuelle Position erkennbar, Zurück-Navigation?

2. Service Accessibility & Usability
- Online-Services: Digitale Anträge verfügbar, Status-Tracking, Termine online buchbar?
- Formulare: Benutzerfreundlich, Hilfetexte, Speicherfunktion, Validierung verständlich?
- Lebenssituationen: Services nach Ereignissen gruppiert (Umzug, Geburt, etc.)?
- Mehrsprachigkeit: Wichtige Inhalte in relevanten Sprachen, Übersetzungshilfen?

3. Transparency & Public Information
- Öffnungszeiten: Aktuell, alle Standorte, Feiertage berücksichtigt, Sonderregelungen?
- Kontaktinformationen: Vollständig, direkte Ansprechpartner, verschiedene Kanäle?
- Gebühren & Kosten: Transparent, Kostenrechner, Zahlungsmöglichkeiten aufgelistet?
- Bearbeitungszeiten: Realistische Zeitangaben, Expressverfahren, Status-Updates?

4. Digital Services & E-Government
- Online-Anträge: Vollständig digital, rechtssicher, elektronische Signatur möglich?
- Bürgerkonten: Einheitliche Anmeldung, Dokumentenablage, Nachrichtensystem?
- Integration: Verschiedene Behörden verknüpft, einmalige Dateneingabe, Weiterleitungen?
- Mobile Services: Apps verfügbar, mobile Optimierung, Offline-Funktionen?

5. Compliance & Accessibility
- Barrierefreiheit: WCAG 2.1 AA Standard, Screen Reader kompatibel, Tastaturnavigation?
- DSGVO-Konformität: Datenschutzerklärung vollständig, Cookie-Consent, Datenminimierung?
- Rechtliche Anforderungen: Impressum, Haftungsausschluss, Urheberrechte geklärt?
- Sicherheitsstandards: HTTPS überall, sichere Datenübertragung, regelmäßige Updates?

Für jede Kategorie:
- Vergib einen Score von 1-10 (1 = bürgerfern/unbrauchbar, 10 = vorbildlich/serviceorientiert)
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