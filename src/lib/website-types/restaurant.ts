// Restaurant/Gastronomie Website Analysis Configuration
export const RESTAURANT_CATEGORIES = [
  'Menu & Food Presentation',
  'Location & Contact Information',
  'Reservation & Ordering',
  'Atmosphere & Brand Experience',
  'Mobile & Local SEO'
];

export function getRestaurantPrompt(url: string): string {
  return `Analysiere diese Website-Screenshots (Desktop und Mobile) für Restaurant/Gastronomie UX-Qualität der Website: ${url}

BEWERTUNGSKRITERIEN (jeweils Score 1-10):

1. Menu & Food Presentation
- Speisekarte: Vollständig, aktuell, Preise klar erkennbar, appetitlich dargestellt?
- Food Photography: Hochwertige Bilder, professionell fotografiert, aktuell?
- Kategorisierung: Logische Menü-Struktur, Allergene/Diäten markiert, Beschreibungen?
- Getränkekarte: Vollständig, Preise transparent, Weinempfehlungen, alkoholfreie Optionen?

2. Location & Contact Information
- Adresse & Anfahrt: Klar sichtbar, Google Maps eingebunden, ÖPNV-Verbindungen?
- Öffnungszeiten: Prominent platziert, Feiertage berücksichtigt, saisonale Änderungen?
- Kontaktmöglichkeiten: Telefon prominent, E-Mail, verschiedene Kommunikationskanäle?
- Parkmöglichkeiten: Parkplätze erwähnt, öffentliche Verkehrsmittel, Fahrradstellplätze?

3. Reservation & Ordering
- Online-Reservierung: Einfaches Buchungssystem, Verfügbarkeit live, Bestätigung?
- Delivery/Takeaway: Online-Bestellung möglich, Liefergebiet, Abholzeiten?
- Buchungsoptionen: Verschiedene Tischgrößen, besondere Anlässe, Stornierungsrichtlinien?
- Integration: OpenTable, Lieferando oder andere Plattformen eingebunden?

4. Atmosphere & Brand Experience
- Ambiente-Darstellung: Restaurant-Fotos, verschiedene Bereiche, Stimmung erkennbar?
- Kulinarisches Konzept: Küchenstil klar, Philosophie erklärt, Alleinstellungsmerkmale?
- Events & Specials: Veranstaltungen, Tagesgerichte, saisonale Angebote?
- Storytelling: Geschichte des Restaurants, Chef-Portrait, besondere Zutaten/Lieferanten?

5. Mobile & Local SEO
- Mobile Optimierung: Touch-optimierte Navigation, schnelle Ladezeiten, lesbare Schrift?
- Click-to-Call: Telefonnummer direkt anrufbar, Reservierung mit einem Klick?
- Location-based Features: GPS-Navigation, lokale Suche optimiert, Google My Business?
- Social Media: Instagram/Facebook Posts eingebunden, aktuelle Inhalte, Community?

Für jede Kategorie:
- Vergib einen Score von 1-10 (1 = unprofessionell/unvollständig, 10 = verlockend/vollständig)
- Erkläre die Bewertung in 2-3 prägnanten Sätzen
- Gib 3 konkrete, umsetzbare Verbesserungsvorschläge

WICHTIG: Antworte ausschließlich mit gültigem JSON ohne Markdown-Formatierung oder Code-Blöcke!

Antworte im folgenden JSON-Format:
{
  "overallScore": number,
  "categories": [
    {
      "name": "Menu & Food Presentation",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "Location & Contact Information",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "Reservation & Ordering",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "Atmosphere & Brand Experience",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "Mobile & Local SEO",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    }
  ],
  "summary": "string"
}`;
}