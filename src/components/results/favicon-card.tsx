"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useSWR from "swr";
import { useState } from "react";
import {
  Clock,
  Image,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Smartphone,
  Monitor,
  Tablet,
  Download,
} from "lucide-react";

export type FaviconCheck = {
  type: "favicon" | "apple-touch-icon" | "manifest" | "tile";
  size: string;
  href: string;
  present: boolean;
  description: string;
  recommendation?: string;
};

export type FaviconAnalysisResult = {
  url: string;
  timestamp: string;
  checks: FaviconCheck[];
  summary: {
    total: number;
    present: number;
    missing: number;
    score: number;
  };
  icons: {
    favicon?: string;
    appleTouchIcon?: string;
    icon192?: string;
    icon512?: string;
  };
};

interface FaviconCardProps {
  url: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-success-600";
  if (score >= 60) return "text-warning-600";
  return "text-danger-600";
};

const getStatusIcon = (present: boolean) => {
  if (present) {
    return <CheckCircle className="h-4 w-4 text-success-600" />;
  } else {
    return <XCircle className="h-4 w-4 text-danger-600" />;
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "favicon":
      return <Monitor className="h-4 w-4" />;
    case "apple-touch-icon":
      return <Smartphone className="h-4 w-4" />;
    case "manifest":
      return <Download className="h-4 w-4" />;
    case "tile":
      return <Tablet className="h-4 w-4" />;
    default:
      return <Image className="h-4 w-4" />;
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case "favicon":
      return "Favicon";
    case "apple-touch-icon":
      return "Apple Touch Icon";
    case "manifest":
      return "Web App Manifest";
    case "tile":
      return "Windows Tile";
    default:
      return "Icon";
  }
};

