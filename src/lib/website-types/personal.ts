// Personal Website Analysis Configuration
export const PERSONAL_CATEGORIES = [
  'Personal Brand & Identity',
  'Content & Storytelling',
  'Professional Presentation',
  'User Experience & Navigation',
  'Contact & Networking'
];

export function getPersonalPrompt(url: string): string {
  return `Du erhältst zwei Screenshot-Bilder einer Website (Desktop und Mobile Version) zur Analyse. Analysiere NUR diese bereitgestellten Screenshots für die Personal Website UX-Qualität der Website: ${url}

WICHTIG: Analysiere ausschließlich das was du in den bereitgestellten Screenshots siehst. Versuche NICHT auf externe Websites zuzugreifen.

BEWERTUNGSKRITERIEN (jeweils Score 1-10):

1. Personal Brand & Identity
- Persönlichkeit: Authentische Darstellung, einzigartige Stimme, Charakterzüge erkennbar?
- Visueller Stil: Konsistentes Design, persönliche Farbpalette, zur Person passend?
- Positionierung: Klare Nische/Expertise, Zielgruppe definiert, Wertversprechen deutlich?
- Fotografie: Professionelle Portraits, verschiedene Situationen, sympathisch/approachable?

2. Content & Storytelling
- Über-mich Seite: Persönliche Geschichte, Werdegang, Motivation und Leidenschaften?
- Blog/Gedanken: Regelmäßige Inhalte, persönliche Insights, fachliche Expertise geteilt?
- Persönliche Projekte: Hobbys, Nebenprojekte, ehrenamtliche Tätigkeiten dargestellt?
- Authentizität: Ehrlich und nahbar, nicht nur polierte Fassade, echte Persönlichkeit?

3. Professional Presentation
- Beruflicher Werdegang: CV/Lebenslauf verfügbar, Karrierestation erklärt, Erfolge hervorgehoben?
- Skills & Expertise: Fähigkeiten klar benannt, Zertifikate/Ausbildungen, Spezialisierungen?
- Arbeitsproben: Relevante Projekte, Referenzen, Testimonials von Kollegen/Kunden?
- Verfügbarkeit: Aktueller Status (angestellt/freelance), Interesse an Opportunities kommuniziert?

4. User Experience & Navigation
- Einfache Navigation: Intuitive Menüstruktur, wichtigste Bereiche schnell erreichbar?
- Mobile Optimierung: Responsive Design, Touch-freundlich, schnelle Ladezeiten?
- Inhaltsorganisation: Logische Struktur, nicht überladen, fokussiert auf Wesentliches?
- Persönliche Note: Kleine Details, Easter Eggs, persönliche Elemente die überraschen?

5. Contact & Networking
- Kontaktmöglichkeiten: Mehrere Kanäle verfügbar, E-Mail prominent, professionelle Adresse?
- Social Media Integration: Relevante Profile verlinkt, konsistente Präsenz, aktuell?
- Networking: LinkedIn, Xing oder branchenspezifische Netzwerke prominent verlinkt?
- Call-to-Action: Klare Handlungsaufforderungen, was sollen Besucher als nächstes tun?

Für jede Kategorie:
- Vergib einen Score von 1-10 (1 = unpersönlich/unprofessionell, 10 = authentisch/beeindruckend)
- Erkläre die Bewertung in 2-3 prägnanten Sätzen
- Gib 3 konkrete, umsetzbare Verbesserungsvorschläge

WICHTIG: Antworte ausschließlich mit gültigem JSON ohne Markdown-Formatierung oder Code-Blöcke!

Antworte im folgenden JSON-Format:
{
  "overallScore": number,
  "categories": [
    {
      "name": "Personal Brand & Identity",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "Content & Storytelling",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "Professional Presentation",
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
      "name": "Contact & Networking",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    }
  ],
  "summary": "string"
}`;
}