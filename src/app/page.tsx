"use client";

import { useState } from "react";
import { URLInputForm } from "@/components/forms/url-input-form";
import { AnalysisDashboard } from "@/components/results/analysis-dashboard";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Shield, Zap, Target } from "lucide-react";
import { WebsiteType, AnalysisResult, AnalysisCategory } from "@/types/analysis";

type AppState =
  | { stage: "input" }
  | { stage: "processing"; url: string; websiteType: WebsiteType }
  | { stage: "results"; analysis: AnalysisResult };

export default function Home() {
  const [appState, setAppState] = useState<AppState>({ stage: "input" });

  const handleAnalyze = async (url: string, websiteType: WebsiteType) => {
    setAppState({ stage: "processing", url, websiteType });

    try {
      // Step 1: Take screenshots
      const screenshotResponse = await fetch("/api/screenshot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, websiteType }),
      });

      if (!screenshotResponse.ok) {
        throw new Error("Failed to capture screenshots");
      }

      const screenshotResult = await screenshotResponse.json();

      if (screenshotResult.status === "error") {
        throw new Error(screenshotResult.error || "Screenshot capture failed");
      }

      // Step 2: Analyze with AI
      const analyzeResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          screenshots: screenshotResult.screenshots,
          websiteType,
          url,
        }),
      });

      if (!analyzeResponse.ok) {
        throw new Error("Failed to analyze website");
      }

      const analysisResult = await analyzeResponse.json();

      // Immediately save UX analysis data
      try {
        const saveResponse = await fetch("/api/start-check", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "",
            url: analysisResult.url,
            websiteType: analysisResult.websiteType,
            uxAnalysis: {
              score: analysisResult.overallScore,
              details: analysisResult.categories.map((cat: AnalysisCategory) => ({
                category: cat.name,
                score: cat.score,
              })),
            },
            pageSpeedData: [],
            metaTagsData: {
              score: 0,
              total: 0,
              present: 0,
              missing: 0,
              tags: [],
            },
          }),
        });

        const saveResult = await saveResponse.json();
        if (saveResult.success) {
          // Store analysisId in the result for later updates
          analysisResult.analysisId = saveResult.analysisId;
          console.log(
            "UX-Analyse sofort gespeichert, analysisId:",
            saveResult.analysisId
          );
        }
      } catch (error) {
        console.error(
          "Fehler beim sofortigen Speichern der UX-Analyse:",
          error
        );
      }

      setAppState({ stage: "results", analysis: analysisResult });
    } catch (error) {
      console.error("Analysis error:", error);
      alert(
        "Fehler bei der Analyse: " +
          (error instanceof Error ? error.message : "Unbekannter Fehler")
      );
      setAppState({ stage: "input" });
    }
  };

  const handleNewAnalysis = () => {
    setAppState({ stage: "input" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {appState.stage === "input" && (
          <div className="space-y-16">
            {/* Hero Section */}
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <Badge
                  variant="outline"
                  className="px-4 py-2 text-sm font-medium"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Powered by OpenAI GPT-4 Vision
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  Professional website check with Paul AI
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Erhalten Sie detaillierte Insights zur User Experience Ihrer
                  Website. KI-basierte Analyse mit konkreten
                  Verbesserungsvorschlägen für Desktop und Mobile.
                </p>
              </div>
            </div>

            {/* Form */}
            <URLInputForm onSubmit={handleAnalyze} />

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="space-y-4">
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Schnelle Analyse</h3>
                  <p className="text-gray-600">
                    Automatische Screenshots und KI-Bewertung in wenigen Minuten
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="space-y-4">
                  <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    Konkrete Empfehlungen
                  </h3>
                  <p className="text-gray-600">
                    Spezifische Verbesserungsvorschläge für alle Website-Typen
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="space-y-4">
                  <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold">Professionell</h3>
                  <p className="text-gray-600">
                    B2B-taugliche Reports mit detaillierten Scores und Insights
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {appState.stage === "processing" && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-12 text-center space-y-6">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">Analysiere Website</h2>
                  <p className="text-gray-600">
                    Erstelle Screenshots und führe KI-Analyse durch...
                  </p>
                  <p className="text-sm text-blue-600 font-medium">
                    {appState.url}
                  </p>
                </div>
                <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full animate-pulse w-2/3"></div>
                </div>
                <p className="text-xs text-gray-500">
                  Dies kann 30-60 Sekunden dauern
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {appState.stage === "results" && (
          <AnalysisDashboard
            analysis={appState.analysis}
            onNewAnalysis={handleNewAnalysis}
          />
        )}
      </main>

      {appState.stage === "input" && <Footer />}
    </div>
  );
}
