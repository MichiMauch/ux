"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  Globe,
  User,
  TrendingUp,
  Zap,
  Tags,
  Image as ImageIcon,
  Share2,
  Bot,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface Analysis {
  id: number;
  url: string;
  overallScore: number;
  websiteType: string;
  timestamp: string;
  userEmail?: string;
  userId?: number;
  categories: Array<{
    name: string;
    score: number;
  }>;
  pageSpeedData?: {
    desktop?: { performance: number; accessibility: number; bestPractices: number; seo: number };
    mobile?: { performance: number; accessibility: number; bestPractices: number; seo: number };
  };
  metaTagsData?: {
    score: number;
    total: number;
    present: number;
    missing: number;
  };
  faviconData?: {
    score: number;
    present: number;
    missing: number;
  };
  socialPreviewData?: {
    overallScore: number;
    optimizedPlatforms: number;
    totalPlatforms: number;
  };
  geoCheckData?: {
    score: number;
  };
}

interface AnalysisStats {
  totalAnalyses: number;
  avgScore: number;
  topWebsiteTypes: Array<{ type: string; count: number }>;
  scoreDistribution: Array<{ range: string; count: number }>;
}

export default function AnalysesPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [stats, setStats] = useState<AnalysisStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [websiteTypeFilter, setWebsiteTypeFilter] = useState<string>("all");
  const [scoreFilter, setScoreFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d">("30d");
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);

  useEffect(() => {
    fetchAnalyses();
    fetchStats();
  }, [dateRange]);

  const fetchAnalyses = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/analyses?range=${dateRange}`);
      if (response.ok) {
        const data = await response.json();
        setAnalyses(data.analyses);
      }
    } catch (error) {
      console.error("Error fetching analyses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/admin/analyses/stats?range=${dateRange}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching analysis stats:", error);
    }
  };

  const filteredAnalyses = analyses.filter((analysis) => {
    const matchesSearch = 
      analysis.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      analysis.userEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = websiteTypeFilter === "all" || analysis.websiteType === websiteTypeFilter;
    
    const matchesScore = 
      scoreFilter === "all" ||
      (scoreFilter === "high" && analysis.overallScore >= 8) ||
      (scoreFilter === "medium" && analysis.overallScore >= 6 && analysis.overallScore < 8) ||
      (scoreFilter === "low" && analysis.overallScore < 6);
    
    return matchesSearch && matchesType && matchesScore;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-success-600 bg-success-50";
    if (score >= 6) return "text-warning-600 bg-warning-50";
    return "text-danger-600 bg-danger-50";
  };

  const getWebsiteTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      corporate: "Corporate",
      ecommerce: "E-Commerce",
      blog: "Blog/Content",
      saas: "SaaS/Software",
    };
    return labels[type] || type;
  };

  const exportAnalyses = async () => {
    try {
      const response = await fetch(`/api/admin/analyses/export?range=${dateRange}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `analyses-${dateRange}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Error exporting analyses:", error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Analysen</h1>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Analysen</h1>
        <div className="flex items-center space-x-2">
          <div className="flex rounded-md shadow-sm">
            {["7d", "30d", "90d"].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range as "7d" | "30d" | "90d")}
                className={`px-3 py-1 text-sm font-medium border ${
                  dateRange === range
                    ? "bg-primary-50 border-primary-500 text-primary-700"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                } ${
                  range === "7d" ? "rounded-l-md" : range === "90d" ? "rounded-r-md" : ""
                }`}
              >
                {range === "7d" ? "7 Tage" : range === "30d" ? "30 Tage" : "90 Tage"}
              </button>
            ))}
          </div>
          <Button onClick={exportAnalyses} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-primary-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Gesamt Analysen</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalAnalyses}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-success-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Durchschnittlicher Score</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.avgScore.toFixed(1)}/10</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Globe className="h-8 w-8 text-warning-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Beliebter Typ</p>
                  <p className="text-lg font-bold text-gray-900">
                    {stats.topWebsiteTypes[0] ? getWebsiteTypeLabel(stats.topWebsiteTypes[0].type) : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-primary-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Heute</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analyses.filter(a => new Date(a.timestamp).toDateString() === new Date().toDateString()).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Suche nach URL oder Benutzer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={websiteTypeFilter}
                onChange={(e) => setWebsiteTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">Alle Typen</option>
                <option value="corporate">Corporate</option>
                <option value="ecommerce">E-Commerce</option>
                <option value="blog">Blog/Content</option>
                <option value="saas">SaaS/Software</option>
              </select>
              
              <select
                value={scoreFilter}
                onChange={(e) => setScoreFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">Alle Scores</option>
                <option value="high">Hoch (8-10)</option>
                <option value="medium">Mittel (6-8)</option>
                <option value="low">Niedrig (0-6)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analyses Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Analysen ({filteredAnalyses.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Website</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Score</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Typ</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Benutzer</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Datum</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Details</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {filteredAnalyses.map((analysis) => (
                  <tr key={analysis.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 max-w-xs truncate">
                            {analysis.url}
                          </p>
                          <p className="text-xs text-gray-500">ID: {analysis.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={`${getScoreColor(analysis.overallScore)} px-2 py-1`}>
                        {analysis.overallScore.toFixed(1)}/10
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-900">
                        {getWebsiteTypeLabel(analysis.websiteType)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {analysis.userEmail || "Anonym"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-500">{formatDate(analysis.timestamp)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1">
                        {analysis.pageSpeedData && (
                          <Zap className="h-3 w-3 text-primary-600" />
                        )}
                        {analysis.metaTagsData && (
                          <Tags className="h-3 w-3 text-success-600" />
                        )}
                        {analysis.faviconData && (
                          <ImageIcon className="h-3 w-3 text-warning-600" />
                        )}
                        {analysis.socialPreviewData && (
                          <Share2 className="h-3 w-3 text-primary-600" />
                        )}
                        {analysis.geoCheckData && (
                          <Bot className="h-3 w-3 text-purple-600" />
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedAnalysis(analysis)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={analysis.url} target="_blank">
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Detail Modal */}
      {selectedAnalysis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Analyse Details: {selectedAnalysis.url}</span>
                <Button variant="ghost" onClick={() => setSelectedAnalysis(null)}>
                  ×
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Gesamt-Score</p>
                  <p className="text-lg font-bold text-gray-900">{selectedAnalysis.overallScore.toFixed(1)}/10</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Website-Typ</p>
                  <p className="text-lg font-bold text-gray-900">{getWebsiteTypeLabel(selectedAnalysis.websiteType)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Benutzer</p>
                  <p className="text-lg font-bold text-gray-900">{selectedAnalysis.userEmail || "Anonym"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Datum</p>
                  <p className="text-lg font-bold text-gray-900">{formatDate(selectedAnalysis.timestamp)}</p>
                </div>
              </div>

              {/* UX Categories */}
              <div>
                <h3 className="text-lg font-semibold mb-3">UX-Kategorien</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedAnalysis.categories.map((category, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{category.name}</span>
                        <Badge className={getScoreColor(category.score)}>
                          {category.score.toFixed(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* PageSpeed Data */}
                {selectedAnalysis.pageSpeedData && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Zap className="h-4 w-4 mr-2" />
                      PageSpeed Insights
                    </h4>
                    <div className="space-y-2">
                      {selectedAnalysis.pageSpeedData.desktop && (
                        <div className="p-2 bg-gray-50 rounded">
                          <p className="text-sm font-medium">Desktop</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <span>Performance: {selectedAnalysis.pageSpeedData.desktop.performance}</span>
                            <span>SEO: {selectedAnalysis.pageSpeedData.desktop.seo}</span>
                          </div>
                        </div>
                      )}
                      {selectedAnalysis.pageSpeedData.mobile && (
                        <div className="p-2 bg-gray-50 rounded">
                          <p className="text-sm font-medium">Mobile</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <span>Performance: {selectedAnalysis.pageSpeedData.mobile.performance}</span>
                            <span>SEO: {selectedAnalysis.pageSpeedData.mobile.seo}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Meta Tags Data */}
                {selectedAnalysis.metaTagsData && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Tags className="h-4 w-4 mr-2" />
                      Meta Tags
                    </h4>
                    <div className="p-2 bg-gray-50 rounded">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <span>Score: {selectedAnalysis.metaTagsData.score}%</span>
                        <span>Vorhanden: {selectedAnalysis.metaTagsData.present}</span>
                        <span>Fehlend: {selectedAnalysis.metaTagsData.missing}</span>
                        <span>Gesamt: {selectedAnalysis.metaTagsData.total}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}