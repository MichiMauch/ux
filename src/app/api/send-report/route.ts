import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { renderToBuffer, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import React from 'react';
import { AnalysisData } from '@/types/analysis';

// Initialize Resend client when needed
const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY environment variable is required');
  }
  return new Resend(apiKey);
};

interface SendReportRequest {
  email: string;
  url: string;
  data: AnalysisData;
  timestamp?: string;
}

interface PageSpeedMetric {
  displayValue?: string;
  numericValue?: number;
  score?: number;
}

// Helper function to safely get metric display value
const getMetricValue = (value: unknown): string => {
  if (typeof value === 'object' && value !== null) {
    const metric = value as PageSpeedMetric;
    return metric.displayValue || metric.numericValue?.toString() || 'N/A';
  }
  return String(value);
};

// Helper function to get friendly metric names
const getFriendlyMetricName = (key: string): string => {
  const metricNames: Record<string, string> = {
    'first-contentful-paint': 'First Contentful Paint',
    'largest-contentful-paint': 'Largest Contentful Paint',
    'first-input-delay': 'First Input Delay',
    'cumulative-layout-shift': 'Cumulative Layout Shift',
    'speed-index': 'Speed Index',
    'total-blocking-time': 'Total Blocking Time',
    'interactive': 'Time to Interactive',
    'server-response-time': 'Server Response Time',
    'render-blocking-resources': 'Render Blocking Resources',
    'uses-optimized-images': 'Optimized Images',
    'uses-text-compression': 'Text Compression',
    'unused-css-rules': 'Unused CSS',
    'modern-image-formats': 'Modern Image Formats'
  };
  
  return metricNames[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
};
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    marginTop: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  text: {
    fontSize: 12,
    lineHeight: 1.6,
    color: '#374151',
    marginBottom: 8,
  },
  websiteInfo: {
    backgroundColor: '#f3f4f6',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  websiteUrl: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  analysisDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 20,
    borderRadius: 10,
    marginVertical: 15,
  },
  scoreCircle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginVertical: 30,
    alignSelf: 'center',
  },
  scoreText: {
    fontSize: 54,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  scoreLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#9ca3af',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
  },
  // Category Styles
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#f9fafb',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderLeftWidth: 4,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  categoryScore: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  categoryDetail: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    breakInside: 'avoid',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryDetailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  scoreBox: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  scoreBoxText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  categoryDescription: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 10,
    lineHeight: 1.5,
  },
  recommendationsBox: {
    backgroundColor: '#f0f9ff',
    padding: 10,
    borderRadius: 5,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  recommendationsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  recommendationItem: {
    fontSize: 11,
    color: '#374151',
    marginBottom: 3,
    marginLeft: 10,
  },
  // PageSpeed Styles
  speedSection: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  speedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    display: 'flex',
    alignItems: 'center',
  },
  speedScoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  speedScoreLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
  },
  speedScoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    color: '#ffffff',
  },
  speedMetrics: {
    flexDirection: 'column',
    gap: 4,
  },
  speedMetricsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    marginTop: 12,
  },
  speedScoresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 12,
  },
  speedScoreItem: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    width: '48%',
    alignItems: 'center',
  },
  speedMetricItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  speedMetricLabel: {
    fontSize: 12,
    color: '#64748b',
    flex: 1,
  },
  speedMetricValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
  },
  // Meta Tags Styles
  metaSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  metaSummaryItem: {
    alignItems: 'center',
  },
  metaSummaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  metaSummaryLabel: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
  },
  metaGroup: {
    marginBottom: 15,
  },
  metaGroupTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  metaTagsList: {
    paddingLeft: 10,
  },
  metaTagItem: {
    marginBottom: 8,
  },
  metaTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  metaTagStatus: {
    fontSize: 12,
    fontWeight: 'bold',
    width: 20,
  },
  metaTagName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#374151',
    width: 120,
  },
  metaTagContent: {
    fontSize: 10,
    color: '#6b7280',
    flex: 1,
  },
  metaRecommendation: {
    backgroundColor: '#fef3c7',
    padding: 6,
    borderRadius: 4,
    marginTop: 4,
    marginLeft: 20,
  },
  metaRecommendationText: {
    fontSize: 9,
    color: '#92400e',
    lineHeight: 1.4,
  },
});

