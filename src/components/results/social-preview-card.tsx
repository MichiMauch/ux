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
  Share2,
  Eye,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Search,
  MessageCircle,
  Linkedin,
  Facebook,
} from "lucide-react";

export type SocialPreviewData = {
  platform: "google" | "twitter" | "facebook" | "linkedin" | "whatsapp";
  title: string;
  description: string;
  image?: string;
  url: string;
  domain: string;
  hasRequiredTags: boolean;
  missingTags: string[];
  recommendations: string[];
};

export type SocialPreviewResult = {
  url: string;
  timestamp: string;
  previews: SocialPreviewData[];
  summary: {
    totalPlatforms: number;
    optimizedPlatforms: number;
    missingOptimization: number;
    overallScore: number;
  };
};

interface SocialPreviewCardProps {
  url: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case "google":
      return <Search className="h-5 w-5" />;
    case "twitter":
      return <MessageCircle className="h-5 w-5" />;
    case "facebook":
      return <Facebook className="h-5 w-5" />;
    case "linkedin":
      return <Linkedin className="h-5 w-5" />;
    case "whatsapp":
      return <MessageCircle className="h-5 w-5" />;
    default:
      return <Share2 className="h-5 w-5" />;
  }
};

const getPlatformName = (platform: string) => {
  switch (platform) {
    case "google":
      return "Google Suche";
    case "twitter":
      return "Twitter/X";
    case "facebook":
      return "Facebook";
    case "linkedin":
      return "LinkedIn";
    case "whatsapp":
      return "WhatsApp";
    default:
      return platform;
  }
};

const getPlatformColor = (platform: string) => {
  switch (platform) {
    case "google":
      return "border-blue-200 bg-blue-50";
    case "twitter":
      return "border-sky-200 bg-sky-50";
    case "facebook":
      return "border-blue-200 bg-blue-50";
    case "linkedin":
      return "border-blue-200 bg-blue-50";
    case "whatsapp":
      return "border-green-200 bg-green-50";
    default:
      return "border-gray-200 bg-gray-50";
  }
};

const GooglePreview = ({ preview }: { preview: SocialPreviewData }) => (
  <div className="border rounded-lg p-4 bg-white shadow-sm">
    <div className="flex items-start gap-3">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-green-700">{preview.domain}</span>
          <ExternalLink className="h-3 w-3 text-gray-400" />
        </div>
        <h3 className="text-lg text-blue-600 hover:underline cursor-pointer font-normal leading-tight mb-1">
          {preview.title}
        </h3>
        <p className="text-sm text-gray-600 leading-normal">
          {preview.description}
        </p>
      </div>
    </div>
  </div>
);

const TwitterPreview = ({ preview }: { preview: SocialPreviewData }) => (
  <div className="border rounded-lg p-4 bg-white shadow-sm">
    <div className="text-sm text-gray-600 mb-2">
      Link-Vorschau auf Twitter/X
    </div>
    <div className="border rounded-xl overflow-hidden">
      {preview.image && (
        <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
          <img
            src={preview.image}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      )}
      <div className="p-3">
        <p className="text-sm text-gray-500 mb-1">{preview.domain}</p>
        <h3 className="font-medium text-gray-900 leading-tight mb-1">
          {preview.title}
        </h3>
        <p className="text-sm text-gray-600">
          {preview.description}
        </p>
      </div>
    </div>
  </div>
);

const FacebookPreview = ({ preview }: { preview: SocialPreviewData }) => (
  <div className="border rounded-lg p-4 bg-white shadow-sm">
    <div className="text-sm text-gray-600 mb-2">
      Link-Vorschau auf Facebook
    </div>
    <div className="border rounded-lg overflow-hidden">
      {preview.image && (
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
          <img
            src={preview.image}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      )}
      <div className="p-3 bg-gray-50">
        <p className="text-xs text-gray-500 uppercase mb-1">{preview.domain}</p>
        <h3 className="font-semibold text-gray-900 leading-tight mb-1">
          {preview.title}
        </h3>
        <p className="text-sm text-gray-600">
          {preview.description}
        </p>
      </div>
    </div>
  </div>
);

