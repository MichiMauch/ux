"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useSWR from "swr";
import {
  Bot,
  CheckCircle,
  XCircle,
  RefreshCw,
  Info,
  Zap,
  Search,
  Users,
  FileText,
  Lightbulb,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface GeoFactor {
  name: string;
  result: boolean;
  weight: number;
  comment: string;
  details?: string[];
}

interface GeoCheckResult {
  success: boolean;
  score: number;
  factors: GeoFactor[];
  url: string;
  timestamp: string;
  error?: string;
}

interface GeoRecommendation {
  category: string;
  impact: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionSteps: string[];
  estimatedSavings?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface GeoRecommendationsResult {
  recommendations: GeoRecommendation[];
  url: string;
  timestamp: string;
}

interface GeoCheckCardProps {
  url: string;
  analysisId?: number;
  onDataUpdate?: (data: GeoCheckResult) => void;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const getScoreColor = (score: number): string => {
  if (score >= 8) return "text-green-600";
  if (score >= 6) return "text-yellow-600";
  if (score >= 4) return "text-orange-600";
  return "text-red-600";
};

const getScoreBgColor = (score: number): string => {
  if (score >= 8) return "bg-green-100";
  if (score >= 6) return "bg-yellow-100";
  if (score >= 4) return "bg-orange-100";
  return "bg-red-100";
};

const getFactorIcon = (factorName: string) => {
  switch (factorName) {
    case "Structured Data":
      return <FileText className="h-4 w-4" />;
    case "Semantisches HTML":
      return <Zap className="h-4 w-4" />;
    case "Autoren-Information":
      return <Users className="h-4 w-4" />;
    case "Inhaltliche Struktur":
      return <Search className="h-4 w-4" />;
    default:
      return <Info className="h-4 w-4" />;
  }
};

const GeoCheckCard: React.FC<GeoCheckCardProps> = ({ 
  url, 
  analysisId, 
  onDataUpdate 
}) => {
  // Create persistent state using localStorage
  const getStorageKey = useCallback((key: string) => `geo-check-${url}-${key}`, [url]);
  
  const [email, setEmail] = useState("");
  const [generateRecommendations, setGenerateRecommendations] = useState(false);

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
    data: geoData,
    error: geoError,
    isLoading: geoLoading,
    mutate: refreshGeoData,
  } = useSWR<GeoCheckResult>(
    `/api/geo-check?url=${encodeURIComponent(url)}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onSuccess: (data) => {
        if (onDataUpdate && data.success) {
          onDataUpdate(data);
        }
      },
    }
  );

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
            source: "geo-check",
          }),
        });

        const result = await response.json();
        if (result.success) {
          console.log("E-Mail für GEO Empfehlungen gespeichert:", email, "| Quelle: geo-check");
        } else {
          console.error("Fehler beim Speichern der E-Mail:", result.error);
        }
      } catch (error) {
        console.error("Fehler beim Speichern der E-Mail:", error);
      }
    }

    setGenerateRecommendations(true);
  };

  // Create cache key for recommendations
  const recommendationsCacheKey =
    geoData && geoData.factors && geoData.factors.length > 0
      ? `geo-recommendations:${url}:${geoData.factors
          .map((f) => f.name + f.result)
          .sort()
          .join(",")}`
      : null;

  // Custom fetcher for GEO recommendations
  const recommendationsFetcher = async () => {
    if (!geoData) throw new Error("No GEO data available");

    const response = await fetch("/api/geo-recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        factors: geoData.factors,
        url: geoData.url,
        score: geoData.score,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  };

  const {
    data: recommendationsData,
    error: recommendationsError,
    isLoading: recommendationsLoading,
  } = useSWR<GeoRecommendationsResult>(
    generateRecommendations && recommendationsCacheKey,
    recommendationsFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60 * 60 * 1000, // 1 hour
      shouldRetryOnError: false,
      errorRetryCount: 0,
    }
  );


  if (geoError) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            GEO-Check (Generative Engine Optimization)
          </CardTitle>
          <CardDescription>
            Fehler beim Laden der GEO-Analyse
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-red-600 mb-4">
            {geoError.message || "Unbekannter Fehler"}
          </div>
          <Button
            onClick={() => refreshGeoData()}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Erneut versuchen
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          GEO-Check (Generative Engine Optimization)
        </CardTitle>
        <CardDescription>
          Optimierung für AI-Systeme wie ChatGPT, Gemini, Perplexity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {geoLoading ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Analysiere GEO-Faktoren...</span>
            </div>
            <Progress value={33} className="w-full" />
          </div>
        ) : geoData && geoData.success ? (
          <>
            {/* Overall Score */}
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${getScoreBgColor(geoData.score)} mb-4`}>
                <span className={`text-2xl font-bold ${getScoreColor(geoData.score)}`}>
                  {geoData.score}
                </span>
              </div>
              <div className="text-sm text-gray-600">GEO-Score von 10</div>
              <Progress value={geoData.score * 10} className="w-full mt-2" />
            </div>

            {/* Score Interpretation */}
            <div className="text-center">
              {geoData.score >= 8 && (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Excellent - AI-optimiert
                </Badge>
              )}
              {geoData.score >= 6 && geoData.score < 8 && (
                <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                  Gut - Verbesserungen möglich
                </Badge>
              )}
              {geoData.score >= 4 && geoData.score < 6 && (
                <Badge variant="default" className="bg-orange-100 text-orange-800">
                  Befriedigend - Optimierung empfohlen
                </Badge>
              )}
              {geoData.score < 4 && (
                <Badge variant="destructive">
                  Mangelhaft - Dringend optimieren
                </Badge>
              )}
            </div>

            {/* Factors List */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Einzelfaktoren</h3>
              {geoData.factors.map((factor, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getFactorIcon(factor.name)}
                      <div>
                        <div className="font-medium text-gray-900">
                          {factor.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          Gewichtung: {Math.round(factor.weight * 100)}%
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {factor.result ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <div className="text-sm text-gray-700">
                      {factor.comment}
                    </div>
                    
                    {/* Details Section - Always visible if details exist */}
                    {factor.details && factor.details.length > 0 && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-md">
                        <div className="text-sm font-medium text-gray-700 mb-2">
                          Details:
                        </div>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {factor.details.map((detail, detailIndex) => (
                            <li key={detailIndex} className="flex items-start gap-2">
                              <span className="text-blue-600 mt-1">•</span>
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Email Input and Button for Recommendations */}
            <div className="space-y-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">KI-Empfehlungen erhalten</h3>
              </div>
              <Input
                type="email"
                placeholder="E-Mail-Adresse eingeben"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
              <Button
                onClick={handleGenerateRecommendations}
                className="w-full"
                disabled={!email || geoLoading}
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Handlungsempfehlungen generieren
              </Button>
            </div>

            {/* AI-Generated Recommendations */}
            {generateRecommendations && geoData?.factors && geoData.factors.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  KI-Handlungsempfehlungen
                </h4>

                {recommendationsLoading ? (
                  <div className="flex items-center gap-2 text-muted-foreground p-4 bg-gray-50 rounded-lg">
                    <Clock className="h-4 w-4 animate-spin" />
                    KI analysiert Ihre GEO-Optimierungsmöglichkeiten...
                  </div>
                ) : recommendationsError ? (
                  <div className="text-red-600 flex items-center gap-2 p-4 bg-red-50 rounded-lg">
                    <AlertCircle className="h-4 w-4" />
                    <div>
                      <div>Handlungsempfehlungen konnten nicht geladen werden.</div>
                      <div className="text-sm text-gray-500 mt-1">
                        Fehler: {recommendationsError.message || recommendationsError}
                      </div>
                    </div>
                  </div>
                ) : recommendationsData?.recommendations ? (
                  <div className="space-y-4">
                    {recommendationsData.recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 bg-white hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="font-medium text-gray-900">{rec.title}</h5>
                          <div className="flex gap-2">
                            <Badge
                              variant="outline"
                              className={
                                rec.impact === 'high'
                                  ? 'bg-red-50 text-red-700 border-red-200'
                                  : rec.impact === 'medium'
                                  ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                  : 'bg-green-50 text-green-700 border-green-200'
                              }
                            >
                              {rec.impact === 'high' ? 'Hohe Priorität' : 
                               rec.impact === 'medium' ? 'Mittlere Priorität' : 'Niedrige Priorität'}
                            </Badge>
                            <Badge variant="secondary">
                              {rec.difficulty === 'easy' ? 'Einfach' : 
                               rec.difficulty === 'medium' ? 'Mittel' : 'Schwer'}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{rec.description}</p>
                        
                        <div className="space-y-2">
                          <div className="font-medium text-sm text-gray-900">Handlungsschritte:</div>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {rec.actionSteps.map((step, stepIndex) => (
                              <li key={stepIndex} className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">•</span>
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {rec.estimatedSavings && (
                          <div className="mt-3 p-2 bg-green-50 rounded text-sm text-green-800">
                            <strong>Geschätzte Verbesserung:</strong> {rec.estimatedSavings}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            )}

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <div className="font-medium text-blue-900 mb-1">
                    Was ist GEO (Generative Engine Optimization)?
                  </div>
                  <div className="text-blue-800">
                    GEO optimiert Ihre Website für AI-Systeme wie ChatGPT, Google Gemini 
                    und Perplexity, damit diese Ihre Inhalte besser verstehen, zitieren 
                    und in Antworten einbinden können.
                  </div>
                </div>
              </div>
            </div>

            {/* Refresh Button */}
            <Button
              onClick={() => refreshGeoData()}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              GEO-Check aktualisieren
            </Button>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-600">Keine GEO-Daten verfügbar</div>
            <Button
              onClick={() => refreshGeoData()}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              GEO-Check starten
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GeoCheckCard;