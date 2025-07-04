"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreCard } from "./score-card";
import { AdditionalChecks } from "./additional-checks";
import PageSpeedCard from "./pagespeed-card";
import MetaTagsCard from "./meta-tags-card";
import FaviconCard from "./favicon-card";
import SocialPreviewCard from "./social-preview-card";
import GeoCheckCard from "./geo-check-card";
import GetReportForm from "../reports/GetReportForm";
import useSWR from "swr";
import { MetaTag } from "@/types/analysis";
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
  Image as ImageIcon,
  Share2,
  Bot,
  Loader2,
  ChevronDown,
  LucideProps // Import LucideProps
} from "lucide-react";
import { AnalysisResult } from "@/types/analysis";

interface AnalysisDashboardProps {
  analysis: AnalysisResult;
  onNewAnalysis: () => void;
}

interface TabConfig {
  id: string;
  label: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  badge?: string; // Make badge optional
}

// Navigation structure
const NAVIGATION_CONFIG: {
  [key: string]: {
    label: string;
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
    tabs: TabConfig[];
  };
} = {
  analysis: {
    label: "UX Analyse",
    icon: Eye,
    tabs: [
      { id: "ux", label: "UX Check", icon: Eye }
    ]
  },
  seo: {
    label: "SEO & Meta",
    icon: Tags,
    tabs: [
      { id: "meta", label: "Meta Tags", icon: Tags },
      { id: "favicon", label: "Favicon & Icons", icon: ImageIcon },
      { id: "preview", label: "Social Preview", icon: Share2 }
    ]
  },
  performance: {
    label: "Performance",
    icon: Zap,
    tabs: [
      { id: "speed", label: "Speed Test", icon: Zap },
      { id: "geo", label: "GEO Check", icon: Bot, badge: "NEW" }
    ]
  },
  reports: {
    label: "Reports",
    icon: Download,
    tabs: [
      { id: "report", label: "PDF Report", icon: Download }
    ]
  }
};

