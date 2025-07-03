"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreCard } from "./score-card";
import { AdditionalChecks } from "./additional-checks";
import PageSpeedCard from "./pagespeed-card";
import MetaTagsCard from "./meta-tags-card";
import useSWR from 'swr';
import {
  Monitor,
  Smartphone,
  TrendingUp,
  Calendar,
  Globe,
  Download,
  RotateCcw,
  ArrowRight,
  Zap,
  Eye,
  Tags,
  Loader2,
} from "lucide-react";
import { AnalysisResult } from "@/types/analysis";

interface AnalysisDashboardProps {
  analysis: AnalysisResult;
  onNewAnalysis: () => void;
}

export function AnalysisDashboard({
  analysis,
  onNewAnalysis,
}: AnalysisDashboardProps) {
  const [selectedView, setSelectedView] = useState<"desktop" | "mobile">("desktop");
  const [activeTab, setActiveTab] = useState<"ux" | "speed" | "meta">("ux");
  const [showAdditionalChecks, setShowAdditionalChecks] = useState(false);

  // Monitor loading states of different analyses
  const fetcher = (url: string) => fetch(url).then(res => res.json());
  
  const { isLoading: speedLoading } = useSWR(
    `/api/pagespeed?url=${encodeURIComponent(analysis.url)}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const { isLoading: metaLoading } = useSWR(
    `/api/meta-tags?url=${encodeURIComponent(analysis.url)}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const getOverallScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600 bg-green-50";
    if (score >= 6) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getOverallScoreText = (score: number) => {
    if (score >= 8) return "Ausgezeichnet";
    if (score >= 6) return "Gut";
    if (score >= 4) return "Befriedigend";
    return "Verbesserungsbedürftig";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Wenn zusätzliche Checks angezeigt werden sollen
  if (showAdditionalChecks) {
    const additionalChecks = [
      {
        name: "Responsivität",
        status: (analysis.overallScore > 80 ? "passed" : "warning") as
          | "passed"
          | "failed"
          | "warning",
        description: "Website ist für mobile Geräte optimiert",
      },
      {
        name: "Ladegeschwindigkeit",
        status: (analysis.overallScore > 70 ? "passed" : "failed") as
          | "passed"
          | "failed"
          | "warning",
        description: "Optimierung der Ladezeiten erforderlich",
      },
      {
        name: "Barrierefreiheit",
        status: (analysis.overallScore > 85 ? "passed" : "warning") as
          | "passed"
          | "failed"
          | "warning",
        description: "Einhaltung der WCAG-Richtlinien",
      },
    ];

    return <AdditionalChecks checks={additionalChecks} />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            UX-Analyse Ergebnisse
          </h1>
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Globe className="h-4 w-4" />
              <span className="font-medium">{analysis.url}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(analysis.timestamp)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="px-3 py-1">
            {analysis.websiteType === "corporate"
              ? "Corporate Website"
              : analysis.websiteType === "ecommerce"
              ? "E-Commerce Shop"
              : analysis.websiteType === "blog"
              ? "Blog/Content Website"
              : "SaaS/Software Website"}
          </Badge>
          <Button onClick={onNewAnalysis} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Neue Analyse
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("ux")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "ux"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>UX Check</span>
              <Badge variant="outline" className="bg-green-50 text-green-600">
                ✓
              </Badge>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("speed")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "speed"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>Speed Test</span>
              {speedLoading ? (
                <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
              ) : (
                <Badge variant="outline" className="bg-green-50 text-green-600">
                  ✓
                </Badge>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab("meta")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "meta"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center space-x-2">
              <Tags className="h-4 w-4" />
              <span>Meta Tags</span>
              {metaLoading ? (
                <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
              ) : (
                <Badge variant="outline" className="bg-green-50 text-green-600">
                  ✓
                </Badge>
              )}
            </div>
          </button>
        </nav>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Screenshots (33%) */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Screenshots</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant={selectedView === "desktop" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedView("desktop")}
                >
                  <Monitor className="h-4 w-4 mr-1" />
                  Desktop
                </Button>
                <Button
                  variant={selectedView === "mobile" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedView("mobile")}
                >
                  <Smartphone className="h-4 w-4 mr-1" />
                  Mobile
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {analysis.screenshots && (
                <div className="bg-gray-50 rounded-lg p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      selectedView === "desktop"
                        ? analysis.screenshots.desktop
                        : analysis.screenshots.mobile
                    }
                    alt={`${selectedView} Screenshot`}
                    className="w-full h-auto rounded border shadow-sm"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Tab Content (66%) */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === "ux" && (
            <>
              {/* Overall Score */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="text-center md:text-left">
                      <div
                        className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-3xl font-bold ${getOverallScoreColor(
                          analysis.overallScore
                        )}`}
                      >
                        {analysis.overallScore.toFixed(1)}
                      </div>
                      <div className="mt-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Gesamt-Score
                        </h3>
                        <p className="text-gray-600">
                          {getOverallScoreText(analysis.overallScore)}
                        </p>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        Zusammenfassung
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {analysis.summary}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Scores */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Detaillierte Bewertung
                </h2>
                <div className="grid gap-4 md:grid-cols-1">
                  {analysis.categories.map((category, index) => (
                    <ScoreCard key={index} category={category} />
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={() => setShowAdditionalChecks(true)}
                      className="flex items-center"
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Erweiterte Analysen
                    </Button>
                    <Button variant="outline" className="flex items-center">
                      <Download className="h-4 w-4 mr-2" />
                      PDF-Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === "speed" && (
            <>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Performance Analyse
                </h2>
                <PageSpeedCard url={analysis.url} />
              </div>
            </>
          )}

          {activeTab === "meta" && (
            <>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Meta Tags Analyse
                </h2>
                <MetaTagsCard url={analysis.url} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
