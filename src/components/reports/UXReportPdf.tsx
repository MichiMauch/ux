import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Styles für das PDF
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
  scoreContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
  },
  scoreItem: {
    alignItems: "center",
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  scoreLabel: {
    fontSize: 10,
    color: "#6b7280",
    textAlign: "center",
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  metricName: {
    fontSize: 12,
    color: "#374151",
    flex: 2,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: "bold",
    flex: 1,
    textAlign: "right",
  },
  tagRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  tagName: {
    fontSize: 11,
    fontFamily: "Courier",
    color: "#1d4ed8",
    flex: 1,
  },
  tagStatus: {
    fontSize: 12,
    fontWeight: "bold",
    width: 20,
    textAlign: "center",
  },
  tagContent: {
    fontSize: 10,
    color: "#6b7280",
    flex: 2,
    paddingLeft: 10,
  },
  recommendation: {
    backgroundColor: "#fef3c7",
    padding: 10,
    marginTop: 5,
    borderRadius: 4,
  },
  recommendationText: {
    fontSize: 10,
    color: "#92400e",
  },
  summaryText: {
    fontSize: 12,
    lineHeight: 1.6,
    color: "#374151",
    marginBottom: 10,
  },
  categoryCard: {
    backgroundColor: "#f9fafb",
    padding: 12,
    marginBottom: 10,
    borderRadius: 6,
    borderLeftWidth: 4,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  categoryScore: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  categoryDescription: {
    fontSize: 10,
    color: "#6b7280",
    marginBottom: 8,
  },
  recommendationsList: {
    marginTop: 5,
  },
  recommendationItem: {
    fontSize: 9,
    color: "#374151",
    marginBottom: 2,
    paddingLeft: 10,
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
  websiteInfo: {
    backgroundColor: "#eff6ff",
    padding: 12,
    marginBottom: 15,
    borderRadius: 6,
  },
  websiteUrl: {
    fontSize: 12,
    color: "#1d4ed8",
    fontWeight: "bold",
  },
  analysisDate: {
    fontSize: 10,
    color: "#6b7280",
    marginTop: 2,
  },
});

// Interfaces für die Daten
export interface UXCategoryResult {
  name: string;
  score: number;
  description: string;
  recommendations: string[];
}

export interface PageSpeedData {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  metrics: {
    largestContentfulPaint: { displayValue: string };
    firstInputDelay: { displayValue: string };
    cumulativeLayoutShift: { displayValue: string };
    speedIndex: { displayValue: string };
  };
}

export interface MetaTagCheck {
  group: "Meta Tags" | "Open Graph Tags" | "Twitter Cards";
  tag: string;
  present: boolean;
  content: string | null;
  recommendation?: string;
}

export interface ReportData {
  url: string;
  timestamp: string;
  overallScore: number;
  summary: string;
  categories: UXCategoryResult[];
  pageSpeed: PageSpeedData;
  metaTags: MetaTagCheck[];
}

interface UXReportPdfProps {
  data: ReportData;
}

const getScoreColor = (score: number): string => {
  if (score >= 80) return "#10b981"; // green
  if (score >= 60) return "#f59e0b"; // yellow
  return "#ef4444"; // red
};

const getScoreBorderColor = (score: number): string => {
  if (score >= 80) return "#059669";
  if (score >= 60) return "#d97706";
  return "#dc2626";
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const UXReportPdf: React.FC<UXReportPdfProps> = ({ data }) => (
  <Document>
    {/* Seite 1: Übersicht */}
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>UX-Analyse Report</Text>
        <Text style={styles.subtitle}>Umfassende Website-Bewertung</Text>
      </View>

      {/* Website Info */}
      <View style={styles.websiteInfo}>
        <Text style={styles.websiteUrl}>{data.url}</Text>
        <Text style={styles.analysisDate}>
          Analysiert am {formatDate(data.timestamp)}
        </Text>
      </View>

      {/* Gesamt-Score */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gesamt-Bewertung</Text>
        <View style={[styles.scoreContainer, { justifyContent: "center" }]}>
          <View style={styles.scoreItem}>
            <Text
              style={[
                styles.scoreValue,
                {
                  fontSize: 48,
                  color: getScoreColor(data.overallScore * 10),
                },
              ]}
            >
              {data.overallScore.toFixed(1)}
            </Text>
            <Text style={styles.scoreLabel}>von 10 Punkten</Text>
          </View>
        </View>
        <Text style={styles.summaryText}>{data.summary}</Text>
      </View>

      {/* UX-Kategorien */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>UX-Kategorien im Detail</Text>
        {data.categories.map((category, index) => (
          <View
            key={index}
            style={[
              styles.categoryCard,
              { borderLeftColor: getScoreBorderColor(category.score * 10) },
            ]}
          >
            <Text style={[styles.categoryTitle, { color: "#1f2937" }]}>
              {category.name}
            </Text>
            <Text
              style={[
                styles.categoryScore,
                {
                  color: getScoreColor(category.score * 10),
                },
              ]}
            >
              {category.score.toFixed(1)}/10
            </Text>
            <Text style={styles.categoryDescription}>
              {category.description}
            </Text>
            <View style={styles.recommendationsList}>
              {category.recommendations.slice(0, 3).map((rec, recIndex) => (
                <Text key={recIndex} style={styles.recommendationItem}>
                  • {rec}
                </Text>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        Generiert von UX-Analyzer • {new Date().getFullYear()}
      </Text>
    </Page>

    {/* Seite 2: Performance */}
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Performance Analyse</Text>
        <Text style={styles.subtitle}>Google PageSpeed Insights</Text>
      </View>

      {/* Performance Scores */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance Scores</Text>
        <View style={styles.scoreContainer}>
          <View style={styles.scoreItem}>
            <Text
              style={[
                styles.scoreValue,
                {
                  color: getScoreColor(data.pageSpeed.performance),
                },
              ]}
            >
              {data.pageSpeed.performance}
            </Text>
            <Text style={styles.scoreLabel}>Performance</Text>
          </View>
          <View style={styles.scoreItem}>
            <Text
              style={[
                styles.scoreValue,
                {
                  color: getScoreColor(data.pageSpeed.accessibility),
                },
              ]}
            >
              {data.pageSpeed.accessibility}
            </Text>
            <Text style={styles.scoreLabel}>Zugänglichkeit</Text>
          </View>
          <View style={styles.scoreItem}>
            <Text
              style={[
                styles.scoreValue,
                {
                  color: getScoreColor(data.pageSpeed.bestPractices),
                },
              ]}
            >
              {data.pageSpeed.bestPractices}
            </Text>
            <Text style={styles.scoreLabel}>Best Practices</Text>
          </View>
          <View style={styles.scoreItem}>
            <Text
              style={[
                styles.scoreValue,
                {
                  color: getScoreColor(data.pageSpeed.seo),
                },
              ]}
            >
              {data.pageSpeed.seo}
            </Text>
            <Text style={styles.scoreLabel}>SEO</Text>
          </View>
        </View>
      </View>

      {/* Core Web Vitals */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Core Web Vitals</Text>
        <View style={styles.metricRow}>
          <Text style={styles.metricName}>Largest Contentful Paint (LCP)</Text>
          <Text style={styles.metricValue}>
            {data.pageSpeed.metrics.largestContentfulPaint.displayValue}
          </Text>
        </View>
        <View style={styles.metricRow}>
          <Text style={styles.metricName}>First Input Delay (FID)</Text>
          <Text style={styles.metricValue}>
            {data.pageSpeed.metrics.firstInputDelay.displayValue}
          </Text>
        </View>
        <View style={styles.metricRow}>
          <Text style={styles.metricName}>Cumulative Layout Shift (CLS)</Text>
          <Text style={styles.metricValue}>
            {data.pageSpeed.metrics.cumulativeLayoutShift.displayValue}
          </Text>
        </View>
        <View style={styles.metricRow}>
          <Text style={styles.metricName}>Speed Index</Text>
          <Text style={styles.metricValue}>
            {data.pageSpeed.metrics.speedIndex.displayValue}
          </Text>
        </View>
      </View>

      <Text style={styles.footer}>
        Seite 2 von 3 • UX-Analyzer Performance Report
      </Text>
    </Page>

    {/* Seite 3: Meta Tags */}
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Meta Tags Analyse</Text>
        <Text style={styles.subtitle}>SEO & Social Media Optimierung</Text>
      </View>

      {/* Meta Tags nach Gruppen */}
      {["Meta Tags", "Open Graph Tags", "Twitter Cards"].map(
        (group, groupIndex) => {
          const groupTags = data.metaTags.filter((tag) => tag.group === group);
          const presentCount = groupTags.filter((tag) => tag.present).length;
          const totalCount = groupTags.length;
          const percentage = Math.round((presentCount / totalCount) * 100);

          return (
            <View key={groupIndex} style={styles.section}>
              <Text style={styles.sectionTitle}>
                {group} ({presentCount}/{totalCount} - {percentage}%)
              </Text>

              {groupTags.map((tag, tagIndex) => (
                <View key={tagIndex}>
                  <View style={styles.tagRow}>
                    <Text style={styles.tagName}>{tag.tag}</Text>
                    <Text
                      style={[
                        styles.tagStatus,
                        { color: tag.present ? "#10b981" : "#ef4444" },
                      ]}
                    >
                      {tag.present ? "✓" : "✗"}
                    </Text>
                    <Text style={styles.tagContent}>
                      {tag.content || "Nicht vorhanden"}
                    </Text>
                  </View>

                  {!tag.present && tag.recommendation && (
                    <View style={styles.recommendation}>
                      <Text style={styles.recommendationText}>
                        💡 {tag.recommendation}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          );
        }
      )}

      {/* Meta-Tags Übersicht */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 16, marginBottom: 10 }}>
          Meta-Tags Übersicht
        </Text>
        {data.metaTags.map((tag, index) => (
          <View key={index} style={{ flexDirection: "row", marginBottom: 4 }}>
            <Text style={{ flex: 1 }}>{tag.tag}</Text>
            <Text style={{ flex: 1 }}>{tag.present ? "Vorhanden" : "Fehlt"}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.footer}>
        Seite 3 von 3 • UX-Analyzer Meta Tags Report
      </Text>
    </Page>
  </Document>
);

export default UXReportPdf;