const LinkedInPreview = ({ preview }: { preview: SocialPreviewData }) => (
  <div className="border rounded-lg p-4 bg-white shadow-sm">
    <div className="text-sm text-gray-600 mb-2">
      Link-Vorschau auf LinkedIn
    </div>
    <div className="border rounded overflow-hidden">
      {preview.image && (
        <div className="w-full h-44 bg-gray-100 flex items-center justify-center">
          <img
            src={preview.image}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      )}
      <div className="p-3">
        <h3 className="font-medium text-gray-900 leading-tight mb-1">
          {preview.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          {preview.description}
        </p>
        <p className="text-xs text-gray-500">{preview.domain}</p>
      </div>
    </div>
  </div>
);

const WhatsAppPreview = ({ preview }: { preview: SocialPreviewData }) => (
  <div className="border rounded-lg p-4 bg-white shadow-sm">
    <div className="text-sm text-gray-600 mb-2">
      Link-Vorschau auf WhatsApp
    </div>
    <div className="border rounded-lg overflow-hidden bg-green-50">
      <div className="flex gap-3 p-3">
        {preview.image && (
          <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
            <img
              src={preview.image}
              alt="Preview"
              className="w-full h-full object-cover rounded"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 leading-tight mb-1 truncate">
            {preview.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-1">
            {preview.description}
          </p>
          <p className="text-xs text-gray-500">{preview.domain}</p>
        </div>
      </div>
    </div>
  </div>
);

export default function SocialPreviewCard({ url }: SocialPreviewCardProps) {
  const [activeTab, setActiveTab] = useState<"all" | "google" | "twitter" | "facebook" | "linkedin" | "whatsapp">("all");

  const { data, error, isLoading } = useSWR<SocialPreviewResult>(
    `/api/social-preview?url=${encodeURIComponent(url)}`,
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
            <Share2 className="h-5 w-5" />
            Social Media Vorschau
          </CardTitle>
          <CardDescription>
            Fehler beim Laden der Vorschau-Daten
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
            <Share2 className="h-5 w-5" />
            Social Media Vorschau
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 animate-spin" />
            Social Media Vorschauen werden generiert...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success-600";
    if (score >= 60) return "text-warning-600";
    return "text-danger-600";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Social Media Vorschau
        </CardTitle>
        <CardDescription>
          So sieht Ihr Link aus, wenn er geteilt wird
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(data.summary.overallScore)}`}>
              {data.summary.overallScore}%
            </div>
            <div className="text-sm text-muted-foreground">Optimierung</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success-600">
              {data.summary.optimizedPlatforms}
            </div>
            <div className="text-sm text-muted-foreground">Optimiert</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-danger-600">
              {data.summary.missingOptimization}
            </div>
            <div className="text-sm text-muted-foreground">Verbesserbar</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {data.summary.totalPlatforms}
            </div>
            <div className="text-sm text-muted-foreground">Plattformen</div>
          </div>
        </div>

        {/* Platform Status Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {data.previews.map((preview, index) => (
            <div key={index} className={`border rounded-lg p-3 text-center ${getPlatformColor(preview.platform)}`}>
              <div className="flex justify-center mb-2">
                {getPlatformIcon(preview.platform)}
              </div>
              <div className="text-sm font-medium mb-1">
                {getPlatformName(preview.platform)}
              </div>
              <div className="flex justify-center">
                {preview.hasRequiredTags ? (
                  <CheckCircle className="h-4 w-4 text-success-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-warning-600" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap ${
                activeTab === "all"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Eye className="h-4 w-4" />
              Alle Vorschauen
            </button>
            {data.previews.map((preview, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(preview.platform)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap ${
                  activeTab === preview.platform
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {getPlatformIcon(preview.platform)}
                {getPlatformName(preview.platform)}
                {!preview.hasRequiredTags && (
                  <Badge variant="outline" className="bg-warning-50 text-warning-600">
                    !
                  </Badge>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "all" && (
            <div className="grid gap-6">
              {data.previews.map((preview, index) => (
                <div key={index}>
                  <div className="flex items-center gap-2 mb-3">
                    {getPlatformIcon(preview.platform)}
                    <h4 className="font-semibold">{getPlatformName(preview.platform)}</h4>
                    {preview.hasRequiredTags ? (
                      <Badge variant="outline" className="bg-success-50 text-success-600">
                        Optimiert
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-warning-50 text-warning-600">
                        Verbesserbar
                      </Badge>
                    )}
                  </div>
                  
                  {preview.platform === "google" && <GooglePreview preview={preview} />}
                  {preview.platform === "twitter" && <TwitterPreview preview={preview} />}
                  {preview.platform === "facebook" && <FacebookPreview preview={preview} />}
                  {preview.platform === "linkedin" && <LinkedInPreview preview={preview} />}
                  {preview.platform === "whatsapp" && <WhatsAppPreview preview={preview} />}
                  
                  {!preview.hasRequiredTags && preview.missingTags.length > 0 && (
                    <div className="mt-3 p-3 bg-warning-50 border border-warning-200 rounded-lg">
                      <h5 className="font-medium text-warning-800 mb-2">Fehlende Optimierungen:</h5>
                      <ul className="text-sm text-warning-700 space-y-1">
                        {preview.missingTags.map((tag, tagIndex) => (
                          <li key={tagIndex}>• {tag}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {preview.recommendations.length > 0 && (
                    <div className="mt-3 p-3 bg-primary-50 border border-primary-200 rounded-lg">
                      <h5 className="font-medium text-primary-800 mb-2">Empfehlungen:</h5>
                      <ul className="text-sm text-primary-700 space-y-1">
                        {preview.recommendations.map((rec, recIndex) => (
                          <li key={recIndex}>💡 {rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab !== "all" && (
            <div>
              {data.previews
                .filter(preview => preview.platform === activeTab)
                .map((preview, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex items-center gap-2">
                      {getPlatformIcon(preview.platform)}
                      <h4 className="font-semibold text-lg">{getPlatformName(preview.platform)}</h4>
                      {preview.hasRequiredTags ? (
                        <Badge variant="outline" className="bg-success-50 text-success-600">
                          Vollständig optimiert
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-warning-50 text-warning-600">
                          Optimierung möglich
                        </Badge>
                      )}
                    </div>
                    
                    {preview.platform === "google" && <GooglePreview preview={preview} />}
                    {preview.platform === "twitter" && <TwitterPreview preview={preview} />}
                    {preview.platform === "facebook" && <FacebookPreview preview={preview} />}
                    {preview.platform === "linkedin" && <LinkedInPreview preview={preview} />}
                    {preview.platform === "whatsapp" && <WhatsAppPreview preview={preview} />}
                    
                    {!preview.hasRequiredTags && (
                      <div className="p-4 bg-warning-50 border border-warning-200 rounded-lg">
                        <h5 className="font-medium text-warning-800 mb-3">Verbesserungsmöglichkeiten:</h5>
                        
                        {preview.missingTags.length > 0 && (
                          <div className="mb-4">
                            <h6 className="font-medium text-warning-700 mb-2">Fehlende Meta-Tags:</h6>
                            <ul className="text-sm text-warning-600 space-y-1 ml-4">
                              {preview.missingTags.map((tag, tagIndex) => (
                                <li key={tagIndex} className="list-disc">{tag}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {preview.recommendations.length > 0 && (
                          <div>
                            <h6 className="font-medium text-warning-700 mb-2">Empfehlungen:</h6>
                            <ul className="text-sm text-warning-600 space-y-1">
                              {preview.recommendations.map((rec, recIndex) => (
                                <li key={recIndex}>💡 {rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}