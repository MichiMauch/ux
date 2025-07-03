import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#3b82f6",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  section: {
    marginTop: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  text: {
    fontSize: 12,
    lineHeight: 1.6,
    color: "#374151",
    marginBottom: 8,
  },
  websiteInfo: {
    backgroundColor: "#f3f4f6",
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  websiteUrl: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 5,
  },
  analysisDate: {
    fontSize: 12,
    color: "#6b7280",
  },
  scoreContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    padding: 20,
    borderRadius: 10,
    marginVertical: 15,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  scoreText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
  },
  scoreLabel: {
    fontSize: 10,
    color: "#6b7280",
    marginTop: 5,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 10,
    color: "#9ca3af",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 10,
  },
});

interface SimpleReportData {
  url: string;
  timestamp: string;
  overallScore: number;
  summary: string;
  categories: Array<{
    name: string;
    score: number;
    description: string;
    recommendations: string[];
  }>;
}

interface SimpleReportProps {
  data: SimpleReportData;
}

const getScoreColor = (score: number): string => {
  if (score >= 80) return "#10b981";
  if (score >= 60) return "#f59e0b";
  return "#ef4444";
};

const SimpleUXReportPdf: React.FC<SimpleReportProps> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>UX-Analyse Report</Text>
        <Text style={styles.subtitle}>Umfassende Website-Bewertung</Text>
      </View>

      {/* Website Info */}
      <View style={styles.websiteInfo}>
        <Text style={styles.websiteUrl}>{data.url}</Text>
        <Text style={styles.analysisDate}>Analysiert am {data.timestamp}</Text>
      </View>

      {/* Gesamt-Score */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gesamt-Bewertung</Text>
        <View style={styles.scoreContainer}>
          <View
            style={[
              styles.scoreCircle,
              { borderColor: getScoreColor(data.overallScore) },
            ]}
          >
            <Text
              style={[
                styles.scoreText,
                { color: getScoreColor(data.overallScore) },
              ]}
            >
              {data.overallScore}
            </Text>
            <Text style={styles.scoreLabel}>/ 100</Text>
          </View>
        </View>
      </View>

      {/* Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Zusammenfassung</Text>
        <Text style={styles.text}>{data.summary}</Text>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bewertungskategorien</Text>
        {data.categories.map((category, index) => (
          <View key={index} style={{ marginBottom: 15 }}>
            <Text style={[styles.text, { fontWeight: "bold", fontSize: 14 }]}>
              {category.name}: {category.score}/100
            </Text>
            <Text style={styles.text}>{category.description}</Text>
            {category.recommendations.length > 0 && (
              <View style={{ marginTop: 5 }}>
                <Text style={[styles.text, { fontWeight: "bold" }]}>
                  Empfehlungen:
                </Text>
                {category.recommendations.map((rec, recIndex) => (
                  <Text
                    key={recIndex}
                    style={[styles.text, { marginLeft: 10 }]}
                  >
                    • {rec}
                  </Text>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>

      <Text style={styles.footer}>UX-Analyzer Report • Seite 1 von 1</Text>
    </Page>
  </Document>
);

export default SimpleUXReportPdf;
