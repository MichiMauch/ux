"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreCard } from "./score-card";
import { AdditionalChecks } from "./additional-checks";
import {
  Monitor,
  Smartphone,
  TrendingUp,
  Calendar,
  Globe,
  Download,
  RotateCcw,
  ArrowRight,
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
  const [selectedView, setSelectedView] = useState<"desktop" | "mobile">(
    "desktop"
  );
  const [showAdditionalChecks, setShowAdditionalChecks] = useState(false);

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
    return <AdditionalChecks analysis={analysis} onNewCheck={onNewAnalysis} />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
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

      {/* Overall Score */}
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            <div className="text-center lg:text-left">
              <div
                className={`inline-flex items-center justify-center w-32 h-32 rounded-full text-4xl font-bold ${getOverallScoreColor(
                  analysis.overallScore
                )}`}
              >
                {analysis.overallScore.toFixed(1)}
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Gesamt-Score
                </h3>
                <p className="text-lg text-gray-600">
                  {getOverallScoreText(analysis.overallScore)}
                </p>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Zusammenfassung
              </h4>
              <p className="text-gray-700 leading-relaxed text-lg">
                {analysis.summary}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Screenshots */}
      {analysis.screenshots && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Website Screenshots</span>
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
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-4">
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
          </CardContent>
        </Card>
      )}

      {/* Detailed Scores */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Detaillierte Bewertung
        </h2>
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {analysis.categories.map((category, index) => (
            <ScoreCard key={index} category={category} />
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setShowAdditionalChecks(true)}
              className="flex items-center"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Erweiterte Analysen starten
            </Button>
            <Button variant="outline" className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              PDF-Report herunterladen
            </Button>
            <Button variant="outline" onClick={onNewAnalysis}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Weitere Website analysieren
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
