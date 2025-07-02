"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, ChevronDown } from "lucide-react";
import { WebsiteType } from "@/types/analysis";

interface URLInputFormProps {
  onSubmit: (url: string, type: WebsiteType) => void;
  loading?: boolean;
}

// Website Type Options with Display Names and Descriptions
const websiteTypeOptions = [
  {
    value: "corporate" as WebsiteType,
    label: "Corporate Website",
    description: "Unternehmenswebsite, Firmenauftritt",
  },
  {
    value: "ecommerce" as WebsiteType,
    label: "E-Commerce Shop",
    description: "Online-Shop, Marketplace",
  },
  {
    value: "blog" as WebsiteType,
    label: "Blog/Content",
    description: "Blog, News, Magazine",
  },
  {
    value: "saas" as WebsiteType,
    label: "SaaS/Software",
    description: "Software, Tools, Apps",
  },
  {
    value: "education" as WebsiteType,
    label: "Bildung",
    description: "Schule, Universität, Kurse",
  },
  {
    value: "healthcare" as WebsiteType,
    label: "Gesundheitswesen",
    description: "Arztpraxis, Klinik, Medizin",
  },
  {
    value: "government" as WebsiteType,
    label: "Behörden",
    description: "Öffentliche Verwaltung, Amt",
  },
  {
    value: "nonprofit" as WebsiteType,
    label: "Non-Profit",
    description: "Verein, Stiftung, NGO",
  },
  {
    value: "restaurant" as WebsiteType,
    label: "Restaurant",
    description: "Gastronomie, Café, Hotel",
  },
  {
    value: "portfolio" as WebsiteType,
    label: "Portfolio",
    description: "Kreative, Künstler, Designer",
  },
  {
    value: "personal" as WebsiteType,
    label: "Persönlich",
    description: "Private Website, CV",
  },
  {
    value: "landingpage" as WebsiteType,
    label: "Landing Page",
    description: "Produktseite, Campaign",
  },
];

export function URLInputForm({ onSubmit, loading = false }: URLInputFormProps) {
  const [url, setUrl] = useState("");
  const [websiteType, setWebsiteType] = useState<WebsiteType>("corporate");
  const [urlError, setUrlError] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const validateUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      setUrlError("Bitte geben Sie eine URL ein");
      return;
    }

    // Add protocol if missing
    let processedUrl = url.trim();
    if (
      !processedUrl.startsWith("http://") &&
      !processedUrl.startsWith("https://")
    ) {
      processedUrl = "https://" + processedUrl;
    }

    if (!validateUrl(processedUrl)) {
      setUrlError("Bitte geben Sie eine gültige URL ein");
      return;
    }

    setUrlError("");
    onSubmit(processedUrl, websiteType);
  };

  const selectedOption = websiteTypeOptions.find(
    (option) => option.value === websiteType
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          UX Website Checker
        </CardTitle>
        <CardDescription className="text-lg">
          Analysieren Sie die User Experience Ihrer Website mit KI-Power
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* URL Input */}
          <div className="space-y-2">
            <label htmlFor="url" className="text-sm font-medium">
              Website URL
            </label>
            <Input
              id="url"
              type="text"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setUrlError("");
              }}
              className={urlError ? "border-red-500" : ""}
              disabled={loading}
            />
            {urlError && <p className="text-sm text-red-500">{urlError}</p>}
          </div>

          {/* Website Type Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Website-Typ</label>
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                disabled={loading}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{selectedOption?.label}</div>
                    <div className="text-sm text-gray-500">
                      {selectedOption?.description}
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-400 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {websiteTypeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                        websiteType === option.value
                          ? "bg-blue-50 border-l-4 border-blue-500"
                          : ""
                      }`}
                      onClick={() => {
                        setWebsiteType(option.value);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-gray-500">
                        {option.description}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 text-lg font-medium"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analysiere Website...
              </>
            ) : (
              "UX-Analyse starten"
            )}
          </Button>
        </form>

        {/* Features Preview */}
        <div className="mt-8 pt-6 border-t">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Was Sie erhalten:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Desktop & Mobile Screenshots</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>KI-basierte UX-Bewertung</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Konkrete Verbesserungsvorschläge</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