export function AnalysisDashboard({
  analysis,
  onNewAnalysis,
}: AnalysisDashboardProps) {
  const [selectedView, setSelectedView] = useState<"desktop" | "mobile">("desktop");
  const [activeCategory, setActiveCategory] = useState<"analysis" | "seo" | "performance" | "reports">("analysis");
  const [activeTab, setActiveTab] = useState<string>("ux");
  const [showAdditionalChecks, setShowAdditionalChecks] = useState(false);

  // Monitor loading states of different analyses and save incrementally
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const [savedData, setSavedData] = useState({
    pageSpeedDesktop: false,
    pageSpeedMobile: false,
    metaTags: false,
    geoCheck: false
  });

  const { data: pageSpeedDesktop, isLoading: speedLoadingDesktop } = useSWR(
    `/api/pagespeed?url=${encodeURIComponent(analysis.url)}&strategy=desktop`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const { data: pageSpeedMobile, isLoading: speedLoadingMobile } = useSWR(
    `/api/pagespeed?url=${encodeURIComponent(analysis.url)}&strategy=mobile`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const { data: metaTagsData, isLoading: metaLoading } = useSWR(
    `/api/meta-tags?url=${encodeURIComponent(analysis.url)}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const { data: faviconData, isLoading: faviconLoading } = useSWR(
    `/api/favicon-check?url=${encodeURIComponent(analysis.url)}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const { data: socialPreviewData, isLoading: socialPreviewLoading } = useSWR(
    `/api/social-preview?url=${encodeURIComponent(analysis.url)}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  // Save functions (keeping existing logic)
  const savePageSpeedDesktopData = useCallback(async () => {
    if (savedData.pageSpeedDesktop || speedLoadingDesktop || !pageSpeedDesktop || !analysis.analysisId) {
      return;
    }

    try {
      const response = await fetch("/api/update-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          analysisId: analysis.analysisId,
          pageSpeedData: [
            {
              strategy: 'desktop',
              performance: pageSpeedDesktop.performance,
              accessibility: pageSpeedDesktop.accessibility,
              bestPractices: pageSpeedDesktop.bestPractices,
              seo: pageSpeedDesktop.seo
            }
          ]
        }),
      });

      if (response.ok) {
        setSavedData(prev => ({ ...prev, pageSpeedDesktop: true }));
        console.log("PageSpeed Desktop aktualisiert für Analysis ID:", analysis.analysisId);
      }
    } catch (error) {
      console.error("Fehler beim Aktualisieren der PageSpeed Desktop-Daten:", error);
    }
  }, [savedData.pageSpeedDesktop, speedLoadingDesktop, pageSpeedDesktop, analysis.analysisId]);

  const savePageSpeedMobileData = useCallback(async () => {
    if (savedData.pageSpeedMobile || speedLoadingMobile || !pageSpeedMobile || !analysis.analysisId) {
      return;
    }

    try {
      const response = await fetch("/api/update-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          analysisId: analysis.analysisId,
          pageSpeedData: [
            {
              strategy: 'mobile',
              performance: pageSpeedMobile.performance,
              accessibility: pageSpeedMobile.accessibility,
              bestPractices: pageSpeedMobile.bestPractices,
              seo: pageSpeedMobile.seo
            }
          ]
        }),
      });

      if (response.ok) {
        setSavedData(prev => ({ ...prev, pageSpeedMobile: true }));
        console.log("PageSpeed Mobile aktualisiert für Analysis ID:", analysis.analysisId);
      }
    } catch (error) {
      console.error("Fehler beim Aktualisieren der PageSpeed Mobile-Daten:", error);
    }
  }, [savedData.pageSpeedMobile, speedLoadingMobile, pageSpeedMobile, analysis.analysisId]);

  const saveMetaTagsData = useCallback(async () => {
    console.log('saveMetaTagsData called:', {
      savedData: savedData.metaTags,
      metaLoading,
      hasMetaTagsData: !!metaTagsData,
      hasAnalysisId: !!analysis.analysisId,
      metaTagsDataStructure: metaTagsData ? Object.keys(metaTagsData) : null
    });

    if (savedData.metaTags || metaLoading || !metaTagsData || !analysis.analysisId) {
      console.log('saveMetaTagsData: Early return, not saving');
      return;
    }

    console.log('saveMetaTagsData: Processing meta tags data:', metaTagsData);

    try {
      const transformedData = {
        score: metaTagsData.summary?.score || 0,
        total: metaTagsData.summary?.total || 0,
        present: metaTagsData.summary?.present || 0,
        missing: metaTagsData.summary?.missing || 0,
        tags: metaTagsData.checks?.map((check: MetaTag) => ({
          tag: check.tag,
          content: check.content || '',
          status: check.present ? 'present' : 'missing'
        })) || []
      };

      console.log('saveMetaTagsData: Transformed data:', transformedData);

      const response = await fetch("/api/update-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          analysisId: analysis.analysisId,
          metaTagsData: transformedData
        }),
      });

      if (response.ok) {
        setSavedData(prev => ({ ...prev, metaTags: true }));
        console.log("Meta-Tags-Daten aktualisiert für Analysis ID:", analysis.analysisId);
      } else {
        console.error("Meta Tags update failed:", await response.text());
      }
    } catch (error) {
      console.error("Fehler beim Aktualisieren der Meta-Tags-Daten:", error);
    }
  }, [savedData.metaTags, metaLoading, metaTagsData, analysis.analysisId]);

  const saveGeoCheckData = useCallback(async (geoData: any) => {
    if (savedData.geoCheck || !geoData || !analysis.analysisId) {
      return;
    }

    try {
      console.log('saveGeoCheckData: Starting to save GEO data', geoData);

      const transformedData = {
        score: geoData.score,
        factors: geoData.factors,
        timestamp: geoData.timestamp
      };

      console.log('saveGeoCheckData: Transformed data:', transformedData);

      const response = await fetch("/api/update-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          analysisId: analysis.analysisId,
          geoCheckData: transformedData
        }),
      });

      if (response.ok) {
        setSavedData(prev => ({ ...prev, geoCheck: true }));
        console.log("GEO-Check-Daten aktualisiert für Analysis ID:", analysis.analysisId);
      } else {
        console.error("GEO check update failed:", await response.text());
      }
    } catch (error) {
      console.error("Fehler beim Aktualisieren der GEO-Check-Daten:", error);
    }
  }, [savedData.geoCheck, analysis.analysisId]);

  // Trigger incremental saves when data is available
  useEffect(() => {
    savePageSpeedDesktopData();
  }, [savePageSpeedDesktopData]);

  useEffect(() => {
    savePageSpeedMobileData();
  }, [savePageSpeedMobileData]);

  useEffect(() => {
    saveMetaTagsData();
  }, [saveMetaTagsData]);

  const getOverallScoreColor = (score: number) => {
    if (score >= 8) return "text-success-600 bg-success-50";
    if (score >= 6) return "text-warning-600 bg-warning-50";
    return "text-danger-600 bg-danger-50";
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

  const isLoading = (category: string) => {
    switch (category) {
      case "seo":
        return metaLoading || faviconLoading || socialPreviewLoading;
      case "performance":
        return speedLoadingDesktop || speedLoadingMobile;
      default:
        return false;
    }
  };

  const handleCategoryChange = (category: keyof typeof NAVIGATION_CONFIG) => {
    setActiveCategory(category as "performance" | "seo" | "analysis" | "reports");
    setActiveTab(NAVIGATION_CONFIG[category].tabs[0].id);
  };

  const getCurrentCategoryTabs = () => {
    return NAVIGATION_CONFIG[activeCategory]?.tabs || [];
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

      {/* Main Category Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-1 overflow-x-auto">
          {Object.entries(NAVIGATION_CONFIG).map(([key, config]) => {
            const IconComponent = config.icon;
            const isActive = activeCategory === key;
            const loading = isLoading(key);
            
            return (
              <button
                key={key}
                onClick={() => handleCategoryChange(key as keyof typeof NAVIGATION_CONFIG)}
                className={`whitespace-nowrap py-2 px-4 border-b-2 font-medium text-sm transition-colors ${
                  isActive
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <IconComponent className="h-4 w-4" />
                  <span>{config.label}</span>
                  {loading ? (
                    <Loader2 className="h-3 w-3 animate-spin text-primary-500" />
                  ) : (
                    <Badge variant="outline" className="bg-success-50 text-success-600">
                      ✓
                    </Badge>
                  )}
                  {config.tabs.length > 1 && (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sub-Navigation for Categories with Multiple Tabs */}
      {getCurrentCategoryTabs().length > 1 && (
        <div className="bg-gray-50 border-b border-gray-200">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-1 py-3 overflow-x-auto">
              {getCurrentCategoryTabs().map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`text-sm font-medium px-3 py-2 rounded-md transition-colors whitespace-nowrap ${
                      isActive
                        ? "bg-primary-100 text-primary-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <IconComponent className="h-3 w-3" />
                      <span>{tab.label}</span>
                      {tab.badge && (
                        <Badge variant="outline" className="bg-primary-50 text-primary-600 text-xs">
                          {tab.badge}
                        </Badge>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      )}

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
          {activeCategory === "analysis" && activeTab === "ux" && (
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
                    <Button
                      variant="outline"
                      className="flex items-center"
                      onClick={() => {
                        setActiveCategory("reports");
                        setActiveTab("report");
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      PDF-Report erhalten
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeCategory === "performance" && activeTab === "speed" && (
            <div>
              <PageSpeedCard url={analysis.url} analysisId={analysis.analysisId} />
            </div>
          )}

          {activeCategory === "performance" && activeTab === "geo" && (
            <div>
              <GeoCheckCard 
                url={analysis.url} 
                analysisId={analysis.analysisId}
                onDataUpdate={saveGeoCheckData}
              />
            </div>
          )}

          {activeCategory === "seo" && activeTab === "meta" && (
            <div>
              <MetaTagsCard url={analysis.url} />
            </div>
          )}

          {activeCategory === "seo" && activeTab === "favicon" && (
            <div>
              <FaviconCard url={analysis.url} />
            </div>
          )}

          {activeCategory === "seo" && activeTab === "preview" && (
            <div>
              <SocialPreviewCard url={analysis.url} />
            </div>
          )}

          {activeCategory === "reports" && activeTab === "report" && (
            <div>
              <GetReportForm url={analysis.url} uxAnalysis={analysis} analysisId={analysis.analysisId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}