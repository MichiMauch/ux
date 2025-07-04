"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card-new";
import { Badge } from "@/components/ui/badge-new";
import { Button } from "@/components/ui/button-new";
import {
  Globe,
  Calendar,
  ArrowUpRight,
  Mail,
  Download as DownloadIcon,
  FileText,
  Users,
  Clock,
  TrendingUp
} from "lucide-react";
import Link from "next/link";

interface Analysis {
  id: number;
  url: string;
  score: number;
  timestamp: string;
  userEmail?: string;
}

interface EmailSource {
  email: string;
  source: string;
  timestamp: string;
}

interface ReportDownload {
  email: string;
  reportType: string;
  timestamp: string;
}

interface AdminStats {
  totalAnalyses: number;
  totalUsers: number;
  totalDownloads: number;
  totalLeads: number;
  todayAnalyses: number;
  avgScore: number;
  recentAnalyses: Analysis[];
  recentEmailSources: EmailSource[];
  recentReportDownloads: ReportDownload[];
  popularDomains: Array<{
    domain: string;
    count: number;
  }>;
  dailyStats: Array<{
    date: string;
    analyses: number;
    avgScore: number;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/admin/stats`); 
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

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

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <div key={j} className="h-12 bg-gray-100 rounded"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Fehler beim Laden der Dashboard-Daten</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Erneut versuchen
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Gesamt Analysen
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalAnalyses.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-success-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Admin Benutzer
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalUsers.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DownloadIcon className="h-8 w-8 text-warning-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Gesamt Report Downloads
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalDownloads.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Mail className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Gesamt Leads (E-Mails)
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalLeads.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Placeholder for other stats like todayAnalyses, avgScore, etc. */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Analysen Heute
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.todayAnalyses.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Durchschnittlicher Score
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.avgScore.toFixed(1)}/10
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Neueste Analysen */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Neueste Analysen</span>
              <Link href="/admin/analyses">
                <Button variant="outline" size="sm">
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentAnalyses.length === 0 ? (
                <p className="text-gray-500 text-center">Keine Analysen gefunden.</p>
              ) : (
                stats.recentAnalyses.map((analysis) => (
                  <div key={analysis.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {analysis.url}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(analysis.timestamp)}</span>
                            {analysis.userEmail && (
                              <>
                                <span>•</span>
                                <span>{analysis.userEmail}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <Badge className={`${getScoreColor(analysis.score)} px-2 py-1`}>
                        {analysis.score.toFixed(1)}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Neueste Empfehlungen (Email Sources) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Neueste Empfehlungen</span>
              <Badge variant="outline" className="ml-2">
                {stats.totalLeads.toLocaleString()} Gesamt
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentEmailSources.length === 0 ? (
                <p className="text-gray-500 text-center">Keine Empfehlungen gefunden.</p>
              ) : (
                stats.recentEmailSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {source.email}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(source.timestamp)}</span>
                            <span>•</span>
                            <Badge variant="outline">{source.source}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Neueste Report Downloads */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Neueste Report Downloads</span>
              <Badge variant="outline" className="ml-2">
                {stats.totalDownloads.toLocaleString()} Gesamt
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentReportDownloads.length === 0 ? (
                <p className="text-gray-500 text-center">Keine Downloads gefunden.</p>
              ) : (
                stats.recentReportDownloads.map((download, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <DownloadIcon className="h-4 w-4 text-gray-400" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {download.email}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(download.timestamp)}</span>
                            <span>•</span>
                            <Badge variant="outline">{download.reportType}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}