const getScoreColor = (score: number): string => {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
};

function createPDFDocument(url: string, timestamp: string, data: AnalysisData) {
  const overallScore = data.uxAnalysis?.overallScore || 0;
  const summary = data.uxAnalysis?.summary || 'Keine UX-Analyse verfügbar';
  const categories = data.uxAnalysis?.categories || [];

  // Build PDF structure using React.createElement instead of JSX
  return React.createElement(Document, {},
    // Page 1: Title and Large Overall Score
    React.createElement(Page, { size: "A4", style: styles.page },
      // Header
      React.createElement(View, { style: styles.header },
        React.createElement(Text, { style: styles.title }, "UX-Analyse Report"),
        React.createElement(Text, { style: styles.subtitle }, `${url} • ${timestamp}`)
      ),
      // Large Overall Score
      React.createElement(View, { style: { alignItems: 'center', marginVertical: 60 } },
        React.createElement(Text, { 
          style: { fontSize: 28, fontWeight: 'bold', color: '#1f2937', marginBottom: 30, textAlign: 'center' }
        }, "Gesamtbewertung"),
        React.createElement(View, { 
          style: [styles.scoreCircle, { 
            borderColor: getScoreColor(overallScore),
            backgroundColor: getScoreColor(overallScore) + '10'
          }]
        },
          React.createElement(Text, { 
            style: [styles.scoreText, { color: getScoreColor(overallScore) }]
          }, `${Math.round(overallScore)}/100`)
        ),
        React.createElement(Text, { 
          style: { fontSize: 20, color: '#6b7280', marginTop: 30, textAlign: 'center' }
        }, "UX-Score")
      ),
      // Website Info
      React.createElement(View, { style: { marginTop: 60, alignItems: 'center' } },
        React.createElement(Text, { 
          style: { fontSize: 16, color: '#374151', textAlign: 'center', marginBottom: 10 }
        }, "Analysierte Website:"),
        React.createElement(Text, { 
          style: { fontSize: 22, fontWeight: 'bold', color: '#1f2937', textAlign: 'center' }
        }, url)
      ),
      // Footer
      React.createElement(Text, { style: styles.footer }, "UX-Analyzer Report • Seite 1 von 7")
    ),

    // Page 2: Summary and Categories Overview
    React.createElement(Page, { size: "A4", style: styles.page },
      // Header
      React.createElement(View, { style: styles.header },
        React.createElement(Text, { style: styles.title }, "Zusammenfassung"),
        React.createElement(Text, { style: styles.subtitle }, "Überblick & Bewertung")
      ),
      
      // Summary
      React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, "Analyseergebnis"),
        React.createElement(View, { 
          style: { 
            backgroundColor: '#f8fafc', 
            padding: 20, 
            borderRadius: 8, 
            borderLeftWidth: 4, 
            borderLeftColor: getScoreColor(overallScore),
            marginBottom: 10
          }
        },
          React.createElement(Text, { 
            style: { 
              fontSize: 13, 
              lineHeight: 1.8, 
              color: '#374151',
              textAlign: 'justify'
            }
          }, summary)
        )
      ),
      
      // Categories Overview
      React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, "Bewertungsübersicht"),
        React.createElement(View, { style: styles.categoryGrid },
          ...categories.map((category, index) =>
            React.createElement(View, { 
              key: index, 
              style: [styles.categoryCard, { 
                borderLeftColor: getScoreColor(category.score),
                borderLeftWidth: 4 
              }]
            },
              React.createElement(Text, { style: styles.categoryTitle }, category.name),
              React.createElement(Text, { 
                style: [styles.categoryScore, { color: getScoreColor(category.score) }]
              }, `${category.score}/10`)
            )
          )
        )
      ),
      
      // Footer
      React.createElement(Text, { style: styles.footer }, "UX-Analyzer Report • Seite 2 von 7")
    ),

    // Page 3: Detailed Categories
    React.createElement(Page, { size: "A4", style: styles.page },
      // Header
      React.createElement(View, { style: styles.header },
        React.createElement(Text, { style: styles.title }, "Detaillierte Bewertung"),
        React.createElement(Text, { style: styles.subtitle }, "UX-Kategorien im Detail")
      ),
      
      // Detailed Categories
      React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, "UX-Kategorien im Detail"),
        ...categories.map((category, index) =>
          React.createElement(View, { key: index, style: styles.categoryDetail },
            React.createElement(View, { style: styles.categoryHeader },
              React.createElement(Text, { style: styles.categoryDetailTitle }, category.name),
              React.createElement(View, { 
                style: [styles.scoreBox, { backgroundColor: getScoreColor(category.score) }]
              },
                React.createElement(Text, { 
                  style: [styles.scoreBoxText, { color: '#ffffff' }]
                }, `${category.score}/10`)
              )
            ),
            React.createElement(Text, { style: styles.categoryDescription }, category.description),
            category.recommendations.length > 0 && React.createElement(View, { style: styles.recommendationsBox },
              React.createElement(Text, { style: styles.recommendationsTitle }, "Empfehlungen:"),
              ...category.recommendations.slice(0, 2).map((rec, recIndex) =>
                React.createElement(Text, { 
                  key: recIndex, 
                  style: styles.recommendationItem
                }, `• ${rec}`)
              ),
              category.recommendations.length > 2 && React.createElement(Text, { 
                style: [styles.recommendationItem, { fontStyle: 'italic', color: '#6b7280' }]
              }, `... und ${category.recommendations.length - 2} weitere Empfehlungen`)
            )
          )
        )
      ),
      
      // Footer
      React.createElement(Text, { style: styles.footer }, "UX-Analyzer Report • Seite 3 von 7")
    ),

    // Page 4: Desktop PageSpeed Data
    React.createElement(Page, { size: "A4", style: styles.page },
      // Header
      React.createElement(View, { style: styles.header },
        React.createElement(Text, { style: styles.title }, "Desktop Performance"),
        React.createElement(Text, { style: styles.subtitle }, "PageSpeed Insights - Desktop Analyse")
      ),
      
      // Desktop PageSpeed Data
      data.pageSpeedData && data.pageSpeedData.desktop && React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, "Desktop Performance Übersicht"),
        
        
        // Four main scores in grid
        React.createElement(View, { style: styles.speedScoresGrid },
          React.createElement(View, { style: styles.speedScoreItem },
            React.createElement(Text, { style: styles.speedScoreLabel }, "Performance"),
            React.createElement(Text, { 
              style: [styles.speedScoreValue, { 
                backgroundColor: getScoreColor(data.pageSpeedData.desktop.performance || 0),
                color: '#ffffff' 
              }]
            }, `${data.pageSpeedData.desktop.performance || 0}/100`)
          ),
          React.createElement(View, { style: styles.speedScoreItem },
            React.createElement(Text, { style: styles.speedScoreLabel }, "Zugänglichkeit"),
            React.createElement(Text, { 
              style: [styles.speedScoreValue, { 
                backgroundColor: getScoreColor(data.pageSpeedData.desktop.accessibility || 0),
                color: '#ffffff' 
              }]
            }, `${data.pageSpeedData.desktop.accessibility || 0}/100`)
          ),
          React.createElement(View, { style: styles.speedScoreItem },
            React.createElement(Text, { style: styles.speedScoreLabel }, "Best Practices"),
            React.createElement(Text, { 
              style: [styles.speedScoreValue, { 
                backgroundColor: getScoreColor(data.pageSpeedData.desktop.bestPractices || 0),
                color: '#ffffff' 
              }]
            }, `${data.pageSpeedData.desktop.bestPractices || 0}/100`)
          ),
          React.createElement(View, { style: styles.speedScoreItem },
            React.createElement(Text, { style: styles.speedScoreLabel }, "SEO"),
            React.createElement(Text, { 
              style: [styles.speedScoreValue, { 
                backgroundColor: getScoreColor(data.pageSpeedData.desktop.seo || 0),
                color: '#ffffff' 
              }]
            }, `${data.pageSpeedData.desktop.seo || 0}/100`)
          )
        ),
        
        // Core Web Vitals
        data.pageSpeedData.desktop.metrics && React.createElement(View, { style: [styles.speedMetrics, { marginTop: 20 }] },
          React.createElement(Text, { style: styles.speedMetricsTitle }, "Core Web Vitals - Desktop"),
          ...Object.entries(data.pageSpeedData.desktop.metrics).slice(0, 8).map(([key, value], idx) =>
            React.createElement(View, { key: idx, style: styles.speedMetricItem },
              React.createElement(Text, { style: styles.speedMetricLabel }, getFriendlyMetricName(key)),
              React.createElement(Text, { style: styles.speedMetricValue }, getMetricValue(value))
            )
          )
        )
      ),
      
      // Footer
      React.createElement(Text, { style: styles.footer }, "UX-Analyzer Report • Seite 4 von 7")
    ),

    // Page 5: Mobile PageSpeed Data
    React.createElement(Page, { size: "A4", style: styles.page },
      // Header
      React.createElement(View, { style: styles.header },
        React.createElement(Text, { style: styles.title }, "Mobile Performance"),
        React.createElement(Text, { style: styles.subtitle }, "PageSpeed Insights - Mobile Analyse")
      ),
      
      // Mobile PageSpeed Data
      data.pageSpeedData && data.pageSpeedData.mobile && React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, "Mobile Performance Übersicht"),
        
        
        // Four main scores in grid
        React.createElement(View, { style: styles.speedScoresGrid },
          React.createElement(View, { style: styles.speedScoreItem },
            React.createElement(Text, { style: styles.speedScoreLabel }, "Performance"),
            React.createElement(Text, { 
              style: [styles.speedScoreValue, { 
                backgroundColor: getScoreColor(data.pageSpeedData.mobile.performance || 0),
                color: '#ffffff' 
              }]
            }, `${data.pageSpeedData.mobile.performance || 0}/100`)
          ),
          React.createElement(View, { style: styles.speedScoreItem },
            React.createElement(Text, { style: styles.speedScoreLabel }, "Zugänglichkeit"),
            React.createElement(Text, { 
              style: [styles.speedScoreValue, { 
                backgroundColor: getScoreColor(data.pageSpeedData.mobile.accessibility || 0),
                color: '#ffffff' 
              }]
            }, `${data.pageSpeedData.mobile.accessibility || 0}/100`)
          ),
          React.createElement(View, { style: styles.speedScoreItem },
            React.createElement(Text, { style: styles.speedScoreLabel }, "Best Practices"),
            React.createElement(Text, { 
              style: [styles.speedScoreValue, { 
                backgroundColor: getScoreColor(data.pageSpeedData.mobile.bestPractices || 0),
                color: '#ffffff' 
              }]
            }, `${data.pageSpeedData.mobile.bestPractices || 0}/100`)
          ),
          React.createElement(View, { style: styles.speedScoreItem },
            React.createElement(Text, { style: styles.speedScoreLabel }, "SEO"),
            React.createElement(Text, { 
              style: [styles.speedScoreValue, { 
                backgroundColor: getScoreColor(data.pageSpeedData.mobile.seo || 0),
                color: '#ffffff' 
              }]
            }, `${data.pageSpeedData.mobile.seo || 0}/100`)
          )
        ),
        
        // Core Web Vitals
        data.pageSpeedData.mobile.metrics && React.createElement(View, { style: [styles.speedMetrics, { marginTop: 20 }] },
          React.createElement(Text, { style: styles.speedMetricsTitle }, "Core Web Vitals - Mobile"),
          ...Object.entries(data.pageSpeedData.mobile.metrics).slice(0, 8).map(([key, value], idx) =>
            React.createElement(View, { key: idx, style: styles.speedMetricItem },
              React.createElement(Text, { style: styles.speedMetricLabel }, getFriendlyMetricName(key)),
              React.createElement(Text, { style: styles.speedMetricValue }, getMetricValue(value))
            )
          )
        ),

        // PageSpeed Recommendations
        data.pageSpeedRecommendations && data.pageSpeedRecommendations.length > 0 && React.createElement(View, { style: { marginTop: 20 } },
          React.createElement(Text, { style: styles.speedMetricsTitle }, "KI-Handlungsempfehlungen"),
          ...data.pageSpeedRecommendations.slice(0, 3).map((rec, index) =>
            React.createElement(View, { 
              key: index, 
              style: { 
                backgroundColor: '#ffffff',
                padding: 12,
                marginBottom: 10,
                borderRadius: 6,
                borderWidth: 1,
                borderColor: '#e2e8f0',
                borderLeftWidth: 4,
                borderLeftColor: rec.impact === 'high' ? '#ef4444' : rec.impact === 'medium' ? '#f59e0b' : '#10b981'
              }
            },
              React.createElement(View, { style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 } },
                React.createElement(Text, { style: { fontSize: 13, fontWeight: 'bold', color: '#1f2937', flex: 1 } }, rec.title),
                React.createElement(View, { style: { flexDirection: 'row', gap: 4 } },
                  React.createElement(Text, { 
                    style: { 
                      fontSize: 10, 
                      paddingHorizontal: 6, 
                      paddingVertical: 2, 
                      borderRadius: 3,
                      backgroundColor: rec.impact === 'high' ? '#fef2f2' : rec.impact === 'medium' ? '#fffbeb' : '#f0fdf4',
                      color: rec.impact === 'high' ? '#dc2626' : rec.impact === 'medium' ? '#d97706' : '#059669'
                    }
                  }, rec.impact === 'high' ? 'Hoch' : rec.impact === 'medium' ? 'Mittel' : 'Niedrig'),
                  React.createElement(Text, { 
                    style: { 
                      fontSize: 10, 
                      paddingHorizontal: 6, 
                      paddingVertical: 2, 
                      borderRadius: 3,
                      backgroundColor: '#f1f5f9',
                      color: '#475569'
                    }
                  }, rec.difficulty === 'easy' ? 'Einfach' : rec.difficulty === 'medium' ? 'Mittel' : 'Schwer')
                )
              ),
              React.createElement(Text, { style: { fontSize: 11, color: '#6b7280', marginBottom: 8, lineHeight: 1.4 } }, rec.description),
              React.createElement(View, { style: { marginLeft: 8 } },
                ...rec.actionSteps.slice(0, 2).map((step, stepIndex) =>
                  React.createElement(Text, { 
                    key: stepIndex, 
                    style: { fontSize: 10, color: '#374151', marginBottom: 3, lineHeight: 1.3 }
                  }, `• ${step}`)
                ),
                rec.actionSteps.length > 2 && React.createElement(Text, { 
                  style: { fontSize: 10, color: '#6b7280', fontStyle: 'italic' }
                }, `... ${rec.actionSteps.length - 2} weitere Schritte`)
              )
            )
          ),
          data.pageSpeedRecommendations.length > 3 && React.createElement(Text, { 
            style: { fontSize: 11, color: '#6b7280', fontStyle: 'italic', textAlign: 'center', marginTop: 8 }
          }, `... und ${data.pageSpeedRecommendations.length - 3} weitere Empfehlungen`)
        )
      ),
      
      // Footer
      React.createElement(Text, { style: styles.footer }, "UX-Analyzer Report • Seite 5 von 7")
    ),

    // Page 6: Meta Tags Analysis
    React.createElement(Page, { size: "A4", style: styles.page },
      // Header
      React.createElement(View, { style: styles.header },
        React.createElement(Text, { style: styles.title }, "Meta Tags Analyse"),
        React.createElement(Text, { style: styles.subtitle }, "SEO & Social Media Optimierung")
      ),
      
      // Meta Tags Summary
      data.metaTagsData && React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, "SEO-Übersicht"),
        React.createElement(View, { style: styles.metaSummary },
          React.createElement(View, { style: styles.metaSummaryItem },
            React.createElement(Text, { style: [styles.metaSummaryValue, { color: getScoreColor(data.metaTagsData.score / 10) }] }, `${data.metaTagsData.score}%`),
            React.createElement(Text, { style: styles.metaSummaryLabel }, "SEO Score")
          ),
          React.createElement(View, { style: styles.metaSummaryItem },
            React.createElement(Text, { style: [styles.metaSummaryValue, { color: '#10b981' }] }, `${data.metaTagsData.present}`),
            React.createElement(Text, { style: styles.metaSummaryLabel }, "Tags vorhanden")
          ),
          React.createElement(View, { style: styles.metaSummaryItem },
            React.createElement(Text, { style: [styles.metaSummaryValue, { color: '#ef4444' }] }, `${data.metaTagsData.missing}`),
            React.createElement(Text, { style: styles.metaSummaryLabel }, "Tags fehlen")
          )
        )
      ),
      
      // Meta Tags List (simplified version based on actual data structure)
      data.metaTagsData && data.metaTagsData.tags && data.metaTagsData.tags.length > 0 && React.createElement(View, { style: styles.metaGroup },
        React.createElement(Text, { style: styles.metaGroupTitle }, "Meta Tags Übersicht"),
        React.createElement(View, { style: styles.metaTagsList },
          ...data.metaTagsData.tags.slice(0, 12).map((tag, tagIndex) =>
            React.createElement(View, { key: tagIndex, style: styles.metaTagItem },
              React.createElement(View, { style: styles.metaTagRow },
                React.createElement(Text, { 
                  style: [styles.metaTagStatus, { color: tag.status === 'present' ? '#10b981' : '#ef4444' }]
                }, tag.status === 'present' ? '✓' : '✗'),
                React.createElement(Text, { style: styles.metaTagName }, tag.tag),
                React.createElement(Text, { style: styles.metaTagContent }, 
                  tag.content && tag.content.length > 50 
                    ? tag.content.substring(0, 50) + '...' 
                    : tag.content || (tag.status === 'present' ? 'Vorhanden' : 'Fehlt')
                )
              )
            )
          ),
          data.metaTagsData.tags.length > 12 && React.createElement(Text, { 
            style: { fontSize: 10, color: '#6b7280', fontStyle: 'italic', marginTop: 5 }
          }, `... und ${data.metaTagsData.tags.length - 12} weitere Tags`)
        )
      ),
      
      // Footer
      React.createElement(Text, { style: styles.footer }, "UX-Analyzer Report • Seite 6 von 7")
    ),

    // Page 7: GEO Check Analysis
    React.createElement(Page, { size: "A4", style: styles.page },
      // Header
      React.createElement(View, { style: styles.header },
        React.createElement(Text, { style: styles.title }, "GEO-Check Analyse"),
        React.createElement(Text, { style: styles.subtitle }, "Generative Engine Optimization")
      ),
      
      // GEO Check Summary
      data.geoCheckData && React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, "GEO-Optimierung für AI-Systeme"),
        React.createElement(View, { style: styles.metaSummary },
          React.createElement(View, { style: styles.metaSummaryItem },
            React.createElement(Text, { style: [styles.metaSummaryValue, { color: getScoreColor(data.geoCheckData.score) }] }, `${data.geoCheckData.score}/10`),
            React.createElement(Text, { style: styles.metaSummaryLabel }, "GEO Score")
          ),
          React.createElement(View, { style: styles.metaSummaryItem },
            React.createElement(Text, { style: [styles.metaSummaryValue, { color: '#10b981' }] }, `${data.geoCheckData.factors.filter(f => f.result).length}`),
            React.createElement(Text, { style: styles.metaSummaryLabel }, "Faktoren erfüllt")
          ),
          React.createElement(View, { style: styles.metaSummaryItem },
            React.createElement(Text, { style: [styles.metaSummaryValue, { color: '#ef4444' }] }, `${data.geoCheckData.factors.filter(f => !f.result).length}`),
            React.createElement(Text, { style: styles.metaSummaryLabel }, "Verbesserungsbedarf")
          )
        )
      ),

      // GEO Factors List
      data.geoCheckData && data.geoCheckData.factors && data.geoCheckData.factors.map((factor, factorIndex) => {
        return React.createElement(View, { key: factorIndex, style: styles.metaGroup },
          React.createElement(View, { style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 } },
            React.createElement(Text, { style: styles.metaGroupTitle }, factor.name),
            React.createElement(View, { 
              style: [styles.scoreBox, { backgroundColor: factor.result ? '#10b981' : '#ef4444' }]
            },
              React.createElement(Text, { 
                style: [styles.scoreBoxText, { color: '#ffffff', fontSize: 12 }]
              }, factor.result ? '✓' : '✗')
            )
          ),
          React.createElement(Text, { 
            style: { fontSize: 12, color: '#374151', marginBottom: 8, lineHeight: 1.5 }
          }, factor.comment),
          
          // Factor details if available
          factor.details && factor.details.length > 0 && React.createElement(View, { style: styles.metaTagsList },
            React.createElement(Text, { 
              style: { fontSize: 11, fontWeight: 'bold', color: '#6b7280', marginBottom: 4 }
            }, "Details:"),
            ...factor.details.slice(0, 3).map((detail, detailIndex) =>
              React.createElement(Text, { 
                key: detailIndex, 
                style: { fontSize: 10, color: '#6b7280', marginBottom: 2, paddingLeft: 10 }
              }, `• ${detail}`)
            ),
            factor.details.length > 3 && React.createElement(Text, { 
              style: { fontSize: 10, color: '#6b7280', fontStyle: 'italic', marginTop: 3, paddingLeft: 10 }
            }, `... und ${factor.details.length - 3} weitere Details`)
          )
        );
      }),

      // GEO Recommendations
      data.geoRecommendations && data.geoRecommendations.length > 0 && React.createElement(View, { style: { marginTop: 20 } },
        React.createElement(Text, { style: styles.metaGroupTitle }, "KI-Handlungsempfehlungen für GEO"),
        ...data.geoRecommendations.slice(0, 3).map((rec, index) =>
          React.createElement(View, { 
            key: index, 
            style: { 
              backgroundColor: '#ffffff',
              padding: 12,
              marginBottom: 10,
              borderRadius: 6,
              borderWidth: 1,
              borderColor: '#e2e8f0',
              borderLeftWidth: 4,
              borderLeftColor: rec.impact === 'high' ? '#ef4444' : rec.impact === 'medium' ? '#f59e0b' : '#10b981'
            }
          },
            React.createElement(View, { style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 } },
              React.createElement(Text, { style: { fontSize: 13, fontWeight: 'bold', color: '#1f2937', flex: 1 } }, rec.title),
              React.createElement(View, { style: { flexDirection: 'row', gap: 4 } },
                React.createElement(Text, { 
                  style: { 
                    fontSize: 10, 
                    paddingHorizontal: 6, 
                    paddingVertical: 2, 
                    borderRadius: 3,
                    backgroundColor: rec.impact === 'high' ? '#fef2f2' : rec.impact === 'medium' ? '#fffbeb' : '#f0fdf4',
                    color: rec.impact === 'high' ? '#dc2626' : rec.impact === 'medium' ? '#d97706' : '#059669'
                  }
                }, rec.impact === 'high' ? 'Hoch' : rec.impact === 'medium' ? 'Mittel' : 'Niedrig'),
                React.createElement(Text, { 
                  style: { 
                    fontSize: 10, 
                    paddingHorizontal: 6, 
                    paddingVertical: 2, 
                    borderRadius: 3,
                    backgroundColor: '#f1f5f9',
                    color: '#475569'
                  }
                }, rec.difficulty === 'easy' ? 'Einfach' : rec.difficulty === 'medium' ? 'Mittel' : 'Schwer')
              )
            ),
            React.createElement(Text, { style: { fontSize: 11, color: '#6b7280', marginBottom: 8, lineHeight: 1.4 } }, rec.description),
            React.createElement(View, { style: { marginLeft: 8 } },
              ...rec.actionSteps.slice(0, 2).map((step, stepIndex) =>
                React.createElement(Text, { 
                  key: stepIndex, 
                  style: { fontSize: 10, color: '#374151', marginBottom: 3, lineHeight: 1.3 }
                }, `• ${step}`)
              ),
              rec.actionSteps.length > 2 && React.createElement(Text, { 
                style: { fontSize: 10, color: '#6b7280', fontStyle: 'italic' }
              }, `... ${rec.actionSteps.length - 2} weitere Schritte`)
            )
          )
        ),
        data.geoRecommendations.length > 3 && React.createElement(Text, { 
          style: { fontSize: 11, color: '#6b7280', fontStyle: 'italic', textAlign: 'center', marginTop: 8 }
        }, `... und ${data.geoRecommendations.length - 3} weitere Empfehlungen`)
      ),

      // Info about GEO
      React.createElement(View, { 
        style: { 
          backgroundColor: '#f0f9ff', 
          padding: 15, 
          borderRadius: 8, 
          marginTop: 20,
          borderLeftWidth: 4,
          borderLeftColor: '#3b82f6'
        }
      },
        React.createElement(Text, { 
          style: { fontSize: 14, fontWeight: 'bold', color: '#1f2937', marginBottom: 8 }
        }, "Was ist GEO (Generative Engine Optimization)?"),
        React.createElement(Text, { 
          style: { fontSize: 12, color: '#374151', lineHeight: 1.6 }
        }, "GEO optimiert Websites für AI-Systeme wie ChatGPT, Google Gemini und Perplexity. Strukturierte Daten, semantisches HTML, klare Autorenangaben und gut strukturierte Inhalte helfen AI-Systemen, Ihre Website besser zu verstehen, zu zitieren und in Antworten einzubinden.")
      ),

      // No GEO data message
      !data.geoCheckData && React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, "GEO-Check nicht verfügbar"),
        React.createElement(Text, { 
          style: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginTop: 40 }
        }, "Für diese Analyse wurden keine GEO-Check Daten erfasst. Führen Sie einen GEO-Check durch, um diese Seite im Report zu sehen.")
      ),
      
      // Footer
      React.createElement(Text, { style: styles.footer }, "UX-Analyzer Report • Seite 7 von 7")
    )
  );
}

