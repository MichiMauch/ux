// SaaS/Software Website Analysis Configuration
export const SAAS_CATEGORIES = [
  'Product Communication',
  'Conversion Funnel',
  'Trust & Social Proof',
  'Technical Information',
  'User Onboarding'
];

export function getSaasPrompt(url: string): string {
  return `Analysiere diese Website-Screenshots (Desktop und Mobile) für SaaS/Software UX-Qualität der Website: ${url}

BEWERTUNGSKRITERIEN (jeweils Score 1-10):

1. Product Communication
- Value Proposition: Hauptnutzen in 5 Sekunden erkennbar, klar differenziert?
- Feature-Darstellung: Wichtigste Features prominent, verständlich erklärt, mit Screenshots/Videos?
- Problem-Solution-Fit: Problem klar definiert, Lösung logisch nachvollziehbar?
- Zielgruppen-Ansprache: Sprache und Inhalte auf Zielgruppe zugeschnitten?

2. Conversion Funnel
- Call-to-Actions: "Free Trial", "Demo", "Sign Up" prominent und verlockend?
- Preisgestaltung: Transparente Preise, verschiedene Pakete, kostenlose Version?
- Lead-Generierung: Gated Content, Newsletter, Demos, Webinare angeboten?
- Checkout-Prozess: Einfache Registrierung, minimale Reibung, sofortiger Zugang?

3. Trust & Social Proof
- Kundenbewertungen: Echte Testimonials, Case Studies, Erfolgsgeschichten?
- Logo-Trust: Bekannte Kunden-Logos, Partnerschaften, Auszeichnungen?
- Sicherheit: SOC2, GDPR, SSL-Zertifikate prominent dargestellt?
- Team/Company: Über-uns-Seite, Team-Fotos, Unternehmensgeschichte?

4. Technical Information
- Dokumentation: API-Docs verlinkt, Developer Resources verfügbar?
- Integrationen: Wichtigste Tool-Integrationen aufgelistet, Screenshots vorhanden?
- System Requirements: Technische Voraussetzungen klar kommuniziert?
- Support: Help Center, Live Chat, Ticket-System, Community Forum?

5. User Onboarding
- Demo/Trial: Sofortiger Zugang, geführte Tour, Beispieldaten?
- Getting Started: Schneller Erfolgserlebnis, klare erste Schritte?
- Resources: Tutorials, Webinare, Knowledge Base verlinkt?
- Progressive Disclosure: Komplexität schrittweise aufgebaut, nicht überwältigend?

Für jede Kategorie:
- Vergib einen Score von 1-10 (1 = verwirrend/schlecht, 10 = überzeugend/excellent)
- Erkläre die Bewertung in 2-3 prägnanten Sätzen
- Gib 3 konkrete, umsetzbare Verbesserungsvorschläge

WICHTIG: Antworte ausschließlich mit gültigem JSON ohne Markdown-Formatierung oder Code-Blöcke!

Antworte im folgenden JSON-Format:
{
  "overallScore": number,
  "categories": [
    {
      "name": "Product Communication",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "Conversion Funnel",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "Trust & Social Proof",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "Technical Information",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "User Onboarding",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    }
  ],
  "summary": "string"
}`;
}