"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import useSWR from "swr";
import { AlertCircle, Clock, Loader2, TrendingUp, Zap } from "lucide-react";

// Type definitions matching the API response
interface PageSpeedMetric {
  id: string;
  title: string;
  description: string;
  score: number | null;
  displayValue?: string;
  numericValue?: number;
  numericUnit?: string;
}

interface PageSpeedResult {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  metrics: {
    firstContentfulPaint: PageSpeedMetric;
    largestContentfulPaint: PageSpeedMetric;
    firstInputDelay: PageSpeedMetric;
    cumulativeLayoutShift: PageSpeedMetric;
    speedIndex: PageSpeedMetric;
    totalBlockingTime: PageSpeedMetric;
  };
  opportunities: Array<{
    id: string;
    title: string;
    description: string;
    displayValue: string;
  }>;
  url: string;
  timestamp: string;
}

interface PageSpeedRecommendation {
  category: string;
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  actionSteps: string[];
  expectedImpact: string;
  difficulty: "easy" | "medium" | "hard";
}

interface PageSpeedRecommendationsResult {
  recommendations: PageSpeedRecommendation[];
  summary: string;
}

interface PageSpeedCardProps {
  url: string;
  className?: string;
}

// Fetcher function for SWR
const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return res.json();
  });

// Helper function to get score color
const getScoreColor = (score: number): string => {
  if (score >= 90) return "text-green-600";
  if (score >= 50) return "text-yellow-600";
  return "text-red-600";
};

// Helper function to get score badge color
const getScoreBadgeColor = (score: number): string => {
  if (score >= 90) return "bg-green-100 text-green-800 border-green-200";
  if (score >= 50) return "bg-yellow-100 text-yellow-800 border-yellow-200";
  return "bg-red-100 text-red-800 border-red-200";
};

// Helper function to format metric display value
const formatMetricValue = (metric: PageSpeedMetric): string => {
  if (metric.displayValue) return metric.displayValue;
  if (metric.numericValue && metric.numericUnit) {
    const value = metric.numericValue;
    const unit = metric.numericUnit;

    if (unit === "millisecond") {
      return value < 1000
        ? `${Math.round(value)} ms`
        : `${(value / 1000).toFixed(1)} s`;
    }
    return `${value.toFixed(2)} ${unit}`;
  }
  return "N/A";
};

