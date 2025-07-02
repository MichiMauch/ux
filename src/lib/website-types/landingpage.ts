// Landing Page Analysis Configuration
export const LANDING_CATEGORIES = [
  'Value Proposition & Messaging',
  'Conversion Optimization',
  'Visual Design & User Flow',
  'Trust & Credibility',
  'Performance & Technical'
];

export function getLandingPrompt(url: string): string {
  return `Analysiere diese Website-Screenshots (Desktop und Mobile) für Landing Page UX-Qualität der Website: ${url}

BEWERTUNGSKRITERIEN (jeweils Score 1-10):

1. Value Proposition & Messaging
- Headline Clarity: Hauptnutzen sofort erkennbar, unter 10 Wörtern, emotional ansprechend?
- Problem-Solution Fit: Problem klar definiert, Lösung logisch, Dringlichkeit vermittelt?
- Unique Selling Proposition: Alleinstellungsmerkmale deutlich, Konkurrenzabgrenzung klar?
- Zielgruppen-Ansprache: Sprache passend, Benefits statt Features, emotional resonant?

2. Conversion Optimization
- Call-to-Action: Primärer CTA prominent, kontrastreich, handlungsorientiert formuliert?
- Above-the-Fold: Wichtigste Informationen ohne Scrollen sichtbar, klarer CTA?
- Conversion Path: Logischer Ablauf, minimale Ablenkungen, klarer nächster Schritt?
- Form Optimization: Kurze Formulare, nur essenzielle Felder, Progress Indicator?

3. Visual Design & User Flow
- Visual Hierarchy: Wichtige Elemente prominent, logische Reihenfolge, gute Kontraste?
- Scanning Pattern: F- oder Z-Pattern berücksichtigt, Blickführung zu CTA?
- Imagery & Graphics: Hochwertige Bilder, Menschen zeigen Emotionen, unterstützen Message?
- Whitespace: Ausreichend Freiraum, nicht überladen, fokussiertes Design?

4. Trust & Credibility
- Social Proof: Testimonials, Kundenbewertungen, Nutzerzahlen, Case Studies?
- Authority Signals: Logos bekannter Kunden, Auszeichnungen, Zertifikate, Medienerwähnungen?
- Risk Reversal: Geld-zurück-Garantie, kostenlose Testversion, "Kein Risiko"-Versprechen?
- Contact & Support: Telefonnummer sichtbar, Live-Chat, Ansprechpartner mit Foto?

5. Performance & Technical
- Loading Speed: Schnelle Ladezeiten, optimierte Bilder, CDN-Nutzung?
- Mobile Optimization: Responsive Design, Touch-optimierte Buttons, lesbare Schrift?
- Browser Compatibility: Funktioniert in allen gängigen Browsern einwandfrei?
- Analytics Setup: Tracking implementiert, A/B-Test vorbereitet, Conversion-Tracking?

Für jede Kategorie:
- Vergib einen Score von 1-10 (1 = konversionsschädlich, 10 = hochkonvertierend)
- Erkläre die Bewertung in 2-3 prägnanten Sätzen
- Gib 3 konkrete, umsetzbare Verbesserungsvorschläge

WICHTIG: Antworte ausschließlich mit gültigem JSON ohne Markdown-Formatierung oder Code-Blöcke!

Antworte im folgenden JSON-Format:
{
  "overallScore": number,
  "categories": [
    {
      "name": "Value Proposition & Messaging",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "Conversion Optimization",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "Visual Design & User Flow",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "Trust & Credibility",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "Performance & Technical",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    }
  ],
  "summary": "string"
}`;
}