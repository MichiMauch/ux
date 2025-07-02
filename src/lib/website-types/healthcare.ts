// Healthcare Website Analysis Configuration
export const HEALTHCARE_CATEGORIES = [
  'Medical Information & Services',
  'Patient Experience & Booking',
  'Trust & Compliance',
  'Emergency & Contact Information',
  'Accessibility & Patient Support'
];

export function getHealthcarePrompt(url: string): string {
  return `Du erhältst zwei Screenshot-Bilder einer Website (Desktop und Mobile Version) zur Analyse. Analysiere NUR diese bereitgestellten Screenshots für die Medizin/Gesundheits UX-Qualität der Website: ${url}

WICHTIG: Analysiere ausschließlich das was du in den bereitgestellten Screenshots siehst. Versuche NICHT auf externe Websites zuzugreifen.

BEWERTUNGSKRITERIEN (jeweils Score 1-10):

1. Medical Information & Services
- Leistungsspektrum: Behandlungen/Services vollständig aufgelistet, verständlich erklärt?
- Medizinische Expertise: Fachbereiche klar definiert, Spezialisierungen hervorgehoben?
- Behandlungsablauf: Vor-, Während-, Nachbehandlung erklärt, was erwartet Patienten?
- Gesundheitsinformationen: Verlässliche medizinische Inhalte, Aufklärungsmaterial, FAQ?

2. Patient Experience & Booking
- Terminbuchung: Online-Terminvergabe verfügbar, verschiedene Kanäle, Flexibilität?
- Wartezeiteninfo: Realistische Zeitangaben, Notfall vs. Routine unterschieden?
- Patientenportal: Online-Zugang zu Befunden, Terminübersicht, Kommunikation mit Ärzten?
- Vorbereitung: Checklisten für Termine, benötigte Unterlagen, Anfahrtsbeschreibung?

3. Trust & Compliance
- Arzt-Qualifikationen: Ausbildung, Zertifizierungen, Berufserfahrung transparent dargestellt?
- Datenschutz: DSGVO-konform, Patientendaten-Schutz, Schweigepflicht erklärt?
- Qualitätszertifikate: Medizinische Akkreditierungen, Qualitätssiegel, Zertifizierungen?
- Patientenbewertungen: Echte Bewertungen, Beschwerdemanagement, Qualitätsmessungen?

4. Emergency & Contact Information
- Notfall-Informationen: Notdienst-Zeiten, Notfall-Kontakte, Was-tun-bei-Notfall?
- Erreichbarkeit: Sprechzeiten klar, Vertretungsregelungen, verschiedene Kontaktkanäle?
- Standort-Informationen: Anfahrt, Parkmöglichkeiten, ÖPNV-Anbindung, Barrierefreiheit?
- Apotheken-Infos: Nächste Apotheken, Notdienst-Apotheken, Rezept-Service?

5. Accessibility & Patient Support
- Barrierefreiheit: Rollstuhlgerecht, Aufzug, behindertengerechte Ausstattung?
- Sprachunterstützung: Mehrsprachige Inhalte, Dolmetscher-Service, einfache Sprache?
- Besondere Bedürfnisse: Kinder, Senioren, chronisch Kranke, spezielle Services?
- Soziale Dienste: Sozialberatung, Hilfe bei Anträgen, Patientenfürsprecher?

Für jede Kategorie:
- Vergib einen Score von 1-10 (1 = mangelhaft/unsicher, 10 = vertrauenswürdig/umfassend)
- Erkläre die Bewertung in 2-3 prägnanten Sätzen
- Gib 3 konkrete, umsetzbare Verbesserungsvorschläge

WICHTIG: Antworte ausschließlich mit gültigem JSON ohne Markdown-Formatierung oder Code-Blöcke!

Antworte im folgenden JSON-Format:
{
  "overallScore": number,
  "categories": [
    {
      "name": "Medical Information & Services",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "Patient Experience & Booking",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "Trust & Compliance",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "Emergency & Contact Information",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "Accessibility & Patient Support",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    }
  ],
  "summary": "string"
}`;
}