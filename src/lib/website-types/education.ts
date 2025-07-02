// Education Website Analysis Configuration
export const EDUCATION_CATEGORIES = [
  'Course Information & Structure',
  'Student Experience & Support',
  'Registration & Enrollment',
  'Learning Resources & Tools',
  'Institution Credibility'
];

export function getEducationPrompt(url: string): string {
  return `Du erhältst zwei Screenshot-Bilder einer Website (Desktop und Mobile Version) zur Analyse. Analysiere NUR diese bereitgestellten Screenshots für die Bildungs-/Schul-/Uni UX-Qualität der Website: ${url}

WICHTIG: Analysiere ausschließlich das was du in den bereitgestellten Screenshots siehst. Versuche NICHT auf externe Websites zuzugreifen.

BEWERTUNGSKRITERIEN (jeweils Score 1-10):

1. Course Information & Structure
- Kursangebot: Vollständige Kurslisten, detaillierte Beschreibungen, Lernziele klar?
- Studiengänge: Abschlüsse erklärt, Dauer, Voraussetzungen, Karrierewege aufgezeigt?
- Lehrplan: Curriculum verfügbar, Module erklärt, Prüfungsordnungen verlinkt?
- Termine & Deadlines: Semestertermine, Anmeldefristen, Prüfungstermine aktuell?

2. Student Experience & Support
- Campus-Leben: Campus-Tour, Studentenleben dargestellt, Aktivitäten aufgelistet?
- Beratungsangebote: Studienberatung, Karriereservice, psychologische Beratung verfügbar?
- Student Services: Mensa, Bibliothek, IT-Services, Wohnheime erklärt?
- Alumni-Netzwerk: Erfolgsgeschichten, Karrierewege, Kontaktmöglichkeiten zu Absolventen?

3. Registration & Enrollment
- Bewerbungsprozess: Schritt-für-Schritt erklärt, benötigte Dokumente, Online-Bewerbung möglich?
- Zulassungsvoraussetzungen: Klar definiert, NC-Werte, Sprachtests, Eignungsprüfungen?
- Finanzierung: Studiengebühren transparent, BAföG-Beratung, Stipendien aufgelistet?
- Online-Anmeldung: Benutzerfreundlich, Status-Tracking, automatische Bestätigungen?

4. Learning Resources & Tools
- Online-Lernplattform: LMS verfügbar, intuitive Bedienung, mobile App?
- Bibliothek & Recherche: Online-Katalog, Datenbank-Zugang, Fernleihe möglich?
- IT-Infrastruktur: WLAN-Info, Software-Lizenzen, technischer Support?
- E-Learning Tools: Video-Lectures, interaktive Inhalte, Collaboration-Tools?

5. Institution Credibility
- Akkreditierung: Anerkannte Abschlüsse, Qualitätssiegel, Zertifizierungen prominent?
- Rankings & Auszeichnungen: Hochschul-Rankings, Forschungsexzellenz, Auszeichnungen?
- Fakultät & Professoren: Lehrende vorgestellt, Qualifikationen, Forschungsschwerpunkte?
- Partnerschaften: Internationale Kooperationen, Industriepartner, Austauschprogramme?

Für jede Kategorie:
- Vergib einen Score von 1-10 (1 = unvollständig/verwirrend, 10 = umfassend/hilfreich)
- Erkläre die Bewertung in 2-3 prägnanten Sätzen
- Gib 3 konkrete, umsetzbare Verbesserungsvorschläge

WICHTIG: Antworte ausschließlich mit gültigem JSON ohne Markdown-Formatierung oder Code-Blöcke!

Antworte im folgenden JSON-Format:
{
  "overallScore": number,
  "categories": [
    {
      "name": "Course Information & Structure",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "Student Experience & Support",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "Registration & Enrollment",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "Learning Resources & Tools",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    },
    {
      "name": "Institution Credibility",
      "score": number,
      "description": "string",
      "recommendations": ["string", "string", "string"]
    }
  ],
  "summary": "string"
}`;
}