export function PageSpeedCard({ url, className = "" }: PageSpeedCardProps) {
  const { data, error, isLoading } = useSWR<PageSpeedResult>(
    url ? `/api/pagespeed?url=${encodeURIComponent(url)}` : null,
    fetcher,
    {
      refreshInterval: 0, // Don't refresh automatically
      revalidateOnFocus: false, // Don't revalidate when window regains focus
      dedupingInterval: 60000, // Cache for 1 minute
      errorRetryCount: 2, // Retry failed requests twice
      errorRetryInterval: 5000, // Wait 5 seconds between retries
    }
  );

  // Load GPT recommendations once we have PageSpeed data
  const { data: recommendations, isLoading: recommendationsLoading } =
    useSWR<PageSpeedRecommendationsResult>(
      data?.opportunities && data.opportunities.length > 0
        ? `/api/pagespeed-recommendations?url=${encodeURIComponent(url)}`
        : null,
      fetcher,
      {
        refreshInterval: 0,
        revalidateOnFocus: false,
        dedupingInterval: 300000, // Cache for 5 minutes (recommendations change less frequently)
      }
    );

  if (isLoading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="flex items-center space-x-3 mb-4">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          <h3 className="text-lg font-semibold">PageSpeed Insights</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Analysiere Performance...</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Performance", "Accessibility", "Best Practices", "SEO"].map(
              (category) => (
                <div key={category} className="text-center">
                  <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-2 animate-pulse" />
                  <p className="text-xs text-gray-500">{category}</p>
                </div>
              )
            )}
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`p-6 border-red-200 bg-red-50 ${className}`}>
        <div className="flex items-center space-x-3 mb-3">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <h3 className="text-lg font-semibold text-red-900">
            PageSpeed Analyse fehlgeschlagen
          </h3>
        </div>
        <p className="text-sm text-red-700 mb-3">
          {error instanceof Error
            ? error.message
            : "Unbekannter Fehler bei der Performance-Analyse"}
        </p>
        <p className="text-xs text-red-600">
          Mögliche Ursachen: URL nicht erreichbar, API-Limit erreicht, oder
          temporärer Service-Fehler.
        </p>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  const coreMetrics = [
    { key: "firstContentfulPaint", label: "FCP", icon: Zap },
    { key: "largestContentfulPaint", label: "LCP", icon: TrendingUp },
    { key: "cumulativeLayoutShift", label: "CLS", icon: AlertCircle },
    { key: "totalBlockingTime", label: "TBT", icon: Clock },
  ] as const;

  return (
    <Card className={`p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">PageSpeed Insights</h3>
        <Badge variant="outline" className="text-xs">
          {new Date(data.timestamp).toLocaleTimeString("de-DE")}
        </Badge>
      </div>

      {/* Core Scores */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div
            className={`text-2xl font-bold ${getScoreColor(data.performance)}`}
          >
            {data.performance}
          </div>
          <Progress value={data.performance} className="h-2 my-2" />
          <p className="text-xs text-gray-600">Performance</p>
        </div>
        <div className="text-center">
          <div
            className={`text-2xl font-bold ${getScoreColor(data.accessibility)}`}
          >
            {data.accessibility}
          </div>
          <Progress value={data.accessibility} className="h-2 my-2" />
          <p className="text-xs text-gray-600">Accessibility</p>
        </div>
        <div className="text-center">
          <div
            className={`text-2xl font-bold ${getScoreColor(data.bestPractices)}`}
          >
            {data.bestPractices}
          </div>
          <Progress value={data.bestPractices} className="h-2 my-2" />
          <p className="text-xs text-gray-600">Best Practices</p>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${getScoreColor(data.seo)}`}>
            {data.seo}
          </div>
          <Progress value={data.seo} className="h-2 my-2" />
          <p className="text-xs text-gray-600">SEO</p>
        </div>
      </div>

      {/* Core Web Vitals */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-3 text-gray-900">
          Core Web Vitals
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {coreMetrics.map(({ key, label, icon: Icon }) => {
            const metric = data.metrics[key];
            return (
              <div key={key} className="text-center p-3 bg-gray-50 rounded-lg">
                <Icon className="h-4 w-4 mx-auto mb-1 text-gray-600" />
                <div className="text-sm font-medium">
                  {formatMetricValue(metric)}
                </div>
                <p className="text-xs text-gray-500">{label}</p>
                {metric.score !== null && (
                  <Badge
                    className={`text-xs mt-1 ${getScoreBadgeColor(metric.score)}`}
                    variant="outline"
                  >
                    {metric.score}/100
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Improvement Opportunities */}
      {data.opportunities.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-3 text-gray-900">
            Technische Verbesserungsmöglichkeiten
          </h4>
          <div className="space-y-2">
            {data.opportunities.slice(0, 3).map((opportunity) => (
              <div
                key={opportunity.id}
                className="p-3 bg-blue-50 rounded-lg border border-blue-100"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900">
                      {opportunity.title}
                    </p>
                    <p className="text-xs text-blue-700 mt-1 line-clamp-2">
                      {opportunity.description}
                    </p>
                  </div>
                  {opportunity.displayValue && (
                    <Badge variant="outline" className="ml-2 text-xs bg-white">
                      {opportunity.displayValue}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GPT-Generated User-Friendly Recommendations */}
      {data.opportunities.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-3 text-gray-900">
            📋 Handlungsempfehlungen für Sie
          </h4>

          {recommendationsLoading ? (
            <div className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
              <Loader2 className="h-4 w-4 animate-spin text-yellow-600" />
              <span className="text-sm text-yellow-700">
                Erstelle benutzerfreundliche Empfehlungen...
              </span>
            </div>
          ) : recommendations ? (
            <div className="space-y-4">
              {/* Summary */}
              <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                <p className="text-sm text-green-800">
                  {recommendations.summary}
                </p>
              </div>

              {/* Recommendations */}
              <div className="space-y-3">
                {recommendations.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="text-sm font-semibold text-gray-900">
                        {rec.title}
                      </h5>
                      <div className="flex space-x-1">
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            rec.priority === "high"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : rec.priority === "medium"
                                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                : "bg-green-50 text-green-700 border-green-200"
                          }`}
                        >
                          {rec.priority === "high"
                            ? "Hoch"
                            : rec.priority === "medium"
                              ? "Mittel"
                              : "Niedrig"}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            rec.difficulty === "easy"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : rec.difficulty === "medium"
                                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          {rec.difficulty === "easy"
                            ? "Einfach"
                            : rec.difficulty === "medium"
                              ? "Mittel"
                              : "Schwer"}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                      {rec.description}
                    </p>

                    <div className="mb-3">
                      <p className="text-xs font-medium text-gray-700 mb-1">
                        🎯 Erwartete Verbesserung:
                      </p>
                      <p className="text-xs text-gray-600">
                        {rec.expectedImpact}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">
                        📝 Nächste Schritte:
                      </p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {rec.actionSteps.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-start">
                            <span className="text-blue-500 mr-1">•</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">
                Handlungsempfehlungen konnten nicht geladen werden.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Powered by Google PageSpeed Insights • Analysiert:{" "}
          {new URL(data.url).hostname}
        </p>
      </div>
    </Card>
  );
}
