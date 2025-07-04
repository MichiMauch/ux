"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import useSWR from "swr";
import {
  Clock,
  Zap,
  Eye,
  Lightbulb,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

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

interface SimplifiedRecommendation {
  category: string;
  impact: "high" | "medium" | "low";
  title: string;
  description: string;
  actionSteps: string[];
  estimatedSavings?: string;
  difficulty: "easy" | "medium" | "hard";
}

interface RecommendationsResult {
  recommendations: SimplifiedRecommendation[];
  url: string;
  timestamp: string;
  originalOpportunities: number;
}

interface PageSpeedCardProps {
  url: string;
  analysisId?: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const getScoreColor = (score: number) => {
  if (score >= 90) return "text-success-600";
  if (score >= 50) return "text-warning-600";
  return "text-danger-600";
};

const getImpactColor = (impact: string) => {
  switch (impact) {
    case "high":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "easy":
      return "bg-green-100 text-green-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "hard":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function PageSpeedCard({ url, analysisId }: PageSpeedCardProps) {
  // Create persistent state using localStorage
  const getStorageKey = useCallback((key: string) => `pagespeed-${url}-${key}`, [url]);
  
  const [email, setEmail] = useState("");
  const [generateRecommendations, setGenerateRecommendations] = useState(false);
  const [activeTab, setActiveTab] = useState("desktop");

  // Initialize state from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem(getStorageKey('email'));
      const savedGenerateRecommendations = localStorage.getItem(getStorageKey('generateRecommendations'));
      
      if (savedEmail) {
        setEmail(savedEmail);
      }
      if (savedGenerateRecommendations === 'true') {
        setGenerateRecommendations(true);
      }
    }
  }, [url, getStorageKey]);

  // Update localStorage when email changes
  useEffect(() => {
    if (typeof window !== 'undefined' && email) {
      localStorage.setItem(getStorageKey('email'), email);
    }
  }, [email, url, getStorageKey]);

  // Update localStorage when generateRecommendations changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(getStorageKey('generateRecommendations'), generateRecommendations.toString());
    }
  }, [generateRecommendations, url, getStorageKey]);

  const {
    data: pagespeedData,
    error: pagespeedError,
    isLoading: pagespeedLoading,
  } = useSWR<PageSpeedResult>(
    `/api/pagespeed?url=${encodeURIComponent(url)}&strategy=${activeTab}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  // Create a stable cache key for recommendations
  const recommendationsCacheKey =
    pagespeedData && pagespeedData.opportunities.length > 0
      ? `recommendations:${url}:${pagespeedData.opportunities
          .map((o) => o.id)
          .sort()
          .join(",")}`
      : null;

  // Custom fetcher for recommendations with POST request
  const recommendationsFetcher = async () => {
    if (!pagespeedData) throw new Error("No PageSpeed data available");

    const response = await fetch("/api/pagespeed-recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        opportunities: pagespeedData.opportunities,
        url: pagespeedData.url,
        scores: {
          performance: pagespeedData.performance,
          accessibility: pagespeedData.accessibility,
          bestPractices: pagespeedData.bestPractices,
          seo: pagespeedData.seo,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  };

  const handleGenerateRecommendations = async () => {
    if (!email) {
      alert("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
      return;
    }

    // Save email to database with source tracking if analysisId is available
    if (analysisId) {
      try {
        const response = await fetch("/api/track-email-source", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            analysisId,
            email,
            source: "pagespeed",
          }),
        });

        const result = await response.json();
        if (result.success) {
          console.log("E-Mail für PageSpeed Empfehlungen gespeichert:", email, "| Quelle: pagespeed");
        } else {
          console.error("Fehler beim Speichern der E-Mail:", result.error);
        }
      } catch (error) {
        console.error("Fehler beim Speichern der E-Mail:", error);
      }
    }

    setGenerateRecommendations(true);
  };

  const {
    data: recommendationsData,
    error: recommendationsError,
    isLoading: recommendationsLoading,
  } = useSWR<RecommendationsResult>(
    generateRecommendations && recommendationsCacheKey,
    recommendationsFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60 * 60 * 1000, // 1 hour - stable caching
      shouldRetryOnError: false,
      errorRetryCount: 0,
    }
  );

  if (pagespeedError) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            PageSpeed Analyse
          </CardTitle>
          <CardDescription>
            Fehler beim Laden der PageSpeed-Daten
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-red-600">
            {pagespeedError.message || "Unbekannter Fehler"}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          PageSpeed Analyse
        </CardTitle>
        <CardDescription>Google PageSpeed Insights für {url}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-4">
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "desktop"
                ? "bg-primary-400 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setActiveTab("desktop")}
          >
            Desktop
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "mobile"
                ? "bg-primary-400 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setActiveTab("mobile")}
          >
            Mobile
          </button>
        </div>

        {pagespeedLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 animate-spin" />
            PageSpeed-Analyse läuft...
          </div>
        ) : pagespeedData ? (
          <>
            {/* Scores Overview */}
            {activeTab === "desktop" && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${getScoreColor(
                      pagespeedData.performance
                    )}`}
                  >
                    {pagespeedData.performance}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Performance
                  </div>
                  <Progress value={pagespeedData.performance} className="mt-1" />
                </div>
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${getScoreColor(
                      pagespeedData.accessibility
                    )}`}
                  >
                    {pagespeedData.accessibility}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Zugänglichkeit
                  </div>
                  <Progress
                    value={pagespeedData.accessibility}
                    className="mt-1"
                  />
                </div>
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${getScoreColor(
                      pagespeedData.bestPractices
                    )}`}
                  >
                    {pagespeedData.bestPractices}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Best Practices
                  </div>
                  <Progress
                    value={pagespeedData.bestPractices}
                    className="mt-1"
                  />
                </div>
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${getScoreColor(pagespeedData.seo)}`}
                  >
                    {pagespeedData.seo}
                  </div>
                  <div className="text-sm text-muted-foreground">SEO</div>
                  <Progress value={pagespeedData.seo} className="mt-1" />
                </div>
              </div>
            )}

            {activeTab === "mobile" && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${getScoreColor(
                      pagespeedData.performance
                    )}`}
                  >
                    {pagespeedData.performance}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Performance
                  </div>
                  <Progress value={pagespeedData.performance} className="mt-1" />
                </div>
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${getScoreColor(
                      pagespeedData.accessibility
                    )}`}
                  >
                    {pagespeedData.accessibility}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Zugänglichkeit
                  </div>
                  <Progress
                    value={pagespeedData.accessibility}
                    className="mt-1"
                  />
                </div>
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${getScoreColor(
                      pagespeedData.bestPractices
                    )}`}
                  >
                    {pagespeedData.bestPractices}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Best Practices
                  </div>
                  <Progress
                    value={pagespeedData.bestPractices}
                    className="mt-1"
                  />
                </div>
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${getScoreColor(pagespeedData.seo)}`}
                  >
                    {pagespeedData.seo}
                  </div>
                  <div className="text-sm text-muted-foreground">SEO</div>
                  <Progress value={pagespeedData.seo} className="mt-1" />
                </div>
              </div>
            )}

            {/* Core Web Vitals */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Core Web Vitals
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium">
                    {pagespeedData.metrics.largestContentfulPaint.title}
                  </div>
                  <div className="text-lg font-bold text-primary-600">
                    {pagespeedData.metrics.largestContentfulPaint.displayValue}
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium">
                    {pagespeedData.metrics.firstInputDelay.title}
                  </div>
                  <div className="text-lg font-bold text-primary-600">
                    {pagespeedData.metrics.firstInputDelay.displayValue}
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium">
                    {pagespeedData.metrics.cumulativeLayoutShift.title}
                  </div>
                  <div className="text-lg font-bold text-primary-600">
                    {pagespeedData.metrics.cumulativeLayoutShift.displayValue}
                  </div>
                </div>
              </div>
            </div>

            {/* Email Input and Button for Recommendations */}
            <div className="space-y-4">
              <input
                type="email"
                placeholder="E-Mail-Adresse eingeben"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border rounded-lg p-2 w-full"
              />
              <button
                onClick={handleGenerateRecommendations}
                className="bg-primary-400 hover:bg-primary-500 text-white rounded-lg px-4 py-2 transition-colors"
              >
                Handlungsempfehlungen generieren
              </button>
            </div>

            {/* AI-Generated Recommendations */}
            {generateRecommendations && pagespeedData?.opportunities.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Handlungsempfehlungen
                </h4>

                {recommendationsLoading ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4 animate-spin" />
                    KI analysiert die Verbesserungsmöglichkeiten...
                  </div>
                ) : recommendationsError ? (
                  <div className="text-red-600 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Handlungsempfehlungen konnten nicht geladen werden.
                    <div className="text-sm text-gray-500 mt-1">
                      Fehler: {recommendationsError.message || recommendationsError}
                    </div>
                  </div>
                ) : recommendationsData?.recommendations ? (
                  <div className="space-y-4">
                    {recommendationsData.recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 bg-white"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="font-medium">{rec.title}</h5>
                          <div className="flex gap-2">
                            <Badge
                              variant="outline"
                              className={getImpactColor(rec.impact)}
                            >
                              {rec.impact === "high"
                                ? "Hoch"
                                : rec.impact === "medium"
                                  ? "Mittel"
                                  : "Niedrig"}{" "}
                              Impact
                            </Badge>
                            <Badge
                              variant="outline"
                              className={getDifficultyColor(rec.difficulty)}
                            >
                              {rec.difficulty === "easy"
                                ? "Einfach"
                                : rec.difficulty === "medium"
                                  ? "Mittel"
                                  : "Schwer"}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-3">{rec.description}</p>

                        {rec.estimatedSavings && (
                          <div className="text-sm text-green-600 mb-2 font-medium">
                            💡 {rec.estimatedSavings}
                          </div>
                        )}

                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-700">
                            Handlungsschritte:
                          </div>
                          {rec.actionSteps.map((step, stepIndex) => (
                            <div
                              key={stepIndex}
                              className="flex items-start gap-2 text-sm"
                            >
                              <ArrowRight className="h-3 w-3 mt-1 text-primary-500 flex-shrink-0" />
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted-foreground">
                    Keine spezifischen Verbesserungsempfehlungen verfügbar
                  </div>
                )}
              </div>
            )}
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