export async function POST(request: NextRequest) {
  try {
    const body: SendReportRequest = await request.json();
    const { email, url, data, timestamp } = body;

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Gültige E-Mail-Adresse erforderlich' },
        { status: 400 }
      );
    }

    // Validate data
    if (!data || !url) {
      return NextResponse.json(
        { success: false, error: 'Analyse-Daten sind erforderlich' },
        { status: 400 }
      );
    }

    // Generate PDF
    console.log('Generating PDF report...');
    const reportTimestamp = timestamp || new Date().toLocaleDateString('de-DE');
    const pdfDocument = createPDFDocument(url, reportTimestamp, data);
    const pdfBuffer = await renderToBuffer(pdfDocument);

    // Prepare email content
    const reportDate = new Date().toLocaleDateString('de-DE');
    const domain = new URL(url).hostname;

    // Send email with PDF attachment
    const resend = getResendClient();
    const emailResult = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@yourdomain.com',
      to: [email],
      subject: `UX-Analyse Report für ${domain}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            UX-Analyse Report
          </h1>
          
          <p style="font-size: 16px; line-height: 1.6; color: #555;">
            Vielen Dank für Ihr Interesse an unserem UX-Analyse-Service!
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Analyse-Details</h2>
            <ul style="line-height: 1.8; color: #555;">
              <li><strong>Website:</strong> ${url}</li>
              <li><strong>Analyse-Datum:</strong> ${reportDate}</li>
              <li><strong>UX-Score:</strong> ${data.uxAnalysis?.overallScore || 'N/A'}/10</li>
              <li><strong>PageSpeed (Desktop):</strong> ${data.pageSpeedData?.desktop?.score || 'N/A'}/100</li>
              <li><strong>PageSpeed (Mobile):</strong> ${data.pageSpeedData?.mobile?.score || 'N/A'}/100</li>
            </ul>
          </div>
          
          <p style="font-size: 14px; color: #666; border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px;">
            <strong>Wichtiger Hinweis:</strong> Dieser Report ist als PDF-Anhang beigefügt und enthält 
            detaillierte Empfehlungen zur Verbesserung Ihrer Website-Performance und Benutzererfahrung.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #666;">
              Haben Sie Fragen? Kontaktieren Sie uns gerne!
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">
            Dies ist eine automatisch generierte E-Mail. Bitte antworten Sie nicht direkt auf diese Nachricht.
          </p>
        </div>
      `,
      attachments: [
        {
          filename: `UX-Report-${domain}-${reportDate.replace(/\./g, '-')}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    console.log('Email sent successfully:', emailResult.data?.id);

    return NextResponse.json({
      success: true,
      message: 'Report erfolgreich versendet',
      emailId: emailResult.data?.id
    });

  } catch (error) {
    console.error('Error sending report:', error);
    
    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'E-Mail-Service nicht konfiguriert. Bitte kontaktieren Sie den Administrator.' 
          },
          { status: 500 }
        );
      }
      
      if (error.message.includes('Invalid email')) {
        return NextResponse.json(
          { success: false, error: 'Ungültige E-Mail-Adresse' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Fehler beim Versenden des Reports. Bitte versuchen Sie es später erneut.' 
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'send-report',
    timestamp: new Date().toISOString()
  });
}