export default function FaviconCard({ url }: FaviconCardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "details" | "recommendations">("overview");

  const { data, error, isLoading } = useSWR<FaviconAnalysisResult>(
    `/api/favicon-check?url=${encodeURIComponent(url)}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Favicon & Touch Icons
          </CardTitle>
          <CardDescription>
            Fehler beim Laden der Favicon-Daten
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-danger-600">
            {error.message || "Unbekannter Fehler"}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Favicon & Touch Icons
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 animate-spin" />
            Favicon und Touch Icons werden analysiert...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const faviconChecks = data.checks.filter((check) => check.type === "favicon");
  const appleTouchChecks = data.checks.filter((check) => check.type === "apple-touch-icon");
  const manifestChecks = data.checks.filter((check) => check.type === "manifest");
  const tileChecks = data.checks.filter((check) => check.type === "tile");
  const missingChecks = data.checks.filter((check) => !check.present);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Favicon & Touch Icons
        </CardTitle>
        <CardDescription>Icons und Manifeste für {url}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div
              className={`text-2xl font-bold ${getScoreColor(data.summary.score)}`}
            >
              {data.summary.score}%
            </div>
            <div className="text-sm text-muted-foreground">Gesamt-Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success-600">
              {data.summary.present}
            </div>
            <div className="text-sm text-muted-foreground">Vorhanden</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-danger-600">
              {data.summary.missing}
            </div>
            <div className="text-sm text-muted-foreground">Fehlend</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {data.summary.total}
            </div>
            <div className="text-sm text-muted-foreground">Gesamt</div>
          </div>
        </div>

        {/* Icons Preview */}
        {(data.icons.favicon || data.icons.appleTouchIcon || data.icons.icon192 || data.icons.icon512) && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Image className="h-4 w-4" />
              Gefundene Icons
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.icons.favicon && (
                <div className="flex flex-col items-center p-3 bg-white rounded-lg border">
                  <img
                    src={data.icons.favicon}
                    alt="Favicon"
                    className="w-8 h-8 mb-2"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <span className="text-xs text-gray-600">Favicon</span>
                </div>
              )}
              {data.icons.appleTouchIcon && (
                <div className="flex flex-col items-center p-3 bg-white rounded-lg border">
                  <img
                    src={data.icons.appleTouchIcon}
                    alt="Apple Touch Icon"
                    className="w-8 h-8 mb-2 rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <span className="text-xs text-gray-600">Apple Touch</span>
                </div>
              )}
              {data.icons.icon192 && (
                <div className="flex flex-col items-center p-3 bg-white rounded-lg border">
                  <img
                    src={data.icons.icon192}
                    alt="Icon 192x192"
                    className="w-8 h-8 mb-2 rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <span className="text-xs text-gray-600">192x192</span>
                </div>
              )}
              {data.icons.icon512 && (
                <div className="flex flex-col items-center p-3 bg-white rounded-lg border">
                  <img
                    src={data.icons.icon512}
                    alt="Icon 512x512"
                    className="w-8 h-8 mb-2 rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <span className="text-xs text-gray-600">512x512</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === "overview"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Monitor className="h-4 w-4" />
              Übersicht
            </button>
            <button
              onClick={() => setActiveTab("details")}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === "details"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Image className="h-4 w-4" />
              Details
              <Badge variant="outline" className="ml-1">
                {data.checks.filter((c) => c.present).length}/{data.checks.length}
              </Badge>
            </button>
            <button
              onClick={() => setActiveTab("recommendations")}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === "recommendations"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <AlertTriangle className="h-4 w-4" />
              Empfehlungen
              <Badge variant="outline" className="ml-1 bg-danger-50 text-danger-600">
                {missingChecks.length}
              </Badge>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "overview" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium mb-2 flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    Desktop Favicon
                  </h5>
                  <div className="space-y-2">
                    {faviconChecks.map((check, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {getStatusIcon(check.present)}
                        <span className="text-sm">{check.size}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium mb-2 flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    Mobile Icons
                  </h5>
                  <div className="space-y-2">
                    {appleTouchChecks.map((check, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {getStatusIcon(check.present)}
                        <span className="text-sm">{check.size}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "details" && (
            <div className="space-y-6">
              {[
                { title: "Favicon", checks: faviconChecks, icon: Monitor },
                { title: "Apple Touch Icons", checks: appleTouchChecks, icon: Smartphone },
                { title: "Web App Manifest", checks: manifestChecks, icon: Download },
                { title: "Windows Tiles", checks: tileChecks, icon: Tablet },
              ].map((section, sectionIndex) => (
                section.checks.length > 0 && (
                  <div key={sectionIndex}>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <section.icon className="h-4 w-4" />
                      {section.title}
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-3 font-medium text-sm text-gray-600">
                              Status
                            </th>
                            <th className="text-left py-2 px-3 font-medium text-sm text-gray-600">
                              Größe
                            </th>
                            <th className="text-left py-2 px-3 font-medium text-sm text-gray-600">
                              Beschreibung
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {section.checks.map((check, index) => (
                            <tr key={index} className="border-b last:border-b-0">
                              <td className="py-2 px-3">
                                {getStatusIcon(check.present)}
                              </td>
                              <td className="py-2 px-3 font-mono text-sm text-primary-600">
                                {check.size}
                              </td>
                              <td className="py-2 px-3 text-sm text-gray-700">
                                {check.description}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )
              ))}
            </div>
          )}

          {activeTab === "recommendations" && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Fehlende Icons und Empfehlungen
              </h4>
              {missingChecks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto text-success-600 mb-3" />
                  <p className="text-lg font-medium text-gray-900 mb-1">
                    Alle Icons vorhanden!
                  </p>
                  <p>
                    Ihre Website hat alle wichtigen Icons und Manifeste korrekt
                    implementiert.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {missingChecks.map((check, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 bg-danger-50"
                    >
                      <div className="flex items-start gap-3">
                        <XCircle className="h-5 w-5 text-danger-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {getTypeLabel(check.type)}
                            </Badge>
                            <code className="text-sm font-mono text-danger-600 bg-danger-100 px-2 py-1 rounded">
                              {check.size}
                            </code>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">
                            {check.description}
                          </p>
                          {check.recommendation && (
                            <p className="text-sm text-danger-700 bg-danger-100 p-2 rounded">
                              💡 {check.recommendation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}